"""Mister Vi · Elo por superfície (ATP/WTA/Challenger/ITF) — calculado jogo a jogo, sem ver o futuro.
Avalia a calibração nos jogos de tour de 2025-06 em diante e exporta ratings para a app."""
import csv, glob, json, math, re, sys, os
from collections import defaultdict

SRC = '/home/claude/aneeshers/tennis-sackmann-archive'
OUT = '/home/claude/vi-build/out'
os.makedirs(OUT, exist_ok=True)
YEARS = range(2012, 2027)
ROUND = {'Q1': 1, 'Q2': 2, 'Q3': 3, 'Q4': 4, 'R128': 10, 'R64': 11, 'R32': 12, 'R16': 13, 'QF': 14, 'SF': 15, 'F': 16, 'RR': 13, 'BR': 15, 'ER': 12}

def load(tour):
    rows = []
    pats = [f'{SRC}/{tour}/{tour}_matches_{y}.csv' for y in YEARS]
    pats += [f'{SRC}/{tour}/{tour}_matches_qual_chall_{y}.csv' for y in YEARS] if tour == 'atp' else [f'{SRC}/{tour}/{tour}_matches_qual_itf_{y}.csv' for y in YEARS]
    for f in pats:
        if not os.path.exists(f): continue
        for r in csv.DictReader(open(f, encoding='utf-8', errors='ignore')):
            sc = r.get('score') or ''
            if not sc or 'W/O' in sc or 'Walkover' in sc or 'DEF' in sc or 'unfinished' in sc.lower(): continue
            r['_ret'] = 'RET' in sc
            r['_tour'] = tour
            r['_main'] = '_qual_' not in f
            rows.append(r)
    # tirar duplicados (alguns torneios aparecem nos dois ficheiros)
    seen, out = set(), []
    for r in rows:
        k = (r['tourney_id'], r['match_num'], r['winner_id'], r['loser_id'])
        if k in seen: continue
        seen.add(k); out.append(r)
    out.sort(key=lambda r: (r['tourney_date'], r['tourney_id'], ROUND.get(r['round'], 9), int(r['match_num'] or 0)))
    return out

def level_k(r):
    lv = r['tourney_level']
    if lv in ('G', 'M', 'A', 'F', 'P', 'PM', 'I', 'D', 'O', 'W'): return 1.0     # tour (e Taça Davis/BJK)
    if lv == 'C': return 0.85                                                  # Challenger / WTA 125
    return 0.7                                                                 # ITF

SURF = {'Hard': 'h', 'Clay': 'c', 'Grass': 'g', 'Carpet': 'h'}

def run(tour, P):
    rows = load(tour)
    R = defaultdict(lambda: 1500.0); N = defaultdict(int)
    RS = defaultdict(lambda: 1500.0); NS = defaultdict(int)
    preds = []
    K = lambda n: P['k'] / (n + P['off']) ** P['sh']
    for r in rows:
        w, l = r['winner_id'], r['loser_id']; s = SURF.get(r['surface'], 'h')
        rw = (1 - P['ws']) * R[w] + P['ws'] * RS[(w, s)]
        rl = (1 - P['ws']) * R[l] + P['ws'] * RS[(l, s)]
        p = 1 / (1 + 10 ** ((rl - rw) / 400))
        if r['best_of'] == '5' and P.get('bo5', True):
            # 3 sets → 5 sets: probabilidade de set q tal que p3(q) = p; depois p5(q)
            lo, hi = 0.0, 1.0
            for _ in range(40):
                q = (lo + hi) / 2; p3 = q * q * (3 - 2 * q)
                if p3 < p: lo = q
                else: hi = q
            p = q ** 3 * (10 - 15 * q + 6 * q * q)
        preds.append((r, p, N[w], N[l]))
        lk = level_k(r) * (P['ret'] if r['_ret'] else 1.0)
        d = 1 - 1 / (1 + 10 ** ((R[l] - R[w]) / 400))
        R[w] += K(N[w]) * lk * d; R[l] -= K(N[l]) * lk * d
        ds = 1 - 1 / (1 + 10 ** ((RS[(l, s)] - RS[(w, s)]) / 400))
        RS[(w, s)] += K(NS[(w, s)]) * lk * ds; RS[(l, s)] -= K(NS[(l, s)]) * lk * ds
        N[w] += 1; N[l] += 1; NS[(w, s)] += 1; NS[(l, s)] += 1
    return rows, preds, R, N, RS, NS

def evaluate(preds, since='20250601', tour_only=True, minn=10):
    ll = br = acc = n = 0
    buckets = defaultdict(lambda: [0, 0, 0.0])
    for r, p, nw, nl in preds:
        if r['tourney_date'] < since: continue
        if tour_only and r['tourney_level'] in ('C', '15', '25', '35', '50', '75', '100', 'S'): continue
        if not r['_main'] and tour_only: continue
        if min(nw, nl) < minn: continue
        # orientar aleatoriamente (o vencedor é sempre «w»): usar p e 1-p de forma simétrica
        q = min(max(p, 1e-6), 1 - 1e-6)
        ll += -math.log(q); br += (1 - q) ** 2; acc += q > 0.5; n += 1
        fav = max(q, 1 - q); won = q >= 0.5
        b = min(int(fav * 20) / 20, 0.95)
        buckets[b][0] += 1; buckets[b][1] += won; buckets[b][2] += fav
    return {'n': n, 'logloss': ll / n, 'brier': br / n, 'acc': acc / n, 'cal': {f'{k:.2f}': (v[0], round(v[1] / v[0], 3), round(v[2] / v[0], 3)) for k, v in sorted(buckets.items())}}

if __name__ == '__main__':
    base = {'k': 250, 'off': 5, 'sh': 0.4, 'ws': 0.5, 'ret': 0.5}
    for tour in ['atp', 'wta']:
        best = None
        grid = [dict(base, ws=ws, k=k) for ws in (0.3, 0.5, 0.7) for k in (200, 250, 300)]
        for P in grid:
            _, preds, *_ = run(tour, P)
            # afinar em 2023-24, confirmar em 2025-06+
            e_tune = evaluate(preds, since='20230101')
            e_tune = evaluate([x for x in preds if x[0]['tourney_date'] < '20250101'], since='20230101')
            if best is None or e_tune['logloss'] < best[1]['logloss']: best = (P, e_tune)
        P = best[0]
        rows, preds, R, N, RS, NS = run(tour, P)
        e = evaluate(preds, since='20250601')
        print(tour.upper(), 'melhores', P, '| afinação 2023-24 logloss', round(best[1]['logloss'], 4))
        print('  confirmação 2025-06+:', {k: (round(v, 4) if isinstance(v, float) else v) for k, v in e.items() if k != 'cal'})
        print('  calibração (fav% → ganhou):', e['cal'])
        # ranking como referência
        ll = n = acc = 0
        for r, p, nw, nl in preds:
            if r['tourney_date'] < '20250601' or r['tourney_level'] in ('C',) or not r['_main'] or min(nw, nl) < 10: continue
            try: a, b = int(r['winner_rank']), int(r['loser_rank'])
            except: continue
            q = 1 / (1 + math.exp(-0.42 * (math.log(b) - math.log(a))))
            ll += -math.log(min(max(q, 1e-6), 1 - 1e-6)); acc += q > 0.5; n += 1
        print('  referência só pelo ranking: logloss', round(ll / n, 4), 'acerto', round(acc / n, 3), 'n', n)
        json.dump({'P': P, 'eval': e}, open(f'{OUT}/{tour}_eval.json', 'w'))
