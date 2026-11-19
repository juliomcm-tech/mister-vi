"""Etapa 3: fatores exatamente como a app os consegue calcular.
 - svret: serviço+resposta (52 semanas, desvio da média da superfície, encolhido 300 pontos) = colunas serv/resp do ratings.json
 - idade: anos acima de 31 (ano de nascimento guardado no ratings.json)
 - paragem: >60 dias sem jogar (a app sabe a data do último jogo)
Afinar 2015-2024 (jogos de tour), confirmar 2025-06+. Mais: o caso «besta negra» no H2H."""
import sys, json, math, re, hashlib, pickle
from collections import defaultdict, deque
import numpy as np
sys.path.insert(0, '/home/claude/vi-build')
from elo import load, level_k, SURF
from factors import bo5p, fit, ll, TOURLV, dnum

def run(tour, P):
    rows = load(tour)
    base = json.load(open(f'/home/claude/vi-build/out/{tour}_base.json'))
    R = defaultdict(lambda: 1500.0); N = defaultdict(int); RS = defaultdict(lambda: 1500.0); NS = defaultdict(int)
    K = lambda n: P['k'] / (n + P['off']) ** P['sh']
    SVQ = defaultdict(deque); SVS = defaultdict(lambda: [0.0, 0.0, 0.0, 0.0])
    LAST = {}; BY = {}; H2H = defaultdict(list)
    out = []
    for r in rows:
        w, l = r['winner_id'], r['loser_id']; s = SURF.get(r['surface'], 'h'); day = dnum(r['tourney_date'])
        flip = int(hashlib.md5((r['tourney_id'] + r['match_num'] + w).encode()).hexdigest(), 16) & 1
        A, B = (w, l) if not flip else (l, w); y = 1 if A == w else 0
        for pid, agek in ((w, 'winner_age'), (l, 'loser_age')):
            try: BY[pid] = int(r['tourney_date'][:4]) + int(r['tourney_date'][4:6]) / 12 - float(r[agek])
            except: pass
        ra = (1 - P['ws']) * R[A] + P['ws'] * RS[(A, s)]; rb = (1 - P['ws']) * R[B] + P['ws'] * RS[(B, s)]
        p = 1 / (1 + 10 ** ((rb - ra) / 400))
        if r['best_of'] == '5': p = bo5p(p)
        def svr(x):
            q = SVQ[x]
            while q and day - q[0][0] > 372:
                d0, a, b, c, d = q.popleft(); S = SVS[x]; S[0] -= a; S[1] -= b; S[2] -= c; S[3] -= d
            S = SVS[x]; return S[0] / (S[1] + 300) + S[2] / (S[3] + 300)
        f_sv = (svr(A) - svr(B)) * 10
        yr = int(r['tourney_date'][:4]) + int(r['tourney_date'][4:6]) / 12
        agef = lambda x: max(0.0, yr - BY[x] - 31) / 3 if x in BY else 0.0
        f_age = agef(A) - agef(B)
        lay = lambda x: 1.0 if x in LAST and day - LAST[x] > 60 else 0.0
        f_lay = lay(A) - lay(B)
        key = (A, B) if A < B else (B, A); sg = 1 if A < B else -1; hh = H2H[key]
        h2h_n = len(hh); h2h_res = sg * sum(hh); h2h_w = sg * sum(1 if x > 0 else -1 for x in hh)
        out.append((r['tourney_date'], r['tourney_level'], r['_main'], min(N[A], N[B]), p, y, [f_sv, f_age, f_lay], (h2h_n, h2h_res, h2h_w)))
        # atualizar
        lk = level_k(r) * (P['ret'] if r['_ret'] else 1.0)
        hh.append((y - p) * sg)
        d = 1 - 1 / (1 + 10 ** ((R[l] - R[w]) / 400)); R[w] += K(N[w]) * lk * d; R[l] -= K(N[l]) * lk * d
        ds = 1 - 1 / (1 + 10 ** ((RS[(l, s)] - RS[(w, s)]) / 400)); RS[(w, s)] += K(NS[(w, s)]) * lk * ds; RS[(l, s)] -= K(NS[(l, s)]) * lk * ds
        N[w] += 1; N[l] += 1; NS[(w, s)] += 1; NS[(l, s)] += 1; LAST[w] = LAST[l] = day
        try:
            ws_, wt = int(r['w_1stWon']) + int(r['w_2ndWon']), int(r['w_svpt']); ls_, lt = int(r['l_1stWon']) + int(r['l_2ndWon']), int(r['l_svpt'])
            if wt > 0 and lt > 0:
                bs = base.get(r['surface'], base['Hard'])
                for pid, a, b, c, dd in ((w, ws_, wt, lt - ls_, lt), (l, ls_, lt, wt - ws_, wt)):
                    t = (day, a - bs * b, b, c - (1 - bs) * dd, dd); SVQ[pid].append(t); S = SVS[pid]
                    S[0] += t[1]; S[1] += t[2]; S[2] += t[3]; S[3] += t[4]
        except: pass
    return out

def arr(data, lo, hi, tour_only=True):
    idx = [i for i, d in enumerate(data) if lo <= d[0] < hi and d[3] >= 10 and (not tour_only or (d[1] in TOURLV and d[2]))]
    p = np.array([data[i][4] for i in idx]); y = np.array([data[i][5] for i in idx], float); X = np.array([data[i][6] for i in idx], float)
    return np.log(p / (1 - p)), y, X, idx

NAMES = ['svret', 'idade', 'paragem']
res = {}
for tour, P in (('atp', {'k': 200, 'off': 5, 'sh': 0.4, 'ws': 0.3, 'ret': 0.5}), ('wta', {'k': 300, 'off': 5, 'sh': 0.4, 'ws': 0.3, 'ret': 0.5})):
    data = run(tour, P)
    zt, yt, Xt, _ = arr(data, '20150101', '20250101'); zv, yv, Xv, iv = arr(data, '20250601', '20991231')
    za, ya, Xa, _ = arr(data, '20230101', '20250101')
    b0, _ = fit(zt[:, None], np.zeros_like(zt), yt, 0.0)
    b, se = fit(np.column_stack([zt, Xt]), np.zeros_like(zt), yt, 1.0)
    zz = np.column_stack([zv, Xv]) @ b
    r = {'n_treino': len(yt), 'n_teste': len(yv), 'elo_cal_k': round(float(b0[0]), 3),
         'logloss_elo': round(ll(b0[0] * zv, yv), 4), 'logloss_novo': round(ll(zz, yv), 4),
         'acerto_elo': round(float(np.mean((zv > 0) == (yv == 1))), 4), 'acerto_novo': round(float(np.mean((zz > 0) == (yv == 1))), 4),
         'brier_elo': round(float(np.mean((1 / (1 + np.exp(-b0[0] * zv)) - yv) ** 2)), 4), 'brier_novo': round(float(np.mean((1 / (1 + np.exp(-zz)) - yv) ** 2)), 4),
         'coef': {'elo': round(float(b[0]), 4), **{NAMES[i]: [round(float(b[i + 1]), 4), round(float(b[i + 1] / se[i + 1]), 1)] for i in range(3)}}}
    # calibração do novo
    q = 1 / (1 + np.exp(-zz)); fav = np.maximum(q, 1 - q); won = np.where(q >= 0.5, yv, 1 - yv)
    cal = {}
    for lo in (0.5, 0.6, 0.7, 0.8, 0.9):
        m = (fav >= lo) & (fav < lo + 0.1)
        if m.sum(): cal[f'{int(lo*100)}-{int(lo*100)+10}%'] = [int(m.sum()), round(float(fav[m].mean()), 3), round(float(won[m].mean()), 3)]
    r['calibracao_novo'] = cal
    # «besta negra»: >=3 jogos entre os dois e o mais fraco no Elo ganhou a maioria
    bn = []
    for i, d in enumerate(data):
        if d[0] < '20150101' or d[3] < 10: continue
        n, res_, wbal = d[7]
        if n < 3: continue
        pA = d[4]
        # o H2H favorece A (mais vitórias) mas o Elo favorece B (ou vice-versa)
        if wbal > 0 and pA < 0.5: bn.append((1 - pA, 1 - d[5]))     # «favorito Elo» é B; resultado do B
        elif wbal < 0 and pA > 0.5: bn.append((pA, d[5]))
    bn = np.array(bn)
    r['besta_negra'] = {'casos': len(bn), 'elo_dizia_favorito_ganha': round(float(bn[:, 0].mean()), 3), 'favorito_ganhou_mesmo': round(float(bn[:, 1].mean()), 3)}
    res[tour] = r
    print(tour, json.dumps(r, ensure_ascii=False))
json.dump(res, open('/home/claude/vi-build/out/factors3.json', 'w'), indent=1, ensure_ascii=False)
