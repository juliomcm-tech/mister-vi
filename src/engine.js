'use strict';
/* =====================================================================
   MISTER VI · TÉNIS (ATP + WTA)
   - Ratings Elo (geral + superfície) calculados com o arquivo público de
     Jeff Sackmann (todos os jogos até junho 2026, incl. Challenger/ITF) e
     atualizados com os resultados da ESPN.
   - Teste às cegas (jun 2025 → jun 2026, jogos de tour): acerta 66% (ATP)
     e 66% (WTA) dos vencedores, melhor que o ranking (63%/62%), calibrado.
   - Fatores extra testados às cegas: entram serviço+resposta, idade, paragem.
   - Jogos (handicap/total): modelo ponto a ponto com «dia bom / dia mau»,
     validado contra os resultados reais.
   Só vai à internet quando tocas em ↻. Tudo fica no telemóvel («vi_…»).
   ===================================================================== */
const APP_VER = '1.2.1';
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const r3 = x => Math.round(x * 1000) / 1000;
const r2 = x => Math.round(x * 100) / 100;
const LS = {
  get(k, d) { try { const v = localStorage.getItem('vi_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('vi_' + k, JSON.stringify(v)); return true; } catch (e) { toast('A memória do telemóvel está cheia'); return false; } }
};
const eur = v => (Number(v) || 0).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
const sEur = v => (v > 0 ? '+' : v < 0 ? '−' : '') + eur(Math.abs(v));
const odd2 = v => v ? Number(v).toFixed(2) : '—';
const pct = v => Math.round(v * 100) + '%';
const sPct = v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(Math.round(v * 100)) + '%';
const num = x => { const v = parseFloat(String(x == null ? '' : x).replace(',', '.').replace(/[^\d.+-]/g, '')); return isFinite(v) ? v : null; };
const ln = v => String(v).replace('.', ',');
function toast(msg, ms) { const t = $('#toast'); t.innerHTML = msg; t.classList.add('on'); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('on'), ms || 2800); }
function Phi(x) { const t = 1 / (1 + 0.3275911 * Math.abs(x) / Math.SQRT2), y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x / 2); return x >= 0 ? (1 + y) / 2 : (1 - y) / 2; }
function american(x) {
  if (x == null || x === '') return null;
  if (typeof x === 'object') return american(x.american != null ? x.american : x.value != null ? x.value : x.odds != null ? x.odds : x.decimal);
  const s = String(x).trim(); if (/^evs?$|^even$/i.test(s)) return 2;
  const v = Number(s.replace('+', '')); if (!isFinite(v) || v === 0) return null;
  if (Math.abs(v) >= 100) return r2(v > 0 ? 1 + v / 100 : 1 + 100 / Math.abs(v));
  return v > 1 && v < 50 ? r2(v) : null;
}
const normName = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[-‐‑]/g, ' ').replace(/[^a-z ]/g, '').replace(/\s+/g, ' ').trim();

/* ---------- datas ---------- */
const fmtET = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' });
const fmtLX = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
const ymdOf = d => fmtLX.format(d).replace(/-/g, '');                         // dia de cá (o ténis é no mundo todo)
const ymdAdd = (s, n) => { const d = new Date(Date.UTC(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8) + n)); return d.toISOString().slice(0, 10).replace(/-/g, ''); };
const today = () => ymdOf(new Date());
const hhmm = iso => new Date(iso).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
const dayLbl = iso => new Date(iso).toLocaleDateString('pt-PT', { weekday: 'short', day: '2-digit', month: '2-digit' }).replace('.', '');

/* ---------- guardado ---------- */
let SEED = null;                                     // ratings.json (carregado no arranque)
let PU = LS.get('pu', null); if (!PU || !PU.atp || !PU.wta) PU = { atp: {}, wta: {} };   // jogadores atualizados depois do arquivo
let DB = LS.get('db', null); if (!DB || typeof DB !== 'object' || !DB.m || !DB.days) DB = { m: {}, days: {} };   // jogos da ESPN
let DONE = LS.get('done', {}) || {};                        // jogos já contados no Elo
const arrOr = v => Array.isArray(v) ? v : [], objOr = v => v && typeof v === 'object' && !Array.isArray(v) ? v : {};
let BETS = arrOr(LS.get('bets', [])), PREDS = objOr(LS.get('preds', {})), DEPOS = arrOr(LS.get('depos', [])), SLIPS = objOr(LS.get('slips', {})), MAN = objOr(LS.get('man', {}));
const CFG_DEF = { bank: { tu: 100, to: 100, pi: 250 }, min: 0.25, piOn: true, piStake: 2.5, evMin: 0.05, mktW: 0.6, oddMin: 1.25, oddMax: 5 };
let CFG = Object.assign({}, CFG_DEF, LS.get('cfg', {}));
if (CFG.botV !== 1) { CFG.piOn = true; CFG.botV = 1; } CFG.bank = Object.assign({}, CFG_DEF.bank, CFG.bank || {});
const saveDB = () => { if (!LS.set('db', DB)) { const cut = ymdAdd(today(), -45); Object.keys(DB.m).forEach(id => { if (DB.m[id].ed < cut) delete DB.m[id]; }); LS.set('db', DB); } };
const saveBets = () => LS.set('bets', BETS);

/* =====================================================================
   1) JOGADORES E ELO
   ===================================================================== */
const SURF_KEY = { hard: 'h', clay: 'c', grass: 'g', carpet: 'h' };
const SURF_NAME = { h: 'Piso duro', c: 'Terra batida', g: 'Relva' };
function seedP(tour, k) {
  const T = SEED && SEED.tours[tour]; if (!T) return null;
  const u = PU[tour][k], r = T.p[k];
  if (u) return u;
  if (!r) return null;
  return { nm: r[0], ioc: r[1], e: r[2], es: { h: r[3], c: r[4], g: r[5] }, n: r[6], ns: { h: r[7], c: r[8], g: r[9] }, last: r[10], rank: r[11], sv: r[12], rv: r[13], by: r[14] || 0 };
}
let CMP = null;                                       // índice «sem espaços» (Jan-Lennard / Janlennard / Jan Lennard)
function seedKey(tour, k) {
  const T = SEED && SEED.tours[tour] && SEED.tours[tour].p; if (!T) return null;
  if (T[k]) return k;
  if (!CMP) { CMP = {}; ['atp', 'wta'].forEach(t => { CMP[t] = {}; Object.keys(SEED.tours[t].p).forEach(x => { const c = x.replace(/ /g, ''); CMP[t][c] = CMP[t][c] === undefined ? x : null; }); }); }
  const c = CMP[tour][k.replace(/ /g, '')]; if (c) return c;
  const parts = k.split(' '), last = parts[parts.length - 1], ini = parts[0] ? parts[0][0] : '';
  const cand = Object.keys(T).filter(x => (x.endsWith(' ' + last) || x.replace(/ /g, '').endsWith(last)) && x[0] === ini);
  return cand.length === 1 ? cand[0] : null;
}
function getP(tour, name, rank, ioc) {
  const k = normName(name);
  let P = PU[tour][k] || null;                       // primeiro o que a app já atualizou (guardado com este nome)
  if (P) { const sk = seedKey(tour, k), r = sk && SEED.tours[tour].p[sk]; if (P.by == null) P.by = r && r[14] || 0; if (P.sv == null && r) { P.sv = r[12]; P.rv = r[13]; } }
  if (!P && SEED) { const sk = seedKey(tour, k); if (sk) P = seedP(tour, sk); if (P && PU[tour][sk] === P) P = Object.assign({}, P); }
  if (!P) {                                         // jogador novo: Elo a partir do ranking
    const T = SEED ? SEED.tours[tour] : null, rr = T ? T.rank2elo : [1900, -150];
    const e0 = rank > 0 ? clamp(rr[0] + rr[1] * Math.log(rank), 1300, 2300) : (tour === 'atp' ? 1550 : 1650);
    P = { nm: name, ioc: ioc || '', e: e0, es: { h: e0, c: e0, g: e0 }, n: 0, ns: { h: 0, c: 0, g: 0 }, last: '', rank: rank || 0, sv: 0, rv: 0, by: 0, nov: true };
  }
  if (rank) P.rank = rank;
  return P;
}
function setP(tour, name, P) { PU[tour][normName(name)] = P; }
const cutOf = tour => { const T = SEED.tours[tour]; return T.cut || T.last || '0'; };   // fim do arquivo (com os torneios a meio)
const KF = (tour, n) => { const p = SEED.tours[tour].par; return p.k / Math.pow(n + p.off, p.sh); };
function eloUpdate(m) {
  const tour = m.t, sk = m.sf, A = getP(tour, m.a.n, m.a.rk, m.a.ioc), B = getP(tour, m.b.n, m.b.rk, m.b.ioc);
  const W = m.w === 'a' ? A : B, L = m.w === 'a' ? B : A, lk = m.ret ? 0.5 : 1;
  const d = 1 - 1 / (1 + Math.pow(10, (L.e - W.e) / 400));
  W.e += KF(tour, W.n) * lk * d; L.e -= KF(tour, L.n) * lk * d;
  const ds = 1 - 1 / (1 + Math.pow(10, (L.es[sk] - W.es[sk]) / 400));
  W.es[sk] += KF(tour, W.ns[sk]) * lk * ds; L.es[sk] -= KF(tour, L.ns[sk]) * lk * ds;
  W.n++; L.n++; W.ns[sk]++; L.ns[sk]++; W.last = L.last = m.ed;
  setP(tour, m.a.n, A); setP(tour, m.b.n, B);
}
/* mudança de versão do modelo: refaz o Elo desde o fim do arquivo com as regras novas (superfícies certas, etc.) */
function migrate() {
  if (LS.get('mver', '') === '2') return;
  Object.values(DB.m).forEach(m => { if (!m.sfMan) m.sf = surfOf(m.ev, m.d); });
  PU = { atp: {}, wta: {} }; DONE = {};
  LS.set('pu', PU); LS.set('done', DONE); saveDB(); LS.set('mver', '2');
  applyResults();
}
function applyResults() {
  let n = 0;
  Object.values(DB.m).filter(m => m.s === 'post' && m.w && !DONE[m.id] && m.ed > cutOf(m.t)).sort((x, y) => x.d < y.d ? -1 : 1).forEach(m => { eloUpdate(m); DONE[m.id] = 1; n++; });
  if (n) { LS.set('pu', PU); LS.set('done', DONE); }
  return n;
}

/* =====================================================================
   2) IR BUSCAR À ESPN (ATP e WTA, dia a dia)
   ===================================================================== */
const ESPN = 'https://site.api.espn.com/apis/site/v2/sports/tennis';
const BRIDGES = [{ n: 'Direto', f: u => u }, { n: 'corsproxy.io', f: u => 'https://corsproxy.io/?url=' + encodeURIComponent(u) }, { n: 'allorigins', f: u => 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u) }];
async function getJSON(url, tmo) {
  const pref = clamp(LS.get('bridge', 0), 0, BRIDGES.length - 1), order = [pref].concat(BRIDGES.map((_, i) => i).filter(i => i !== pref));
  let last = null;
  for (const i of order) {
    const ctrl = new AbortController(), tm = setTimeout(() => ctrl.abort(), tmo || 15000);
    try { const r = await fetch(BRIDGES[i].f(url), { signal: ctrl.signal, cache: 'no-store' }); if (!r.ok) { const e = new Error('HTTP ' + r.status); e.status = r.status; throw e; } const j = await r.json(); if (i !== pref) LS.set('bridge', i); return j; }
    catch (e) { last = e; if (e.status === 400 || e.status === 404) throw e; } finally { clearTimeout(tm); }
  }
  throw last || new Error('sem ligação');
}
const SLAMS = /australian open|roland garros|french open|wimbledon|us open/i;
function surfOf(evName, iso) {
  const k = normName(evName).replace(/\b(presented by|powered by|by)\b.*$/, '').trim();
  const S = (SEED && SEED.surf) || {};
  const sk = v => SURF_NAME[v] ? v : (SURF_KEY[v] || 'h');      // o arquivo guarda h/c/g
  if (S[k]) return sk(S[k]);
  const hit = Object.keys(S).find(x => x.length > 4 && (k.includes(x) || x.includes(k)));
  if (hit) return sk(S[hit]);
  if (/roland garros|french open|monte carlo|madrid|rome|internazionali|estoril|barcelona|hamburg|geneva|lyon|bastad|gstaad|kitzbuhel|umag|buenos aires|rio|santiago|houston|marrakech|bucharest|munich|clay/i.test(evName)) return 'c';
  if (/wimbledon|queens|halle|stuttgart|s hertogenbosch|eastbourne|mallorca|newport|grass|berlin|bad homburg|nottingham/i.test(evName)) return 'g';
  const m = new Date(iso).getMonth() + 1, dd = new Date(iso).getDate();
  if (m === 4 || m === 5) return 'c';
  if ((m === 6 && dd >= 8) || (m === 7 && dd <= 13)) return 'g';
  return 'h';
}
function ingestEvent(ev, tour) {
  let n = 0;
  const evName = ev.name || ev.shortName || 'Torneio';
  (ev.groupings || [{ grouping: { displayName: 'Singles' }, competitions: ev.competitions || [] }]).forEach(G => {
    const gn = ((G.grouping && (G.grouping.displayName || G.grouping.slug)) || '') + '';
    if (/double|mixed|pares/i.test(gn)) return;
    (G.competitions || []).forEach(c => {
      const C = c.competitors || []; if (C.length !== 2) return;
      const who = x => { const a = x.athlete || (x.roster && x.roster.athletes && x.roster.athletes.length === 1 ? x.roster.athletes[0] : null) || {}; return { n: a.displayName || a.fullName || a.shortName || '', ioc: (a.flag && (a.flag.alt || a.flag.abbreviation)) || (a.country && a.country.abbreviation) || '', rk: Number((x.curatedRank && x.curatedRank.current) || x.rank || 0) || 0, hs: (a.headshot && a.headshot.href) || '', fl: (a.flag && a.flag.href) || '' }; };
      const A = who(C[0]), B = who(C[1]); if (!A.n || !B.n || /\//.test(A.n + B.n)) return;
      const st = (c.status && c.status.type) || {}, desc = String(st.description || '') + ' ' + String(st.name || '') + ' ' + String(st.detail || '');
      const off = /walkover|w\/o|cancel|postpon/i.test(desc), ret = /retire|ret\.|abandon|default/i.test(desc);
      const s = off ? 'off' : (st.completed || st.state === 'post') ? 'post' : st.state === 'in' ? 'in' : 'pre';
      const ls = x => (x.linescores || []).map(l => Number(l.value)).filter(v => isFinite(v));
      const la = ls(C[0]), lb = ls(C[1]); const sets = la.map((v, i) => [v, lb[i] != null ? lb[i] : 0]);
      let w = null; if (s === 'post') w = C[0].winner ? 'a' : C[1].winner ? 'b' : null;
      const fmt = c.format && c.format.regulation && c.format.regulation.periods;
      const bo = fmt ? Number(fmt) : (SLAMS.test(evName) && tour === 'atp' ? 5 : 3);
      const d = c.date || c.startDate || ev.date;
      const id = tour + String(c.id), old = DB.m[id];
      const m = { id, t: tour, ev: evName, d, ed: ymdOf(new Date(d)), s, det: st.shortDetail || st.detail || '', rd: (c.round && c.round.displayName) || '', a: A, b: B, sets, w, ret: ret && s === 'post', bo: bo === 5 ? 5 : 3, sf: (old && old.sfMan) ? old.sf : surfOf(evName, d), sfMan: old && old.sfMan };
      // odds (se a ESPN as tiver)
      try {
        const o = c.odds && c.odds[0];
        if (o) { const ha = C[0].homeAway === 'away' ? 'awayTeamOdds' : 'homeTeamOdds', hb = ha === 'homeTeamOdds' ? 'awayTeamOdds' : 'homeTeamOdds'; const oa = american(o[ha] && (o[ha].moneyLine != null ? o[ha].moneyLine : o[ha].odds)), ob = american(o[hb] && (o[hb].moneyLine != null ? o[hb].moneyLine : o[hb].odds)); if (oa && ob) m.o = { a: oa, b: ob, p: (o.provider && o.provider.name) || 'casa' }; }
      } catch (e) {}
      if (old && old.o && (old.o.p === 'Betano' || !m.o)) m.o = old.o;     // a odd que meteste da Betano manda
      DB.m[id] = m; n++;
    });
  });
  return n;
}
async function fetchDay(tour, d) { const j = await getJSON(`${ESPN}/${tour}/scoreboard?dates=${d}`); let n = 0; (j.events || []).forEach(ev => { n += ingestEvent(ev, tour); }); return n; }
let BUSY = false;
async function refresh() {
  if (BUSY || !SEED) return; BUSY = true;
  const btn = $('#btnRefresh'); btn.classList.add('spin');
  const T = today(); let fails = 0, got = 0;
  try {
    // 1.ª vez: do fim do arquivo até hoje (uma vez só); depois: últimos 3 dias + amanhã
    const start = DB.days.__from || ymdAdd(cutOf('atp'), 1);
    const want = [];
    for (let d = start; d <= ymdAdd(T, 1); d = ymdAdd(d, 1)) if (!DB.days[d] || d >= ymdAdd(T, -3)) want.push(d);
    const big = want.length > 6;
    for (let i = 0; i < want.length; i++) {
      const d = want[i];
      setUpd(big ? `A pôr a época em dia: ${i + 1}/${want.length} dias…` : `A buscar ${d.slice(6)}/${d.slice(4, 6)}…`);
      let df = 0;
      for (const tour of ['atp', 'wta']) { try { got += await fetchDay(tour, d); } catch (e) { fails++; df++; } }
      if (d < ymdAdd(T, -3) && !df) DB.days[d] = 1;          // só fica «feito» se as duas vieram bem
      if (i >= 2 && !got && fails >= 2 * (i + 1)) break;      // sem ligação: não insistir 300 vezes
      if (big && i % 10 === 9) { saveDB(); await new Promise(r => setTimeout(r, 150)); }
    }
    DB.days.__from = DB.days.__from || start;
    saveDB();
    const nu = applyResults();
    snapshotPreds(); snapshotSlips();
    const sett = settleAll(); const pil = pilotRun(); bossFeed();
    LS.set('last', Date.now());
    toast(fails && !got ? 'Sem ligação à ESPN. Experimenta «Testar ligação» no Mais.' : `✓ ${got} jogos lidos${nu ? ` · ${nu} resultados no Elo` : ''}${sett ? ` · ${sett} apostas fechadas` : ''}${pil ? ` · o Vi sozinho apostou em ${pil}` : ''}`, 4200);
  } catch (e) { toast('Falhou: ' + esc(e.message || e)); }
  finally { BUSY = false; btn.classList.remove('spin'); render(); }
}

/* =====================================================================
   3) O CÉREBRO DO VI
   Vencedor: Elo (70% geral + 30% superfície) → probabilidade → correção
   de calibração (testada). Se houver odd da casa, junta as duas.
   Jogos: serviço/resposta de cada um → ponto → jogo → set → encontro, com
   mistura «dia bom / normal / dia mau» (sem ela o modelo dava jogos a mais).
   ===================================================================== */
function hold(s) { const q = 1 - s, d = s * s / (s * s + q * q); return Math.pow(s, 4) * (1 + 4 * q + 10 * q * q) + 20 * Math.pow(s, 3) * Math.pow(q, 3) * d; }
function tiebreak(sa, sb) {
  const M = new Map();
  const f = (a, b) => {
    if (a >= 7 && a - b >= 2) return 1; if (b >= 7 && b - a >= 2) return 0;
    if (a >= 6 && a === b) { const pa = sa * (1 - sb), pb = (1 - sa) * sb; return pa / (pa + pb); }
    const k = a * 32 + b; if (M.has(k)) return M.get(k);
    const n = a + b, aS = (n % 4 === 0) || (n % 4 === 3), p = aS ? sa : 1 - sb;
    const v = p * f(a + 1, b) + (1 - p) * f(a, b + 1); M.set(k, v); return v;
  };
  return f(0, 0);
}
function setDist(ha, hb, tb) {
  const out = new Map();
  const add = (k, p) => out.set(k, (out.get(k) || 0) + p);
  const go = (a, b, p) => {
    if (p < 1e-12) return;
    if ((a === 6 && b <= 4) || (a === 7 && b === 5) || (b === 6 && a <= 4) || (b === 7 && a === 5)) return add(a + '-' + b, p);
    if (a === 6 && b === 6) { add('7-6', p * tb); add('6-7', p * (1 - tb)); return; }
    const w = (a + b) % 2 === 0 ? ha : 1 - hb;
    go(a + 1, b, p * w); go(a, b + 1, p * (1 - w));
  };
  go(0, 0, 1);
  return [...out].map(([k, p]) => { const [x, y] = k.split('-').map(Number); return [x, y, p]; });
}
const MD = new Map();
function matchDist(sa, sb, bo) {
  sa = Math.round(clamp(sa, 0.3, 0.92) * 1000) / 1000; sb = Math.round(clamp(sb, 0.3, 0.92) * 1000) / 1000;
  const key = sa + '|' + sb + '|' + bo; if (MD.has(key)) return MD.get(key);
  const ha = hold(sa), hb = hold(sb);
  const SA = setDist(ha, hb, tiebreak(sa, sb)), SB = setDist(hb, ha, tiebreak(sb, sa)).map(([x, y, p]) => [y, x, p]);
  // programação dinâmica set a set: estados iguais (sets, jogos, diferença, quem serve) juntam-se — rápido também à melhor de 5
  const need = bo === 3 ? 2 : 3, res = new Map();
  let st = new Map([['0|0|0|0|1', 0.5], ['0|0|0|0|0', 0.5]]);
  while (st.size) {
    const nx = new Map();
    for (const [k, p] of st) {
      const [wa, wb, g, d, af] = k.split('|').map(Number), D = af ? SA : SB;
      for (const [x, y, q] of D) {
        const a2 = wa + (x > y), b2 = wb + (y > x), g2 = g + x + y, d2 = d + x - y, pq = p * q;
        if (a2 === need || b2 === need) { const kk = (a2 === need ? 1 : 0) + '|' + g2 + '|' + d2 + '|' + (a2 + b2); res.set(kk, (res.get(kk) || 0) + pq); }
        else { const f2 = (x + y) % 2 === 0 ? af : 1 - af, kk = a2 + '|' + b2 + '|' + g2 + '|' + d2 + '|' + f2; nx.set(kk, (nx.get(kk) || 0) + pq); }
      }
    }
    st = nx;
  }
  const arr = [...res].map(([k, p]) => { const [w, g, d, n] = k.split('|').map(Number); return { w, g, d, n, p }; });
  if (MD.size > 20000) MD.clear();
  MD.set(key, arr); return arr;
}
const pwinD = D => D.reduce((s, x) => s + (x.w ? x.p : 0), 0);
/* só a probabilidade de ganhar (sem contar jogos): muito mais rápida, serve para afinar a mistura */
const PW = new Map();
function pwinFast(sa, sb, bo) {
  sa = Math.round(clamp(sa, 0.3, 0.92) * 1000) / 1000; sb = Math.round(clamp(sb, 0.3, 0.92) * 1000) / 1000;
  const key = sa + '|' + sb + '|' + bo; if (PW.has(key)) return PW.get(key);
  const ha = hold(sa), hb = hold(sb), SA = setDist(ha, hb, tiebreak(sa, sb)), SB = setDist(hb, ha, tiebreak(sb, sa)).map(([x, y, p]) => [y, x, p]);
  // por set: P(A ganha o set) e P(muda quem serve a seguir), conforme quem serve primeiro
  const summ = D => { let w = 0, wf = 0, lf = 0; D.forEach(([x, y, p]) => { const flip = (x + y) % 2 === 1; if (x > y) { w += p; if (flip) wf += p; } else if (flip) lf += p; }); return { w, wf, lf }; };
  const S = [summ(SB), summ(SA)], need = bo === 3 ? 2 : 3, M = new Map();
  const go = (wa, wb, af) => {
    if (wa === need) return 1; if (wb === need) return 0;
    const k = wa * 100 + wb * 10 + af; if (M.has(k)) return M.get(k);
    const s_ = S[af], wKeep = s_.w - s_.wf, lKeep = 1 - s_.w - s_.lf;
    const v = wKeep * go(wa + 1, wb, af) + s_.wf * go(wa + 1, wb, 1 - af) + lKeep * go(wa, wb + 1, af) + s_.lf * go(wa, wb + 1, 1 - af);
    M.set(k, v); return v;
  };
  const v = 0.5 * go(0, 0, 1) + 0.5 * go(0, 0, 0);
  if (PW.size > 50000) PW.clear(); PW.set(key, v); return v;
}
const MIX = { atp3: 0.055, atp5: 0.065, wta3: 0.05 };
function gamesDist(tour, sf, svA, rvA, svB, rvB, p, bo) {
  const base = (SEED.tours[tour].base || {})[{ h: 'Hard', c: 'Clay', g: 'Grass' }[sf]] || (tour === 'atp' ? 0.64 : 0.565);
  const sa0 = base + (svA || 0) - (rvB || 0), sb0 = base + (svB || 0) - (rvA || 0);
  const dl = MIX[tour + bo] || 0.055, W = [[-dl, 0.25], [0, 0.5], [dl, 0.25]];
  const mix = x => { const out = new Map(); W.forEach(([e, w]) => matchDist(sa0 + x + e, sb0 - x - e, bo).forEach(r => { const k = r.w + '|' + r.g + '|' + r.d + '|' + r.n; out.set(k, (out.get(k) || 0) + w * r.p); })); return [...out].map(([k, pp]) => { const [w, g, d, n] = k.split('|').map(Number); return { w, g, d, n, p: pp }; }); };
  let lo = -0.3, hi = 0.3;
  const pw = x => W.reduce((t, [e, w]) => t + w * pwinFast(sa0 + x + e, sb0 - x - e, bo), 0);
  for (let i = 0; i < 14; i++) { const x = (lo + hi) / 2; if (pw(x) < p) lo = x; else hi = x; }
  return mix((lo + hi) / 2);
}
function bo5(p) { let lo = 0, hi = 1, q = 0.5; for (let i = 0; i < 40; i++) { q = (lo + hi) / 2; if (q * q * (3 - 2 * q) < p) lo = q; else hi = q; } return Math.pow(q, 3) * (10 - 15 * q + 6 * q * q); }
const half = v => Math.floor(v) + 0.5;
/* Fatores além do Elo — só os que passaram o teste cego (afinado 2015-24, confirmado 2025-06+):
   serviço+resposta (52 semanas), idade acima dos 31, paragem >60 dias.
   Testados e NÃO usados (não melhoravam fora da amostra): H2H, forma recente, superfície extra, canhoto, altura. */
const dayN = s => { s = String(s || '').replace(/-/g, ''); if (s.length < 8) return null; return Date.UTC(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8)) / 864e5; };
function factorsOf(T, A, B, m) {
  const c = T.fx, k0 = T.calk || 1;
  if (!c) return { k: k0, sum: 0, list: [] };
  const yr = (() => { const d = new Date(m.d || Date.now()); return d.getUTCFullYear() + (d.getUTCMonth() + 1) / 12; })();
  const svr = P => (P.sv || 0) + (P.rv || 0);
  const ageF = P => P.by > 0 ? Math.max(0, yr - P.by - 31) / 3 : 0;
  const md = dayN(m.ed || ymdOf(new Date(m.d || Date.now())));
  const lay = P => { const l = dayN(P.last); return l != null && md != null && md - l > 60 ? 1 : 0; };
  const list = [
    { id: 'sv', nm: 'Serviço + resposta (último ano)', v: c.svret[0] * (svr(A) - svr(B)) * 10, a: svr(A), b: svr(B) },
    { id: 'age', nm: 'Idade (acima dos 31 costuma pesar)', v: c.idade[0] * (ageF(A) - ageF(B)), a: A.by > 0 ? Math.floor(yr - A.by) : null, b: B.by > 0 ? Math.floor(yr - B.by) : null },
    { id: 'lay', nm: 'Paragem longa (>60 dias sem jogar)', v: c.paragem[0] * (lay(A) - lay(B)), a: lay(A), b: lay(B) }
  ];
  return { k: c.elo, sum: list.reduce((s, x) => s + x.v, 0), list };
}
const PC = new Map();                                // memória de previsões (a ficha, o cartão e o boletim pedem a mesma várias vezes)
let CALW = null;
function calibW() {   // escolhe o peso das odds que menos erra nas previsões guardadas antes de cada jogo (com «inércia» de 300 jogos)
  const k = Object.keys(PREDS).length + '|' + LS.get('last', 0) + '|' + CFG.mktW; if (CALW && CALW.k === k) return CALW;
  const rows = [];
  Object.entries(PREDS).forEach(([id, p]) => { const m = mOf(id); if (!m || m.s !== 'post' || !m.w || p.nv == null || p.pE == null) return; rows.push([p.nv, p.pE, m.w === 'a']); });
  let best = CFG.mktW, bl = Infinity;
  if (rows.length >= 30) for (let w = 0.3; w <= 1.0001; w += 0.02) { let s = 0; rows.forEach(([q, pe, y]) => { const p = clamp(w * q + (1 - w) * pe, 1e-4, 1 - 1e-4); s -= Math.log(y ? p : 1 - p); }); if (s < bl) { bl = s; best = w; } }
  CALW = { k, n: rows.length, raw: best, w: clamp((rows.length * best + 300 * CFG.mktW) / (rows.length + 300), 0.3, 1) };
  return CALW;
}
function predict(m) {
  const A = getP(m.t, m.a.n, m.a.rk, m.a.ioc), B = getP(m.t, m.b.n, m.b.rk, m.b.ioc), sf = m.sf || 'h', o = m.o || (MAN[m.id] && MAN[m.id].o) || {};
  const key = [m.id, sf, m.bo, m.d, o.a, o.b, A.e, B.e, A.es[sf], B.es[sf], A.last, B.last, calibW().w, CFG.evMin, CFG.oddMin, CFG.oddMax].join('|');
  const hit = PC.get(m.id); if (hit && hit.k === key) return hit.P;
  const P = predict0(m); PC.set(m.id, { k: key, P }); return P;
}
function predict0(m) {
  const tour = m.t, T = SEED.tours[tour], ws = T.par.ws, sf = m.sf || 'h';
  const A = getP(tour, m.a.n, m.a.rk, m.a.ioc), B = getP(tour, m.b.n, m.b.rk, m.b.ioc);
  const ra = (1 - ws) * A.e + ws * A.es[sf], rb = (1 - ws) * B.e + ws * B.es[sf];
  let p = 1 / (1 + Math.pow(10, (rb - ra) / 400));
  if (m.bo === 5) p = bo5(p);
  const fx = factorsOf(T, A, B, m), z0 = Math.log(p / (1 - p));
  p = 1 / (1 + Math.exp(-(fx.k * z0 + fx.sum)));
  const pElo = p;
  const odds = m.o || (MAN[m.id] && MAN[m.id].o) || null;
  let pNV = null, W = 0;
  if (odds && odds.a > 1 && odds.b > 1) { pNV = (1 / odds.a) / (1 / odds.a + 1 / odds.b); W = calibW().w; p = W * pNV + (1 - W) * pElo; }
  const D = gamesDist(tour, sf, A.sv, A.rv, B.sv, B.rv, p, m.bo);
  const P = { m, A, B, ra, rb, pElo, pNV, W, pA: p, D, sf, fx, conf: Math.max(p, 1 - p), fav: p >= 0.5 ? 'a' : 'b' };
  P.eg = D.reduce((s, x) => s + x.g * x.p, 0); P.ed = D.reduce((s, x) => s + x.d * x.p, 0);
  P.cands = candidates(m, P);
  const elig = P.cands.filter(c => c.real && c.odd >= CFG.oddMin && c.odd <= CFG.oddMax).sort((a, b) => b.ev - a.ev);
  P.best = elig[0] || null; P.value = P.best && P.best.ev >= CFG.evMin ? P.best : null;
  return P;
}
/* probabilidade de cada mercado a partir da distribuição */
function probs(P, mk, sel, line) {
  const D = P.D; let w = 0, push = 0;
  if (mk === 'ml') return { w: sel === 'a' ? P.pA : 1 - P.pA, push: 0 };
  if (mk === 'hg') { D.forEach(x => { const v = (sel === 'a' ? x.d : -x.d) + line; if (v > 0) w += x.p; else if (v === 0) push += x.p; }); }
  else if (mk === 'tg') { D.forEach(x => { const v = sel === 'o' ? x.g - line : line - x.g; if (v > 0) w += x.p; else if (v === 0) push += x.p; }); }
  else if (mk === 's20') { D.forEach(x => { if ((sel === 'a' ? x.w : !x.w) && x.n === (P.m.bo === 5 ? 3 : 2)) w += x.p; }); }
  else if (mk === 'ns') { D.forEach(x => { if (sel === 'o' ? x.n === (P.m.bo === 5 ? 5 : 3) : x.n !== (P.m.bo === 5 ? 5 : 3)) w += x.p; }); }
  return { w, push };
}
const evOf = (q, odd) => q.w * odd + q.push - 1;
const fairOf = q => q.w > 0 ? (1 - q.push) / q.w : 99;
function candidates(m, P) {
  const out = [], add = (mk, sel, line, odd, real) => { const q = probs(P, mk, sel, line); out.push({ mk, sel, line, odd: odd ? r2(odd) : null, real: !!real && odd > 1, p: q.w, push: q.push, ev: odd > 1 ? evOf(q, odd) : null, fair: fairOf(q) }); };
  const o = m.o || (MAN[m.id] && MAN[m.id].o) || {};
  add('ml', 'a', null, o.a, true); add('ml', 'b', null, o.b, true);
  return out;
}
/* linhas de jogos «à volta» da previsão (para mostrar e para o boletim) */
function gameLines(P) {
  const bo = P.m.bo, eg = P.eg;
  const tl = []; for (let L = half(eg - 3); L <= half(eg + 3); L += 1) tl.push(L);
  const fav = P.fav, hl = []; [1.5, 2.5, 3.5, 4.5, 5.5].forEach(h => hl.push(h));
  return { tl, hl, fav };
}
const pName = (m, s) => (s === 'a' ? m.a.n : m.b.n);
const shortName = n => { const p = String(n).split(' '); return p.length > 1 ? p[0][0] + '. ' + p.slice(1).join(' ') : n; };
function selLabel(m, mk, sel, line) {
  if (mk === 'ml') return pName(m, sel) + ' ganha';
  if (mk === 'hg') return shortName(pName(m, sel)) + ' ' + (line > 0 ? '+' : '−') + ln(Math.abs(line)) + ' jogos';
  if (mk === 'tg') return (sel === 'o' ? 'Mais de ' : 'Menos de ') + ln(line) + ' jogos';
  if (mk === 's20') return shortName(pName(m, sel)) + ' ganha ' + (m.bo === 5 ? '3-0' : '2-0') + ' em sets';
  if (mk === 'ns') return sel === 'o' ? `Vai a ${m.bo === 5 ? '5' : '3'} sets` : `Não vai a ${m.bo === 5 ? '5' : '3'} sets`;
  return mk;
}
const mkName = mk => ({ ml: 'Vencedor', hg: 'Handicap de jogos', tg: 'Total de jogos', s20: 'Resultado em sets', ns: 'Número de sets' }[mk] || mk);
const mLabel = m => shortName(m.a.n) + ' – ' + shortName(m.b.n);

/* previsões guardadas até ao início (para o veredito e estatísticas) */
function snapshotPreds() {
  const now = Date.now();
  Object.values(DB.m).forEach(m => {
    if (m.s !== 'pre' || new Date(m.d).getTime() < now - 6e5 || m.ed > ymdAdd(today(), 2)) return;
    const P = predict(m);
    PREDS[m.id] = { pA: r3(P.pA), pE: r3(P.pElo), nv: P.pNV != null ? r3(P.pNV) : null, oa: (m.o && m.o.a) || null, ob: (m.o && m.o.b) || null, eg: r2(P.eg), ed: m.ed, t: m.t, sf: m.sf, ev: m.ev, bo: m.bo, rk: [m.a.rk || 0, m.b.rk || 0], pk: P.value ? { mk: P.value.mk, sel: P.value.sel, line: P.value.line, odd: P.value.odd, ev: r2(P.value.ev), p: r2(P.value.p), lb: selLabel(m, P.value.mk, P.value.sel, P.value.line) } : null, ts: now };
  });
  const ks = Object.keys(PREDS); if (ks.length > 1500) ks.sort((a, b) => PREDS[a].ts - PREDS[b].ts).slice(0, ks.length - 1500).forEach(k => delete PREDS[k]);
  LS.set('preds', PREDS);
}

/* =====================================================================
   4) BOLETIM SEGURO (só jogos do próprio dia)
   Seleções com ≥85% para o Vi: favorito ganha, total de jogos alternativo
   ou handicap de jogos do azarão. Junta enquanto o boletim passa dos 70%.
   As odds são estimadas: mete as da Betano.
   ===================================================================== */
const SAFE_LEG = 0.85, SAFE_SLIP = 0.70;
const estOdd = p => r2(Math.max(1.01, 1 / (Math.min(0.97, p) * 1.06)));
function safeCands(day) {
  const now = Date.now(), out = [];
  Object.values(DB.m).filter(m => m.s === 'pre' && m.ed === day && new Date(m.d).getTime() > now + 10 * 60e3).forEach(m => {
    const P = predict(m), opts = [];
    opts.push({ mk: 'ml', sel: P.fav, line: null, p: P.conf });
    // linhas que a Betano costuma ter: total até 6 jogos abaixo do esperado; handicap do azarão até +6,5
    for (let L = half(P.eg - 2); L >= half(P.eg - 6); L -= 1) { const q = probs(P, 'tg', 'o', L).w; if (q >= SAFE_LEG) { opts.push({ mk: 'tg', sel: 'o', line: L, p: q }); break; } }
    const dog = P.fav === 'a' ? 'b' : 'a';
    for (let H = 2.5; H <= 6.5; H += 1) { const q = probs(P, 'hg', dog, H).w; if (q >= SAFE_LEG) { opts.push({ mk: 'hg', sel: dog, line: H, p: q }); break; } }
    // a mais «barata» que ainda passa os 85% (evita seleções de 93% que pagam 1,01)
    bossPool(m, opts);
    const best = opts.filter(x => x.p >= SAFE_LEG && x.p <= 0.95).sort((a, b) => a.p - b.p)[0];
    if (best) out.push(Object.assign(best, { m, odd: estOdd(best.p), est: true, lb: selLabel(m, best.mk, best.sel, best.line) }));
  });
  return out.sort((a, b) => b.p - a.p);
}
function safeAuto(C) { const pick = new Set(); let P = 1; C.forEach((c, i) => { if (pick.size < 5 && (i === 0 || P * c.p >= SAFE_SLIP)) { P *= c.p; pick.add(i); } }); return pick; }
const safeLeg = (c, odd) => ({ g: c.m.id, gl: mLabel(c.m), gd: c.m.d, mk: c.mk, sel: c.sel, line: c.line, odd: r2(odd || c.odd), lb: c.lb, p: r2(c.p), est: !!c.est });
function snapshotSlips() {
  const T = today(), now = Date.now();
  [0, 1].forEach(off => {
    const d = ymdAdd(T, off), cur = SLIPS[d];
    if (cur && cur.d0 && now > cur.d0 - 10 * 60e3) return;
    const C = safeCands(d), pick = safeAuto(C), legs = C.filter((_, i) => pick.has(i));
    if (!legs.length) { if (cur) delete SLIPS[d]; return; }
    SLIPS[d] = { legs: legs.map(c => safeLeg(c)), p: r2(legs.reduce((a, c) => a * c.p, 1)), odd: r2(legs.reduce((a, c) => a * c.odd, 1)), t: now, d0: Math.min(...legs.map(c => new Date(c.m.d).getTime())) };
  });
  const ks = Object.keys(SLIPS).sort(); if (ks.length > 150) ks.slice(0, ks.length - 150).forEach(k => delete SLIPS[k]);
  LS.set('slips', SLIPS);
}

/* =====================================================================
   5) CONTAS: Tu · Mister Vi · Vi sozinho (bot)
   ===================================================================== */
const ACC = { tu: { n: 'Tu', ic: 'star', c: '#60a5fa' }, to: { n: 'Mister Vi', ic: 'racket', c: '#ff8a2a' }, pi: { n: 'Vi sozinho', ic: 'robot', c: '#c084fc' } };
function accStats(acc) {
  const B = BETS.filter(b => b.acc === acc), dep = DEPOS.filter(d => d.acc === acc).reduce((s, d) => s + d.v, 0);
  let staked = 0, ret = 0, open = 0, setSt = 0, setRet = 0, w = 0, l = 0;
  B.forEach(b => { staked += b.stake; if (b.st === 'open') open += b.stake; else { ret += b.ret || 0; if (b.st !== 'void') { setSt += b.stake; setRet += b.ret || 0; if (b.st === 'won') w++; if (b.st === 'lost') l++; } } });
  const start = (CFG.bank[acc] || 0) + dep;
  return { start, bal: r2(start - staked + ret), open: r2(open), profit: r2(setRet - setSt), roi: setSt ? (setRet - setSt) / setSt : 0, w, l, n: B.length };
}
function newBet(acc, m, c, stake, extra) {
  const b = Object.assign({ id: acc + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), acc, g: m.id, gl: mLabel(m), gd: m.d, mk: c.mk, sel: c.sel, line: c.line == null ? null : c.line, odd: r2(c.odd), stake: r2(stake), t: Date.now(), st: 'open', ret: 0, lb: selLabel(m, c.mk, c.sel, c.line) }, extra || {});
  BETS.push(b); return b;
}
function newMulti(acc, legs, stake, extra) {
  const odd = r2(legs.reduce((a, l) => a * l.odd, 1));
  const b = Object.assign({ id: acc + 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), acc, mk: 'multi', legs: legs.map(l => Object.assign({}, l)), g: legs[0].g, gl: legs.length + ' jogos', gd: legs.reduce((m, l) => l.gd > m ? l.gd : m, legs[0].gd), odd, stake: r2(stake), t: Date.now(), st: 'open', ret: 0, lb: 'Múltipla · ' + legs.length + ' seleções' }, extra || {});
  BETS.push(b); return b;
}
const gameTot = m => m.sets.reduce((s, x) => s + x[0] + x[1], 0);
const gameDiff = m => m.sets.reduce((s, x) => s + x[0] - x[1], 0);
const setDone = ([a, b]) => ((a >= 6 || b >= 6) && Math.abs(a - b) >= 2) || a + b === 13;   // set acabado (6-4, 7-5, 7-6…)
function outcome(b, m) {
  if (!m) return null;
  if (m.s === 'off') return 'void';
  if (m.s !== 'post' || !m.w) return null;
  if (m.ret) return b.mk === 'ml' ? (m.sets.some(setDone) ? (m.w === b.sel ? 'won' : 'lost') : 'void') : 'void';
  if (b.mk === 'ml') return m.w === b.sel ? 'won' : 'lost';
  if (b.mk === 'hg') { const v = (b.sel === 'a' ? gameDiff(m) : -gameDiff(m)) + b.line; return v > 0 ? 'won' : v < 0 ? 'lost' : 'push'; }
  if (b.mk === 'tg') { const v = b.sel === 'o' ? gameTot(m) - b.line : b.line - gameTot(m); return v > 0 ? 'won' : v < 0 ? 'lost' : 'push'; }
  if (b.mk === 's20') { const ws = m.sets.filter(x => (b.sel === 'a' ? x[0] > x[1] : x[1] > x[0])).length, ls = m.sets.length - ws; return m.w === b.sel && ls === 0 ? 'won' : 'lost'; }
  if (b.mk === 'ns') { const full = m.sets.length === (m.bo === 5 ? 5 : 3); return (b.sel === 'o') === full ? 'won' : 'lost'; }
  return null;
}
const mOf = id => DB.m[id] || (MAN[id] && MAN[id].m) || null;
function settleMulti(b) {
  let eff = 1, pend = false, lost = false;
  b.legs.forEach(l => { const r = outcome(l, mOf(l.g)); l.r = r; if (r === null) pend = true; else if (r === 'lost') lost = true; else if (r === 'won') eff *= l.odd; });
  if (lost) { b.st = 'lost'; b.ret = 0; } else if (pend) return false; else { b.st = eff > 1.0001 ? 'won' : 'push'; b.ret = r2(b.stake * eff); }
  b.tset = Date.now(); return true;
}
function settleAll() {
  let n = 0;
  BETS.forEach(b => {
    if (b.st !== 'open') return;
    if (b.mk === 'multi') { if (settleMulti(b)) n++; return; }
    const m = mOf(b.g); const r = outcome(b, m); if (!r) return;
    b.st = r; b.ret = r === 'won' ? r2(b.stake * b.odd) : (r === 'push' || r === 'void') ? b.stake : 0; b.res = m.sets.map(x => x[0] + '-' + x[1]).join(' '); b.tset = Date.now(); n++;
  });
  if (n) saveBets(); return n;
}
const m0 = g => !!g;
/* =====================================================================
   🤖 Vi SOZINHO: um bot que aposta sozinho, sem ninguém lhe mexer.
   Regra fixa: em cada jogo das próximas 36 horas, aposta no vencedor que a
   cabeça dele (o modelo puro, sem copiar as odds) prefere, à odd da ESPN do
   momento. Valor fixo. Serve para ver como ele se porta de verdade.
   Teste às cegas jun 2025 → jun 2026 (jogos de tour): o Elo acerta ~66% dos vencedores (não há odds históricas grátis de ténis para medir o lucro).
   ===================================================================== */
const BOT_TEST = { acerto: 0.66, roi: null, n: null, txt: '66% de acerto (jun 2025 → jun 2026) · lucro por medir' };
function pilotRun() {
  if (!CFG.piOn) return 0;
  const now = Date.now(); let n = 0;
  const done = new Set(BETS.filter(b => b.acc === 'pi' && b.mk !== 'multi').map(b => b.g));
  Object.values(DB.m).filter(g => m0(g) && g.s === 'pre' && !done.has(g.id) && g.o && g.o.a > 1 && g.o.b > 1).sort((x, y) => x.d < y.d ? -1 : 1).forEach(g => {
    const t0 = new Date(g.d).getTime(); if (t0 < now + 5 * 60e3 || t0 > now + 36 * 3600e3) return;
    const P = predict(g), ph = P.pElo, sel = ph >= 0.5 ? 'a' : 'b', odd = sel === 'a' ? g.o.a : g.o.b;
    const nva = (1 / g.o.a) / (1 / g.o.a + 1 / g.o.b);
    const stake = Math.max(CFG.min, r2(CFG.piStake)); if (accStats('pi').bal < stake) return;
    newBet('pi', g, { mk: 'ml', sel, line: null, odd }, stake, { auto: 1, pk: r2(sel === 'a' ? ph : 1 - ph), nv: r2(sel === 'a' ? nva : 1 - nva), src: g.o.p || 'ESPN' });
    n++;
  });
  if (n) saveBets();
  return n;
}
function botStats() {
  const B = BETS.filter(b => b.acc === 'pi' && b.auto), S = B.filter(b => b.st === 'won' || b.st === 'lost' || b.st === 'push');
  const w = S.filter(b => b.st === 'won').length, l = S.filter(b => b.st === 'lost').length;
  const plOf = L => r2(L.reduce((s, b) => s + (b.ret || 0) - b.stake, 0));
  const dog = S.filter(b => b.nv != null && b.nv < 0.5), fav = S.filter(b => b.nv != null && b.nv >= 0.5), conf = S.filter(b => b.pk >= 0.7);
  const st = S.reduce((s, b) => s + b.stake, 0), ret = S.reduce((s, b) => s + (b.ret || 0), 0);
  const byD = {}; S.forEach(b => { const k = String(b.gd).slice(0, 10); (byD[k] = byD[k] || []).push(b); });
  const days = Object.entries(byD).map(([k, L]) => ({ k, w: L.filter(b => b.st === 'won').length, l: L.filter(b => b.st === 'lost').length, pl: plOf(L) })).sort((a, b) => a.k < b.k ? 1 : -1);
  const byG = {}; S.forEach(b => { const k = (() => { const m = mOf(b.g); return m ? m.t.toUpperCase() + ' · ' + (SURF_NAME[m.sf] || '') : ''; })(); if (!k) return; const o = byG[k] = byG[k] || { n: 0, w: 0, pl: 0 }; o.n++; if (b.st === 'won') o.w++; o.pl += (b.ret || 0) - b.stake; });
  let run = 0; const curve = S.slice().sort((a, b) => (a.tset || a.t) - (b.tset || b.t)).map(b => (run += (b.ret || 0) - b.stake));
  return { n: B.length, open: B.filter(b => b.st === 'open').length, openL: B.filter(b => b.st === 'open'), w, l, p: S.length - w - l, hit: w + l ? w / (w + l) : null, roi: st ? (ret - st) / st : null, pl: r2(ret - st),
    dogN: dog.length, dogW: dog.filter(b => b.st === 'won').length, dogPl: plOf(dog), favN: fav.length, favW: fav.filter(b => b.st === 'won').length, favPl: plOf(fav), confN: conf.length, confW: conf.filter(b => b.st === 'won').length, days, byG, curve };
}

function slipResult(S) {
  if (!S) return null; let pend = false, lost = false, w = 0;
  S.legs.forEach(l => { const r = outcome(l, mOf(l.g)); l.r = r; if (r === null) pend = true; else if (r === 'lost') lost = true; else if (r === 'won') w++; });
  return { st: lost ? 'lost' : pend ? 'open' : 'won', w, n: S.legs.length };
}

/* =====================================================================
   📤 FICHA PARA O MISTER BOSS
   Em cada atualização, o Vi deixa no telemóvel as seleções do dia que
   passam dos 80% (e as apostas de valor), e confere as antigas com o seu
   próprio código de liquidação. O Mister Boss só lê esta ficha.
   ===================================================================== */
let BPOOL = null;
function bossPool(g, opts) {
  if (!BPOOL) return;
  opts.forEach(x => { const p = x.c != null ? x.c : x.p; if (p >= 0.80 && p <= 0.985) BPOOL.push({ g, mk: x.mk, sel: x.sel, line: x.line == null ? null : x.line, p, odd: x.odd || null, est: x.est !== false }); });
}
function bossFeed() {
  try {
    const F = LS.get('boss', null) || { v: 1, legs: {} }, now = Date.now();
    const gameOf = id => mOf(id), segOf = g => ({ lg: String(g.t).toUpperCase(), cat: SURF_NAME[g.sf] || '', ev: g.ev || '' }), glOf = g => mLabel(g);
    BPOOL = []; [today(), ymdAdd(today(), 1)].forEach(d => { try { safeCands(d); } catch (e) {} }); const pool = BPOOL; BPOOL = null;
    Object.values(DB.m).filter(g => g && g.s === 'pre' && new Date(g.d).getTime() > now && new Date(g.d).getTime() < now + 36 * 3600e3).forEach(g => {
      try { const v = predict(g).value; if (v) pool.push({ g, mk: v.mk, sel: v.sel, line: v.line == null ? null : v.line, p: v.p, odd: v.odd, est: false, val: r2(v.ev) }); } catch (e) {}
    });
    pool.forEach(x => {
      const id = x.g.id + '|' + x.mk + '|' + x.sel + '|' + x.line + (x.val != null ? '|v' : ''), L = F.legs[id];
      const rec = { id, g: x.g.id, gl: glOf(x.g), d: x.g.d, mk: x.mk, mkn: mkName(x.mk), sel: x.sel, line: x.line, lb: selLabel(x.g, x.mk, x.sel, x.line), p: Math.round(x.p * 1000) / 1000, odd: x.odd ? r2(x.odd) : null, est: !!x.est, val: x.val != null ? x.val : null, seg: segOf(x.g), st: 'open', t: now };
      if (!L) F.legs[id] = rec; else if (L.st === 'open' && new Date(L.d).getTime() > now) Object.assign(L, { p: rec.p, odd: rec.odd, est: rec.est, val: rec.val, t: now });
    });
    Object.values(F.legs).forEach(l => { if (l.st !== 'open') return; const g = gameOf(l.g); if (!g) return; let r = null; try { r = outcome(l, g); } catch (e) {} if (r) { l.st = r; l.tset = now; } });
    const ks = Object.keys(F.legs); if (ks.length > 900) ks.sort((a, b) => F.legs[a].t - F.legs[b].t).slice(0, ks.length - 900).forEach(k => delete F.legs[k]);
    Object.assign(F, { app: 'vi', name: 'Mister Vi', sport: 'Ténis · ATP/WTA', ver: APP_VER, t: now });
    LS.set('boss', F);
  } catch (e) { console.warn('bossFeed', e); }
}
