"""Mister Vi · teste cego de fatores além do Elo.
Uma passagem cronológica: para cada jogo calcula o Elo (sem ver o futuro) e um conjunto de fatores
conhecidos ANTES do jogo. Depois: regressão logística com o Elo como base, afinada em 2019-2024,
avaliada em 2025-06+ (jogos de tour, quadro principal). Só conta o que melhora fora da amostra."""
import sys, math, json, re, hashlib
from collections import defaultdict, deque
import numpy as np
sys.path.insert(0, '/home/claude/vi-build')
from elo import load, level_k, SURF

def dnum(s):
    s = str(s); return (int(s[:4]) * 372 + int(s[4:6]) * 31 + int(s[6:8]))  # dias aprox. (chega para janelas)

def nsets(score):
    return len([t for t in score.split() if re.match(r'^\d+-\d+', t)])

def bo5p(p):
    lo, hi = 0.0, 1.0
    for _ in range(40):
        q = (lo + hi) / 2
        if q * q * (3 - 2 * q) < p: lo = q
        else: hi = q
    return q ** 3 * (10 - 15 * q + 6 * q * q)

FEATS = ['h2h', 'h2h_raw', 'form', 'mom', 'surfspec', 'fat7', 'prevmin', 'layoff', 'age', 'lefty', 'height_fast', 'svret', 'home']

def build(tour, P):
    rows = load(tour)
    R = defaultdict(lambda: 1500.0); N = defaultdict(int)
    RS = defaultdict(lambda: 1500.0); NS = defaultdict(int)
    K = lambda n: P['k'] / (n + P['off']) ** P['sh']
    H2H = defaultdict(list)                  # (a,b) ordenado -> lista de (resíduo do a, data)
    FORM = defaultdict(float)                # EWMA do resíduo (resultado - esperado)
    HIST = defaultdict(lambda: deque(maxlen=40))   # (dia, rating) para momento
    LAST = {}                                # último dia jogado
    RECENT = defaultdict(lambda: deque(maxlen=12)) # (dia, sets, minutos, torneio)
    SV0 = [0.635, 0.365] if tour == 'atp' else [0.565, 0.435]
    SV = defaultdict(lambda: list(SV0)); NSV = defaultdict(int)
    out = []
    for r in rows:
        w, l = r['winner_id'], r['loser_id']; s = SURF.get(r['surface'], 'h')
        day = dnum(r['tourney_date'])
        # orientação pseudo-aleatória estável
        flip = int(hashlib.md5((r['tourney_id'] + r['match_num'] + w).encode()).hexdigest(), 16) & 1
        A, B = (w, l) if not flip else (l, w)
        y = 1 if A == w else 0
        ra = (1 - P['ws']) * R[A] + P['ws'] * RS[(A, s)]
        rb = (1 - P['ws']) * R[B] + P['ws'] * RS[(B, s)]
        p = 1 / (1 + 10 ** ((rb - ra) / 400))
        if r['best_of'] == '5': p = bo5p(p)
        f = {}
        key = (A, B) if A < B else (B, A); sg = 1 if A < B else -1
        hh = H2H[key]
        f['h2h'] = sg * sum(x for x, _ in hh) / (len(hh) + 3)          # resíduo encolhido (ajustado à força)
        f['h2h_raw'] = sg * sum((1 if x > 0 else -1) for x, _ in hh) / (len(hh) + 3)  # vitórias brutas
        f['form'] = FORM[A] - FORM[B]
        def mom(x):
            h = [rt for d, rt in HIST[x] if day - d <= 90]
            return (R[x] - h[0]) / 100 if h else 0.0
        f['mom'] = mom(A) - mom(B)
        f['surfspec'] = ((RS[(A, s)] - R[A]) - (RS[(B, s)] - R[B])) / 100
        def fat(x):
            sets = sum(st for d, st, m, t in RECENT[x] if 0 <= day - d <= 7)
            return sets
        f['fat7'] = (fat(A) - fat(B)) / 5
        def prevm(x):
            q = [m for d, st, m, t in RECENT[x] if t == r['tourney_id']]
            return q[-1] if q else 0.0
        f['prevmin'] = (prevm(A) - prevm(B)) / 60
        def lay(x):
            if x not in LAST: return 0.0
            g = day - LAST[x]; return 1.0 if g > 60 else 0.0
        f['layoff'] = lay(A) - lay(B)
        def age(x, side):
            try: a = float(r['winner_age'] if x == w else r['loser_age'])
            except: return 0.0
            return max(0.0, a - 31) / 3
        f['age'] = age(A, 0) - age(B, 0)
        ha = (r['winner_hand'] if A == w else r['loser_hand']); hb = (r['winner_hand'] if B == w else r['loser_hand'])
        f['lefty'] = (1 if ha == 'L' and hb == 'R' else -1 if hb == 'L' and ha == 'R' else 0)
        def ht(x):
            try: return (float(r['winner_ht'] if x == w else r['loser_ht']) - 185) / 10
            except: return 0.0
        f['height_fast'] = (ht(A) - ht(B)) * (1 if s in 'gh' else -1)
        ok = NSV[A] >= 5 and NSV[B] >= 5
        f['svret'] = ((SV[A][0] + SV[A][1]) - (SV[B][0] + SV[B][1])) * 10 if ok else 0.0
        f['home'] = 0.0
        tn = r['tourney_name']
        ia = r['winner_ioc'] if A == w else r['loser_ioc']; ib = r['winner_ioc'] if B == w else r['loser_ioc']
        tg = sum(int(a) + int(b) for a, b in re.findall(r'(\d+)-(\d+)', re.sub(r'\(\d+\)', '', r['score'])))
        out.append((r['tourney_date'], r['tourney_level'], r['_main'], min(N[A], N[B]), p, y, [f[k] for k in FEATS], r['best_of'], s,
                    (SV[A][0], SV[A][1], SV[B][0], SV[B][1], NSV[A], NSV[B], tg, r['_ret'])))
        # ---- atualizar estados com o resultado ----
        lk = level_k(r) * (P['ret'] if r['_ret'] else 1.0)
        pw = p if y == 1 else 1 - p     # prob. prevista do vencedor (com bo5)
        resA = y - p
        hh.append((resA * sg, day))
        for x, res in ((A, resA), (B, -resA)):
            FORM[x] = 0.8 * FORM[x] + 0.2 * res
        d = 1 - 1 / (1 + 10 ** ((R[l] - R[w]) / 400))
        R[w] += K(N[w]) * lk * d; R[l] -= K(N[l]) * lk * d
        ds = 1 - 1 / (1 + 10 ** ((RS[(l, s)] - RS[(w, s)]) / 400))
        RS[(w, s)] += K(NS[(w, s)]) * lk * ds; RS[(l, s)] -= K(NS[(l, s)]) * lk * ds
        N[w] += 1; N[l] += 1; NS[(w, s)] += 1; NS[(l, s)] += 1
        st = nsets(r['score'])
        try: mins = float(r['minutes'])
        except: mins = 35.0 * st
        for x in (w, l):
            HIST[x].append((day, R[x])); LAST[x] = day
            RECENT[x].append((day, st, mins, r['tourney_id']))
        try:
            wsp = float(r['w_svpt']); lsp = float(r['l_svpt'])
            if wsp > 20 and lsp > 20:
                wsw = (float(r['w_1stWon']) + float(r['w_2ndWon'])) / wsp
                lsw = (float(r['l_1stWon']) + float(r['l_2ndWon'])) / lsp
                for x, sv, rt in ((w, wsw, 1 - lsw), (l, lsw, 1 - wsw)):
                    a_ = max(0.08, 1 / (NSV[x] + 2)); SV[x][0] = (1 - a_) * SV[x][0] + a_ * sv; SV[x][1] = (1 - a_) * SV[x][1] + a_ * rt; NSV[x] += 1
        except: pass
    return out

def fit(X, off, y, l2=1.0):
    """logística com offset, Newton."""
    b = np.zeros(X.shape[1])
    for _ in range(30):
        z = off + X @ b; q = 1 / (1 + np.exp(-z))
        g = X.T @ (q - y) + l2 * b
        H = (X * (q * (1 - q))[:, None]).T @ X + l2 * np.eye(len(b))
        st = np.linalg.solve(H, g); b -= st
        if np.abs(st).max() < 1e-8: break
    se = np.sqrt(np.diag(np.linalg.inv(H)))
    return b, se

def ll(z, y):
    q = np.clip(1 / (1 + np.exp(-z)), 1e-9, 1 - 1e-9)
    return float(np.mean(-(y * np.log(q) + (1 - y) * np.log(1 - q))))

TOURLV = ('G', 'M', 'A', 'F', 'P', 'PM', 'I', 'O', 'W')
if __name__ == '__main__':
    res = {}
    for tour, P in (('atp', {'k': 200, 'off': 5, 'sh': 0.4, 'ws': 0.3, 'ret': 0.5}), ('wta', {'k': 300, 'off': 5, 'sh': 0.4, 'ws': 0.3, 'ret': 0.5})):
        data = build(tour, P)
        def sel(lo, hi, tour_only):
            idx = [i for i, d in enumerate(data) if lo <= d[0] < hi and d[3] >= 10 and (not tour_only or (d[1] in TOURLV and d[2]))]
            p = np.array([data[i][4] for i in idx]); y = np.array([data[i][5] for i in idx], float)
            X = np.array([data[i][6] for i in idx], float)
            return np.log(p / (1 - p)), y, X
        # afinação: 2019-2024, tour + challenger (mais dados); teste: 2025-06+ só tour (o que interessa)
        zt, yt, Xt = sel('20190101', '20250101', False)
        zv, yv, Xv = sel('20250601', '20991231', True)
        zc, yc, Xc = sel('20250601', '20991231', False)
        one = lambda z: z[:, None]
        # base: Elo recalibrado (a·logit)
        b0, _ = fit(one(zt), np.zeros_like(zt), yt, 0.0)
        base_v = ll(b0[0] * zv, yv); base_c = ll(b0[0] * zc, yc)
        out = {'n_treino': len(yt), 'n_teste_tour': len(yv), 'n_teste_todos': len(yc),
               'elo_cru_tour': ll(zv, yv), 'elo_calibrado_tour': base_v, 'calib_a': round(float(b0[0]), 3), 'fatores': {}}
        for j, name in enumerate(FEATS):
            if np.all(Xt[:, j] == 0): continue
            Xa = np.column_stack([zt, Xt[:, j]]); b, se = fit(Xa, np.zeros_like(zt), yt, 0.0)
            lv = ll(np.column_stack([zv, Xv[:, j]]) @ b, yv); lc = ll(np.column_stack([zc, Xc[:, j]]) @ b, yc)
            out['fatores'][name] = {'coef': round(float(b[1]), 4), 't': round(float(b[1] / se[1]), 1),
                                    'ganho_tour_x1000': round((base_v - lv) * 1000, 2), 'ganho_todos_x1000': round((base_c - lc) * 1000, 2),
                                    'nao_zero_teste': int((Xv[:, j] != 0).sum())}
        # todos juntos
        keep = [j for j in range(len(FEATS)) if not np.all(Xt[:, j] == 0)]
        Xa = np.column_stack([zt, Xt[:, keep]]); b, se = fit(Xa, np.zeros_like(zt), yt, 1.0)
        lv = ll(np.column_stack([zv, Xv[:, keep]]) @ b, yv); lc = ll(np.column_stack([zc, Xc[:, keep]]) @ b, yc)
        out['todos'] = {'ganho_tour_x1000': round((base_v - lv) * 1000, 2), 'ganho_todos_x1000': round((base_c - lc) * 1000, 2),
                        'coefs': {FEATS[j]: (round(float(b[i + 1]), 4), round(float(b[i + 1] / se[i + 1]), 1)) for i, j in enumerate(keep)}}
        # H2H «bestas negras»: pares com >=3 jogos e resíduo forte — o próximo jogo confirma?
        res[tour] = out
        print(tour.upper(), json.dumps(out, indent=1, ensure_ascii=False))
        import pickle; pickle.dump(data, open(f'/home/claude/vi-build/out/{tour}_data.pkl','wb'))
        np.save(f'/home/claude/vi-build/out/{tour}_feat.npy', np.array([(d[4], d[5], *d[6]) for d in data]))
        json.dump([(d[0], d[1], d[2], d[3], d[7], d[8]) for d in data], open(f'/home/claude/vi-build/out/{tour}_meta.json', 'w'))
    json.dump(res, open('/home/claude/vi-build/out/factors.json', 'w'), indent=1, ensure_ascii=False)
