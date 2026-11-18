"""Mister Vi · modelo de jogos: pontos de serviço → jogo → set → encontro (distribuição exata de jogos)."""
import csv, math, json, sys
from functools import lru_cache
from collections import defaultdict
sys.path.insert(0, '/home/claude/vi-build')
import elo

def hold(s):
    q = 1 - s; d = s * s / (s * s + q * q)
    return s**4 * (1 + 4*q + 10*q*q) + 20 * s**3 * q**3 * d

def tiebreak(sa, sb):
    """P(A ganha tie-break), A serve o 1.º ponto; depois serviço muda a cada 2 pontos."""
    @lru_cache(None)
    def f(a, b):
        if a >= 7 and a - b >= 2: return 1.0
        if b >= 7 and b - a >= 2: return 0.0
        if a >= 6 and b >= 6 and a == b:  # deuce no tie-break: 2 pontos, um serviço de cada
            pa = sa * (1 - sb); pb = (1 - sa) * sb
            return pa / (pa + pb)
        n = a + b; a_serves = (n % 4 == 0) or (n % 4 == 3)
        p = sa if a_serves else 1 - sb
        return p * f(a + 1, b) + (1 - p) * f(a, b + 1)
    return f(0, 0)

def set_dist(ha, hb, tb):
    """Distribuição dos resultados de um set (jogos A, jogos B), A serve primeiro."""
    out = defaultdict(float)
    def go(a, b, p):
        if p < 1e-12: return
        if (a == 6 and b <= 4) or (a == 7 and b == 5): out[(a, b)] += p; return
        if (b == 6 and a <= 4) or (b == 7 and a == 5): out[(a, b)] += p; return
        if a == 6 and b == 6: out[(7, 6)] += p * tb; out[(6, 7)] += p * (1 - tb); return
        a_serves = (a + b) % 2 == 0
        w = ha if a_serves else 1 - hb
        go(a + 1, b, p * w); go(a, b + 1, p * (1 - w))
    go(0, 0, 1.0)
    return out

def match_dist(sa, sb, bo=3):
    """Distribuição de (vencedor A?, total de jogos, diferença de jogos A−B). A serve primeiro no 1.º set."""
    ha, hb = hold(sa), hold(sb)
    sA = set_dist(ha, hb, tiebreak(sa, sb))      # A serve primeiro no set
    sB = {(b, a): p for (a, b), p in set_dist(hb, ha, tiebreak(sb, sa)).items()}  # B serve primeiro
    need = 2 if bo == 3 else 3
    res = defaultdict(float)
    def go(wa, wb, games, diff, a_first, p):
        if wa == need or wb == need: res[(wa == need, games, diff)] += p; return
        D = sA if a_first else sB
        for (ga, gb), q in D.items():
            nxt_first = a_first if (ga + gb) % 2 == 0 else not a_first
            go(wa + (ga > gb), wb + (gb > ga), games + ga + gb, diff + ga - gb, nxt_first, p * q)
    # quem serve primeiro é sorteio: média das duas hipóteses
    go(0, 0, 0, 0, True, 0.5); go(0, 0, 0, 0, False, 0.5)
    return res

def pwin(res): return sum(p for (w, g, d), p in res.items() if w)

_MD = {}
def match_dist_c(sa, sb, bo):
    k = (round(sa, 3), round(sb, 3), bo)
    if k not in _MD: _MD[k] = match_dist(k[0], k[1], bo)
    return _MD[k]
def solve(base_a, base_b, p_target, bo):
    """Desloca serviço/resposta de forma simétrica até a probabilidade de ganhar = Elo."""
    lo, hi = -0.25, 0.25
    match_dist = match_dist_c
    for _ in range(13):
        x = (lo + hi) / 2
        r = match_dist(min(max(base_a + x, 0.3), 0.92), min(max(base_b - x, 0.3), 0.92), bo)
        if pwin(r) < p_target: lo = x
        else: hi = x
    return r

if __name__ == '__main__':
    # pontos de serviço ganhos por circuito e superfície (2023-26, tour)
    for tour in ['atp', 'wta']:
        rows = [r for r in elo.load(tour) if r['tourney_date'] >= '20230101' and r['_main'] and r['tourney_level'] not in ('C',)]
        agg = defaultdict(lambda: [0, 0])
        for r in rows:
            try:
                for pre in ('w_', 'l_'):
                    sv = int(r[pre + 'svpt']); won = int(r[pre + '1stWon']) + int(r[pre + '2ndWon'])
                    agg[r['surface']][0] += won; agg[r['surface']][1] += sv
            except: pass
        base = {k: round(v[0] / v[1], 4) for k, v in agg.items() if v[1] > 1000}
        print(tour, 'serviço ganho por superfície:', base)
        json.dump(base, open(f'/home/claude/vi-build/out/{tour}_base.json', 'w'))

def solve_mix(base_a, base_b, p_target, bo, delta):
    """Mistura (dia mau / normal / dia bom): x0−δ, x0, x0+δ com pesos 1/4, 1/2, 1/4; x0 tal que P(ganhar) = Elo."""
    W = ((-delta, 0.25), (0.0, 0.5), (delta, 0.25))
    def mix(x):
        out = defaultdict(float)
        for e, w in W:
            r = match_dist_c(min(max(base_a + x + e, 0.3), 0.92), min(max(base_b - x - e, 0.3), 0.92), bo)
            for k, v in r.items(): out[k] += w * v
        return out
    lo, hi = -0.3, 0.3
    for _ in range(13):
        x = (lo + hi) / 2
        if pwin(mix(x)) < p_target: lo = x
        else: hi = x
    return mix((lo + hi) / 2)
