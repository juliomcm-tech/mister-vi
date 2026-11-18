"""Valida totais e handicaps de jogos (jogos de tour 2025-06+), sem ver o futuro."""
import sys, json, random, math
from collections import defaultdict, deque
sys.path.insert(0, '/home/claude/vi-build')
import elo, games

import re
def games_of(score):
    t = d = sets = 0
    for tok in score.split():
        if tok.startswith('['): return None
        m = re.match(r'^(\d+)-(\d+)', tok)
        if not m: continue
        a, b = int(m.group(1)), int(m.group(2))
        t += a + b; d += a - b; sets += 1
    return (t, d, sets) if sets else None

random.seed(3)
DELTA = float(sys.argv[1]) if len(sys.argv) > 1 else 0.0
R = {}
for tour, P in [('atp', {'k': 200, 'off': 5, 'sh': 0.4, 'ws': 0.3, 'ret': 0.5}), ('wta', {'k': 300, 'off': 5, 'sh': 0.4, 'ws': 0.3, 'ret': 0.5})]:
    base = json.load(open(f'/home/claude/vi-build/out/{tour}_base.json'))
    rows, preds, *_ = elo.run(tour, P)
    # estatísticas de serviço/resposta em janela de 52 semanas (antes de cada jogo)
    hist = defaultdict(deque)   # jogador → (data, sv_won, sv_tot, ret_won, ret_tot, surface)
    SH = 300
    out = []
    for r, p, nw, nl in preds:
        d = int(r['tourney_date']); s = r['surface'] or 'Hard'; bs = base.get(s, base['Hard'])
        def skill(pid):
            H = hist[pid]
            while H and H[0][0] < d - 10000: H.popleft()
            sw = sum(x[1] for x in H); st = sum(x[2] for x in H); rw = sum(x[3] for x in H); rt = sum(x[4] for x in H)
            sv = (sw + SH * bs) / (st + SH) - bs; rv = (rw + SH * (1 - bs)) / (rt + SH) - (1 - bs)
            return sv, rv
        ok = r['tourney_date'] >= '20250601' and r['_main'] and r['tourney_level'] not in ('C',) and not r['_ret'] and min(nw, nl) >= 10
        if ok and random.random() < 0.12:
            (svw, rvw), (svl, rvl) = skill(r['winner_id']), skill(r['loser_id'])
            sa = bs + svw - rvl; sb = bs + svl - rvw
            bo = 5 if r['best_of'] == '5' else 3
            go = games_of(r['score'])
            if go:
                dist = games.solve_mix(sa, sb, p, bo, DELTA)
                t, dd, ns = go
                out.append((dist, t, dd, bo, p))
        try:
            ws, wt = int(r['w_1stWon']) + int(r['w_2ndWon']), int(r['w_svpt'])
            ls, lt = int(r['l_1stWon']) + int(r['l_2ndWon']), int(r['l_svpt'])
            hist[r['winner_id']].append((d, ws, wt, lt - ls, lt)); hist[r['loser_id']].append((d, ls, lt, wt - ws, wt))
        except: pass
    R[tour] = out
    print(tour, 'jogos avaliados', len(out))
    for bo, lines in [(3, [19.5, 21.5, 22.5, 23.5, 25.5]), (5, [35.5, 38.5, 41.5])]:
        O = [x for x in out if x[3] == bo]
        if len(O) < 40: continue
        mean_p = sum(sum(g * q for (w, g, dd), q in x[0].items()) for x in O) / len(O)
        mean_a = sum(x[1] for x in O) / len(O)
        print(f'  melhor de {bo}: n={len(O)} jogos médios previsto {mean_p:.2f} real {mean_a:.2f}')
        for L in lines:
            pp = sum(sum(q for (w, g, dd), q in x[0].items() if g > L) for x in O) / len(O)
            aa = sum(1 for x in O if x[1] > L) / len(O)
            print(f'    mais de {L}: previsto {pp:.3f} real {aa:.3f}')
        # handicap de jogos do favorito (−3.5): orientado ao vencedor real → usar p
        for H in (2.5, 4.5):
            pp = aa = 0
            for dist, t, dd, b, p in O:
                fav_is_w = p >= 0.5
                # P(favorito ganha por mais de H jogos)
                if fav_is_w: q = sum(v for (w, g, d2), v in dist.items() if d2 > H); a = dd > H
                else: q = sum(v for (w, g, d2), v in dist.items() if -d2 > H); a = -dd > H
                pp += q; aa += a
            print(f'    favorito −{H} jogos: previsto {pp/len(O):.3f} real {aa/len(O):.3f}')
