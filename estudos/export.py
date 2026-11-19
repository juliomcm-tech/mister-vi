"""Exporta os dados de arranque do Mister Vi (ratings.json) a partir do arquivo público (até junho 2026)."""
import sys, json, math, re, unicodedata
from collections import defaultdict, deque
sys.path.insert(0, '/home/claude/vi-build')
import elo

PAR = {'atp': {'k': 200, 'off': 5, 'sh': 0.4, 'ws': 0.3, 'ret': 0.5}, 'wta': {'k': 300, 'off': 5, 'sh': 0.4, 'ws': 0.3, 'ret': 0.5}}
def norm(s): return re.sub(r'[^a-z ]', '', unicodedata.normalize('NFD', s or '').encode('ascii', 'ignore').decode().lower()).strip()

FX = {t: v['coef'] for t, v in json.load(open('/home/claude/vi-build/out/factors3.json')).items()}
out = {'v': 2, 'src': 'Jeff Sackmann / Tennis Abstract (CC BY-NC-SA 4.0), via Aneeshers/tennis-sackmann-archive', 'tours': {}, 'surf': {}}
surf_map = defaultdict(lambda: defaultdict(int))
for tour in ['atp', 'wta']:
    P = PAR[tour]
    rows, preds, R, N, RS, NS = elo.run(tour, P)
    base = json.load(open(f'/home/claude/vi-build/out/{tour}_base.json'))
    # calibração: encolher p com logit*k (afinado em 2023-24 nos jogos de tour)
    best = (1.0, 9)
    tune = [(p) for r, p, nw, nl in preds if '20230101' <= r['tourney_date'] < '20250101' and r['_main'] and r['tourney_level'] != 'C' and min(nw, nl) >= 10]
    for k in [x / 100 for x in range(80, 111, 2)]:
        ll = 0
        for p in tune:
            q = 1 / (1 + math.exp(-k * math.log(p / (1 - p)))); ll += -math.log(min(max(q, 1e-6), 1 - 1e-6))
        ll /= len(tune)
        if ll < best[1]: best = (k, ll)
    calk = best[0]
    # confirmação 2025-06+ com o k
    cnf = [(p) for r, p, nw, nl in preds if r['tourney_date'] >= '20250601' and r['_main'] and r['tourney_level'] != 'C' and min(nw, nl) >= 10]
    ll0 = sum(-math.log(p) for p in cnf) / len(cnf); ll1 = sum(-math.log(1 / (1 + math.exp(-calk * math.log(p / (1 - p))))) for p in cnf) / len(cnf)
    print(tour, 'calibração k =', calk, '| confirmação logloss', round(ll0, 4), '→', round(ll1, 4))
    # serviço / resposta (52 semanas até ao fim dos dados), encolhido com 300 pontos
    last = max(r['tourney_date'] for r in rows)
    cut = str(int(last[:4]) - 1) + last[4:]
    sv = defaultdict(lambda: [0, 0, 0, 0])
    info = {}; BY = {}
    for r in rows:
        for pre, pid, nm, ioc, rk in (('w_', r['winner_id'], r['winner_name'], r['winner_ioc'], r['winner_rank']), ('l_', r['loser_id'], r['loser_name'], r['loser_ioc'], r['loser_rank'])):
            info[pid] = (nm, ioc, rk, r['tourney_date'])
            try: BY[pid] = round(int(r['tourney_date'][:4]) + int(r['tourney_date'][4:6]) / 12 - float(r[('winner' if pre == 'w_' else 'loser') + '_age']), 1)
            except: pass
        if r['tourney_date'] < cut: continue
        try:
            ws, wt = int(r['w_1stWon']) + int(r['w_2ndWon']), int(r['w_svpt']); ls, lt = int(r['l_1stWon']) + int(r['l_2ndWon']), int(r['l_svpt'])
        except: continue
        bs = base.get(r['surface'], base['Hard'])
        for pid, a, b, c, d in ((r['winner_id'], ws, wt, lt - ls, lt), (r['loser_id'], ls, lt, wt - ws, wt)):
            # guardar desvio face à média da superfície (para comparar superfícies diferentes)
            s = sv[pid]; s[0] += a - bs * b; s[1] += b; s[2] += c - (1 - bs) * d; s[3] += d
    # Elo ↔ ranking (para jogadores novos que a app não conhece)
    xs, ys = [], []
    for pid, (nm, ioc, rk, ld) in info.items():
        if ld >= '20260101' and rk and rk.isdigit() and N[pid] >= 20: xs.append(math.log(int(rk))); ys.append(R[pid])
    n = len(xs); mx = sum(xs) / n; my = sum(ys) / n
    b1 = sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / sum((x - mx) ** 2 for x in xs); b0 = my - b1 * mx
    print(tour, 'Elo ≈ %.0f %+.1f·ln(ranking)' % (b0, b1), 'n', n)
    players = {}
    for pid, (nm, ioc, rk, ld) in info.items():
        if ld < '20250101' or N[pid] < 3: continue
        s = sv[pid]
        players[norm(nm)] = [nm, ioc, round(R[pid]), round(RS[(pid, 'h')]), round(RS[(pid, 'c')]), round(RS[(pid, 'g')]), N[pid], NS[(pid, 'h')], NS[(pid, 'c')], NS[(pid, 'g')], ld, int(rk) if rk and rk.isdigit() else 0,
                             round(s[0] / (s[1] + 300), 4), round(s[2] / (s[3] + 300), 4), BY.get(pid, 0)]
    # fim real do arquivo: o último torneio começou em «last» mas acaba dias depois (Grand Slam ~2 semanas)
    import datetime
    def plus(d, n): return (datetime.date(int(d[:4]), int(d[4:6]), int(d[6:8])) + datetime.timedelta(days=n)).strftime('%Y%m%d')
    cut = max(plus(r['tourney_date'], 14 if r['tourney_level'] == 'G' else 7) for r in rows if r['tourney_date'] >= str(int(last) - 100))
    out['tours'][tour] = {'cut': cut, 'par': P, 'calk': calk, 'base': {k: v for k, v in base.items() if k in ('Hard', 'Clay', 'Grass')}, 'rank2elo': [round(b0, 1), round(b1, 2)], 'last': last,
                          'cols': ['nome', 'pais', 'elo', 'eloH', 'eloC', 'eloG', 'n', 'nH', 'nC', 'nG', 'ultimo', 'rank', 'serv', 'resp', 'nasc'], 'p': players,
                          'fx': FX[tour]}
    for r in rows:
        if r['tourney_date'] >= '20230101' and r['surface']: surf_map[norm(re.sub(r'\b(Q|CH|CH Q)$', '', r['tourney_name']))][r['surface']] += 1
    print(tour, 'jogadores exportados', len(players), 'último jogo', last)
out['surf'] = {k: max(v, key=v.get)[0].lower() for k, v in surf_map.items()}
json.dump(out, open('/home/claude/mister-vi/ratings.json', 'w'), separators=(',', ':'), ensure_ascii=False)
import os; print('ratings.json', os.path.getsize('/home/claude/mister-vi/ratings.json') // 1024, 'KB · torneios', len(out['surf']))
