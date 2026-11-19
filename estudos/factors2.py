"""Etapa 2: afinar só em jogos de tour (o que a app usa mais), testar 2025-06+. Também Challenger à parte.
Seleção para a frente: só fica um fator se melhorar a perda fora da amostra nos DOIS períodos de validação."""
import pickle, json, sys
import numpy as np
sys.path.insert(0, '/home/claude/vi-build')
from factors import FEATS, fit, ll, TOURLV

def arr(data, lo, hi, kind):
    idx = []
    for i, d in enumerate(data):
        if not (lo <= d[0] < hi) or d[3] < 10: continue
        tour_ok = d[1] in TOURLV and d[2]
        if kind == 'tour' and not tour_ok: continue
        if kind == 'chall' and d[1] != 'C': continue
        idx.append(i)
    p = np.array([data[i][4] for i in idx]); y = np.array([data[i][5] for i in idx], float)
    X = np.array([data[i][6] for i in idx], float)
    return np.log(p / (1 - p)), y, X

res = {}
for tour in ('atp', 'wta'):
    data = pickle.load(open(f'/home/claude/vi-build/out/{tour}_data.pkl', 'rb'))
    res[tour] = {}
    for kind in ('tour', 'chall'):
        zt, yt, Xt = arr(data, '20150101', '20230101', kind)     # treino
        za, ya, Xa = arr(data, '20230101', '20250601', kind)     # validação 1 (escolher fatores)
        zv, yv, Xv = arr(data, '20250601', '20991231', kind)     # teste final (nunca usado para escolher)
        if len(yv) < 300: continue
        b0, _ = fit(zt[:, None], np.zeros_like(zt), yt, 0.0)
        base = lambda z: b0[0] * z
        r = {'n': [len(yt), len(ya), len(yv)], 'calib_a': round(float(b0[0]), 3),
             'elo_cru_teste': round(ll(zv, yv), 4), 'elo_cal_teste': round(ll(base(zv), yv), 4)}
        chosen = []
        cur_a = ll(base(za), ya)
        while True:
            best = None
            for j in range(len(FEATS)):
                if j in chosen or np.all(Xt[:, j] == 0): continue
                cols = chosen + [j]
                b, se = fit(np.column_stack([zt, Xt[:, cols]]), np.zeros_like(zt), yt, 1.0)
                la = ll(np.column_stack([za, Xa[:, cols]]) @ b, ya)
                if best is None or la < best[1]: best = (j, la)
            if best is None or cur_a - best[1] < 0.0005: break
            chosen.append(best[0]); cur_a = best[1]
        # refazer com treino+validação 1, testar no final
        zT = np.concatenate([zt, za]); yT = np.concatenate([yt, ya]); XT = np.vstack([Xt, Xa])
        b0T, _ = fit(zT[:, None], np.zeros_like(zT), yT, 0.0)
        lbase = ll(b0T[0] * zv, yv)
        if chosen:
            b, se = fit(np.column_stack([zT, XT[:, chosen]]), np.zeros_like(zT), yT, 1.0)
            lfin = ll(np.column_stack([zv, Xv[:, chosen]]) @ b, yv)
            r['coefs'] = {'elo': round(float(b[0]), 3), **{FEATS[j]: round(float(b[i + 1]), 4) for i, j in enumerate(chosen)}}
        else:
            lfin = lbase
        r['escolhidos'] = [FEATS[j] for j in chosen]
        r['teste_base'] = round(lbase, 4); r['teste_com_fatores'] = round(lfin, 4)
        r['ganho_x1000'] = round((lbase - lfin) * 1000, 2)
        # acerto
        res[tour][kind] = r
        print(tour, kind, json.dumps(r, ensure_ascii=False))
json.dump(res, open('/home/claude/vi-build/out/factors2.json', 'w'), indent=1, ensure_ascii=False)
