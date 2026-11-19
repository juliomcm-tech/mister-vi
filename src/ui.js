/* bandeira do país (emoji Unicode) a partir do código olímpico que a ESPN/arquivo dão */
const IOC2 = { ARG:'AR',AUS:'AU',AUT:'AT',BEL:'BE',BIH:'BA',BLR:'BY',BOL:'BO',BRA:'BR',BUL:'BG',CAN:'CA',CHI:'CL',CHN:'CN',COL:'CO',CRO:'HR',CYP:'CY',CZE:'CZ',DEN:'DK',ECU:'EC',EGY:'EG',ESP:'ES',EST:'EE',FIN:'FI',FRA:'FR',GBR:'GB',GEO:'GE',GER:'DE',GRE:'GR',HKG:'HK',HUN:'HU',IND:'IN',INA:'ID',IRL:'IE',ISR:'IL',ITA:'IT',JPN:'JP',KAZ:'KZ',KOR:'KR',LAT:'LV',LTU:'LT',LUX:'LU',MAR:'MA',MDA:'MD',MEX:'MX',MKD:'MK',MNE:'ME',MON:'MC',NED:'NL',NOR:'NO',NZL:'NZ',PAR:'PY',PER:'PE',PHI:'PH',POL:'PL',POR:'PT',PUR:'PR',ROU:'RO',RSA:'ZA',RUS:'RU',SLO:'SI',SRB:'RS',SUI:'CH',SVK:'SK',SWE:'SE',THA:'TH',TPE:'TW',TUN:'TN',TUR:'TR',UKR:'UA',URU:'UY',USA:'US',UZB:'UZ',VEN:'VE',VIE:'VN',ZIM:'ZW',DOM:'DO',CRC:'CR',QAT:'QA',UAE:'AE',KSA:'SA',SGP:'SG',MAS:'MY',PAK:'PK',SRI:'LK',ISL:'IS',AND:'AD',LIE:'LI',SMR:'SM',MLT:'MT',ALB:'AL',ARM:'AM',AZE:'AZ',KGZ:'KG',TJK:'TJ',JOR:'JO',LBN:'LB',NGR:'NG',KEN:'KE',CMR:'CM',CIV:'CI',SEN:'SN',BAR:'BB',JAM:'JM',BAH:'BS',GUA:'GT',ESA:'SV',PAN:'PA',HON:'HN' };
const flag = ioc => { const c = IOC2[String(ioc || '').toUpperCase()] || (String(ioc || '').length === 2 ? String(ioc).toUpperCase() : null); return c ? String.fromCodePoint(...[...c].map(x => 0x1F1E6 + x.charCodeAt(0) - 65)) + ' ' : ''; };
/* =====================================================================
   ÍCONES
   ===================================================================== */
const ICP = {
  home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  ball: '<circle cx="12" cy="12" r="9"/><path d="M5.5 5.5c3.5 3 3.5 10 0 13M18.5 5.5c-3.5 3-3.5 10 0 13"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  wallet: '<rect x="3" y="6" width="18" height="14" rx="3"/><path d="M3 10h18M16 15h2"/>',
  grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="2"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="2"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="2"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="2"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14.9-3.5M4 4v4h4M4 13a8 8 0 0 0 14.9 3.5M20 20v-4h-4"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  robot: '<rect x="5" y="8" width="14" height="11" rx="3"/><path d="M12 4.5V8M9 13h.01M15 13h.01M9 16h6"/><circle cx="12" cy="3.5" r="1"/>',
  racket: '<ellipse cx="14.5" cy="9.5" rx="5.5" ry="6.5" transform="rotate(35 14.5 9.5)"/><path d="M10.5 14l-6 6M11 8.5l7 3.5M12.5 6l3 8"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  gem: '<path d="M6 4h12l3 5-9 11L3 9zM3 9h18"/>',
  chart: '<path d="M4 20V11M10 20V5M16 20v-7M2 20h20"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8"/>',
  chip: '<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/>',
  gear: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
  save: '<path d="M5 4h11l3 3v13H5zM8 4v5h7V4M8 20v-6h8v6"/>',
  pulse: '<path d="M3 12h4l2-6 4 12 2-6h6"/>',
  phone: '<rect x="7" y="2" width="10" height="20" rx="3"/><path d="M11 18.5h2"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>',
  check: '<path d="M5 12l5 5 9-10"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>',
  share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>', print: '<path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z"/>', coins: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
  vs: '<path d="M5 5l9 9M19 5l-9 9M15 15l4 4M9 15l-4 4"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>', target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'
};
const ic = (n, cls) => `<svg class="i ${cls || ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICP[n] || ''}</svg>`;
const attr = (label, v, txt, max) => `<div class="at"><div class="l"><span>${label}</span><b>${txt}</b></div><div class="bar"><i style="width:${clamp(v / (max || 100) * 100, 0, 100).toFixed(1)}%"></i></div></div>`;
const okIc = ok => ok == null ? '<span class="muted">—</span>' : ok ? `<span class="pos">${ic('check')}</span>` : `<span class="neg">${ic('x')}</span>`;
const SFC = { h: 'var(--h)', c: 'var(--c)', g: 'var(--g)' };
const sfTag = sf => `<span class="sf" style="--k:${SFC[sf] || 'var(--h)'}">${SURF_NAME[sf] || 'Piso duro'}</span>`;
const ini = n => String(n || '?').split(' ').filter(Boolean).map(x => x[0]).slice(0, 2).join('').toUpperCase();
/* cara do jogador: foto da ESPN (se houver) sobre a bandeira do país, num anel da cor da superfície */
function pav(m, s, sz) {
  const X = s === 'a' ? m.a : m.b, P = (PC.get(m.id) || {}).P, Pp = P ? (s === 'a' ? P.A : P.B) : null;
  const c2 = IOC2[String(X.ioc || '').toUpperCase()] || (String(X.ioc || '').length === 2 ? String(X.ioc).toUpperCase() : null);
  const fl = c2 ? `https://flagcdn.com/w160/${c2.toLowerCase()}.png` : (X.fl || '');
  const rk = X.rk || (Pp && Pp.rank) || 0, z = sz || 54;
  return `<span class="pav" style="--z:${z}px;--k:${SFC[m.sf] || 'var(--h)'}"><span class="in">${fl ? `<img class="fl" src="${esc(fl)}" alt="" loading="lazy" onerror="this.remove()">` : ''}<b>${esc(ini(X.n))}</b>${X.hs ? `<img class="hs" src="${esc(X.hs)}" alt="" loading="lazy" onerror="this.remove()">` : ''}</span>${rk ? `<i>#${rk}</i>` : ''}</span>`;
}
const unitsTxt = u => (u > 0 ? '+' : u < 0 ? '−' : '') + Math.abs(u).toFixed(2).replace('.', ',') + ' u';

%%FACE%%

/* =====================================================================
   ECRÃS
   ===================================================================== */
const VIEWS = ['inicio', 'jogos', 'analisar', 'contas', 'mais'];
let VIEW = (location.hash || '#inicio').slice(1); if (!VIEWS.includes(VIEW)) VIEW = 'inicio';
let DAY = 0, TOUR = 'all', SORT = LS.get('sort', 'hora'), BT = 'seg', GT = 'ana', ACCF = 'all', CT = 'contas';
function go(v) { VIEW = v; history.replaceState(null, '', '#' + v); render(); window.scrollTo(0, 0); }
function setUpd(t) { $('#upd').textContent = t; }
function renderTop() {
  $('#chips').innerHTML = ['tu', 'to', 'pi'].map(k => `<span class="chip" style="--k:${ACC[k].c}" onclick="ACCF='${k}';CT='contas';go('contas')">${ic(ACC[k].ic)}${eur(accStats(k).bal)}</span>`).join('');
  const last = LS.get('last', 0);
  setUpd(last ? 'Atualizado ' + new Date(last).toLocaleString('pt-PT', { weekday: 'short', hour: '2-digit', minute: '2-digit' }) + ' · toca em ↻ para ir à ESPN' : 'Toca em ↻ para o Vi ir buscar os jogos');
  const nOpen = BETS.filter(b => b.acc === 'tu' && b.st === 'open').length;
  document.querySelectorAll('#nav button').forEach(b => { b.classList.toggle('on', b.dataset.v === VIEW); const o = b.querySelector('.nb'); if (o) o.remove(); if (b.dataset.v === 'contas' && nOpen) b.insertAdjacentHTML('beforeend', `<span class="nb">${nOpen}</span>`); });
}
function render() {
  renderTop();
  const v = $('#view');
  if (!SEED) { v.innerHTML = `<div class="gl empty"><div class="face">${viFace('ok')}</div>A carregar o cérebro do Vi…</div>`; return; }
  v.innerHTML = VIEW === 'inicio' ? viewInicio() : VIEW === 'jogos' ? viewJogos() : VIEW === 'analisar' ? viewAnalisar() : VIEW === 'contas' ? viewContas() : viewMais();
  if (VIEW === 'jogos') ssSum();
}
const dayM = off => { const d = ymdAdd(today(), off); return Object.values(DB.m).filter(m => m.ed === d && (TOUR === 'all' || m.t === TOUR)).sort((a, b) => a.d < b.d ? -1 : 1); };

/* ---------- veredito ---------- */
function verdict(m) {
  const p = PREDS[m.id]; if (!p || m.s !== 'post' || !m.w) return null;
  const v = { p, win: (p.pA >= 0.5) === (m.w === 'a'), fav: p.pA >= 0.5 ? 'a' : 'b', conf: Math.max(p.pA, 1 - p.pA), egOk: null };
  if (!m.ret) v.games = gameTot(m);
  if (p.pk) { const o = outcome({ mk: p.pk.mk, sel: p.pk.sel, line: p.pk.line }, m); v.pk = p.pk; v.pkr = o; v.pku = o === 'won' ? p.pk.odd - 1 : o === 'lost' ? -1 : 0; }
  return v;
}
function dayVerdict(off) {
  const d = ymdAdd(today(), off), G = Object.values(DB.m).filter(m => m.ed === d && m.s === 'post');
  let n = 0, w = 0, bn = 0, bw = 0, u = 0; const bets = [];
  G.forEach(m => { const v = verdict(m); if (!v) return; n++; if (v.win) w++; if (v.pk && (v.pkr === 'won' || v.pkr === 'lost')) { bn++; if (v.pkr === 'won') bw++; u += v.pku; bets.push({ m, v }); } });
  const S = SLIPS[d]; return { n, w, bn, bw, u, bets, S, sr: S ? slipResult(S) : null, G };
}

/* ---------- INÍCIO ---------- */
function viewInicio() {
  const G0 = dayM(0), pre = G0.filter(m => m.s === 'pre'), live = G0.filter(m => m.s === 'in').length, Y = dayVerdict(-1), S0 = SLIPS[today()];
  const tours = [...new Set(G0.map(m => m.ev))];
  if (!Object.keys(DB.m).length) return installBanner() + `<div class="gl empty"><div class="face">${viFace('win')}</div><div class="h3" style="justify-content:center">Olá! Sou o Mister Vi.</div><div class="muted small" style="margin:6px 0 16px">Conheço ${(Object.keys(SEED.tours.atp.p).length + Object.keys(SEED.tours.wta.p).length).toLocaleString('pt-PT')} jogadores do ATP e da WTA (com Challenger e ITF). Estudo o Elo de cada um em cada superfície, o serviço e a resposta, e calculo vencedor, handicap e total de jogos.<br><br>A 1.ª vez demora 1-2 minutos: ponho a época em dia (junho até hoje).</div><button class="btn or" onclick="refresh()">${ic('refresh')} Ir buscar os jogos</button></div>`;
  let h = `<div class="gl hero"><div class="lbl">Hoje no ténis</div><div class="big">${G0.length} jogo${G0.length === 1 ? '' : 's'}</div>
    <div class="sub">${live ? live + ' a decorrer agora · ' : ''}${tours.slice(0, 3).map(esc).join(' · ') || 'Sem torneios hoje'}</div>
    <div class="face">${viFace(Y.bn && Y.u < 0 ? 'sad' : 'win')}</div>
    <div class="kpis"><div class="kpi"><small>Ontem · vencedores</small><b>${Y.n ? Y.w + '/' + Y.n : '—'}</b></div><div class="kpi"><small>Ontem · apostas</small><b class="${Y.u > 0 ? 'pos' : Y.u < 0 ? 'neg' : ''}">${Y.bn ? Y.bw + '/' + Y.bn : '—'}</b></div><div class="kpi"><small>Ontem · seguro</small><b>${Y.sr ? (Y.sr.st === 'won' ? '<span class="pos">✓</span>' : Y.sr.st === 'lost' ? '<span class="neg">✗</span>' : '…') : '—'}</b></div></div></div>`;
  h += installBanner();
  h += `<div class="gl hot"><div class="h3">${ic('check')} Veredito de ontem<span class="r">${Y.G.length} jogos</span></div>`;
  if (!Y.n) h += `<div class="small muted">${Y.G.length ? 'Sem previsões guardadas para ontem (o Vi guarda quando tocas em ↻ antes dos jogos).' : 'Ontem não houve jogos.'}</div>`;
  else {
    h += attr('Acertou no vencedor', Y.w / Y.n * 100, `${Y.w} de ${Y.n}`);
    if (Y.S) h += `<div class="h3" style="margin-top:12px">${ic('shield')} Boletim seguro<span class="r">${Y.sr.st === 'won' ? '<b class="pos">ganhou</b>' : Y.sr.st === 'lost' ? '<b class="neg">perdeu</b>' : 'em curso'}</span></div>` + Y.S.legs.map(l => `<div class="why"><span>${okIc(l.r == null ? null : l.r !== 'lost')} ${esc(l.lb)}</span><b class="muted">${pct(l.p)}</b></div>`).join('');
    if (Y.bets.length) h += `<div class="h3" style="margin-top:12px">${ic('gem')} Apostas do Vi<span class="r">${Y.bw}/${Y.bn} · <b class="${Y.u >= 0 ? 'pos' : 'neg'}">${unitsTxt(Y.u)}</b></span></div>` + Y.bets.map(({ m, v }) => `<div class="why"><span>${okIc(v.pkr === 'won')} ${esc(v.pk.lb)}</span><b class="${v.pku >= 0 ? 'pos' : 'neg'}">${unitsTxt(v.pku)}</b></div>`).join('');
  }
  h += `<button class="btn full" style="margin-top:10px" onclick="DAY=-1;go('jogos')">${ic('list')} Ver os jogos de ontem</button></div>`;
  if (pre.length) {
    const top = pre.map(m => ({ m, P: predict(m) })).sort((a, b) => b.P.conf - a.P.conf).slice(0, 3);
    h += `<div class="gl"><div class="h3">${ic('target')} O Vi guardou para hoje</div>`;
    if (S0) h += `<div class="h3" style="font-size:.9rem;margin-top:6px">${ic('shield')} Boletim seguro<span class="r">Vi ${pct(S0.p)} · @ ${S0.odd.toFixed(2)}</span></div>` + S0.legs.map(l => `<div class="why"><span>${esc(l.lb)} <span class="muted small">${esc(l.gl)}</span></span><b>${pct(l.p)}</b></div>`).join('');
    h += `<div class="h3" style="font-size:.9rem;margin-top:10px">${ic('star')} Favoritos mais claros</div>` + top.map(({ m, P }) => `<div class="why" onclick="GT='ana';openMatch('${m.id}')"><span>${esc(pName(m, P.fav))} <span class="muted small">vs ${esc(shortName(pName(m, P.fav === 'a' ? 'b' : 'a')))} · ${hhmm(m.d)}</span></span><b>${pct(P.conf)} · justa ${odd2(1 / P.conf)}</b></div>`).join('');
    h += `<button class="btn or full" style="margin-top:12px" onclick="DAY=0;go('jogos')">${ic('ball')} Abrir os jogos de hoje</button></div>`;
  }
  h += botHome();
  const ST = statsAll();
  h += `<div class="gl"><div class="h3">${ic('chart')} Como vai o Vi<span class="r">${ST.n} jogos</span></div>` + (ST.n ? attr('Vencedor certo', ST.win / ST.n * 100, pct(ST.win / ST.n)) + attr('Previsto vs real (jogos)', 50, ST.gn ? `${(ST.gp / ST.gn).toFixed(1).replace('.', ',')} vs ${(ST.ga / ST.gn).toFixed(1).replace('.', ',')}` : '—') : '<div class="small muted">Enche-se sozinho: toca em ↻ todos os dias antes dos jogos.</div>') + `<button class="btn full" style="margin-top:6px" onclick="openStats()">${ic('chart')} Estatísticas completas</button></div>`;
  return h;
}

/* ---------- JOGOS ---------- */
function viewJogos() {
  let G = dayM(DAY);
  const pre = G.filter(m => m.s === 'pre');
  let h = `<div class="pills" style="margin-top:12px">${['Ontem', 'Hoje', 'Amanhã'].map((t, i) => `<button class="pill ${DAY === i - 1 ? 'on' : ''}" onclick="DAY=${i - 1};render()">${t}</button>`).join('')}<span style="width:8px"></span>${[['all', 'Todos'], ['atp', 'ATP'], ['wta', 'WTA']].map(([k, t]) => `<button class="pill ${TOUR === k ? 'on' : ''}" onclick="TOUR='${k}';render()">${t}</button>`).join('')}</div>`;
  if (DAY >= 0 && pre.length) h += boletimPanel(DAY);
  else if (G.some(m => m.s === 'post')) h += pastPanel(DAY);
  if (!G.length) return h + `<div class="gl small muted">${Object.keys(DB.m).length ? 'Não há jogos neste dia.' : 'Toca em ↻ para o Vi ir buscar os jogos.'}</div>`;
  h += `<div class="row" style="margin-top:16px"><div class="pills" style="flex:1">${[['hora', 'Hora'], ['conf', 'Confiança'], ['tour', 'Torneio']].map(([k, t]) => `<button class="pill ${SORT === k ? 'on' : ''}" onclick="SORT='${k}';LS.set('sort','${k}');render()">${t}</button>`).join('')}</div><button class="btn sm" onclick="openHelp()">${ic('info')}</button></div>`;
  if (SORT === 'conf') G = G.map(m => ({ m, c: m.s === 'pre' ? predict(m).conf : PREDS[m.id] ? Math.max(PREDS[m.id].pA, 1 - PREDS[m.id].pA) : 0 })).sort((a, b) => b.c - a.c).map(x => x.m);
  if (SORT === 'tour') {
    const by = {}; G.forEach(m => (by[m.t + '|' + m.ev] = by[m.t + '|' + m.ev] || []).push(m));
    Object.entries(by).forEach(([k, L]) => { h += `<div class="tour"><span class="tag" style="--k:${L[0].t === 'atp' ? 'var(--h)' : '#f472b6'}">${L[0].t.toUpperCase()}</span>${esc(L[0].ev)}<span class="r">${sfTag(L[0].sf)}</span></div>` + L.map(matchCard).join(''); });
  } else h += G.map(matchCard).join('');
  return h;
}
function matchCard(m) {
  const P = predict(m), A = P.A, B = P.B;
  let mid, head = `<span class="tag" style="--k:${m.t === 'atp' ? 'var(--h)' : '#f472b6'}">${m.t.toUpperCase()}</span> ${esc(m.ev)}${m.rd ? ' · ' + esc(m.rd) : ''}`;
  const setsW = m.sets.filter(x => x[0] > x[1]).length, setsL = m.sets.filter(x => x[1] > x[0]).length;
  if (m.s === 'pre') mid = `<div class="capw"><div class="cap">${hhmm(m.d)}<small>${dayLbl(m.d)}</small></div></div>`;
  else if (m.s === 'in') mid = `<div class="capw"><div class="cap">${setsW} : ${setsL}<small class="live">ao vivo</small></div></div>`;
  else if (m.s === 'off') mid = `<div class="capw"><div class="cap">—<small>adiado</small></div></div>`;
  else mid = `<div class="capw"><div class="cap">${setsW} : ${setsL}<small>${m.ret ? 'desistência' : 'final'}</small></div></div>`;
  const pl = (s, Pp) => `<div class="pl">${pav(m, s, 52)}<div class="nm">${esc(pName(m, s))}</div><div class="rk">${(s === 'a' ? m.a : m.b).ioc ? flag((s === 'a' ? m.a : m.b).ioc) + esc((s === 'a' ? m.a : m.b).ioc) + ' · ' : ''}${Pp.rank ? '#' + Pp.rank : 'Elo ' + Math.round(Pp.e)}</div></div>`;
  let body = '';
  if (m.sets.length) {
    const n = Math.max(m.sets.length, m.bo === 5 ? 3 : 2);
    body = `<div class="sets"><div class="srow hd2"><span class="n"></span>${Array.from({ length: n }, (_, i) => `<i>${i + 1}</i>`).join('')}</div>` + ['a', 'b'].map(s => `<div class="srow"><span class="n">${esc(shortName(pName(m, s)))}${m.w === s ? ' ' + ic('check') : ''}</span>${Array.from({ length: n }, (_, i) => { const x = m.sets[i]; if (!x) return '<i></i>'; const v = s === 'a' ? x[0] : x[1], o = s === 'a' ? x[1] : x[0]; return `<i class="${v > o ? 'w' : ''}">${v}</i>`; }).join('')}</div>`).join('') + '</div>';
  }
  let say;
  const v = m.s === 'post' ? verdict(m) : null;
  if (v) say = `${okIc(v.win)} O Vi dava ${esc(shortName(pName(m, v.fav)))} (${pct(v.conf)})${v.pk ? ` · aposta ${v.pkr === 'won' ? '<b class="pos">ganhou</b>' : v.pkr === 'lost' ? '<b class="neg">perdeu</b>' : 'devolvida'}` : ''}${v.games != null ? ` · ${v.games} jogos (previa ${Math.round(v.p.eg)})` : ''}`;
  else if (m.s === 'post') say = '<span class="muted">Sem previsão guardada antes do jogo.</span>';
  else say = `<b>Vi:</b> ${esc(shortName(pName(m, P.fav)))} ganha ${pct(P.conf)} · odd justa ${odd2(1 / P.conf)} · ~${Math.round(P.eg)} jogos`;
  const tags = [];
  if (P.conf >= 0.8 && m.s === 'pre') tags.push(`<span class="tag" style="--k:var(--ball)">forte</span>`);
  if (A.nov || B.nov) tags.push(`<span class="tag" title="jogador novo: Elo pelo ranking">novo</span>`);
  if (m.o) tags.push(`<span class="tag" style="--k:var(--or2)">${odd2(m.o.a)} / ${odd2(m.o.b)}</span>`);
  return `<div class="gl mc" onclick="GT='ana';openMatch('${m.id}')"><div class="hd">${head}<span class="r">${sfTag(m.sf)}</span></div>
   <div class="vsr">${pl('a', A)}${mid}${pl('b', B)}</div>${body}
   <div class="pbar"><i style="width:${(P.pA * 100).toFixed(1)}%;background:linear-gradient(90deg,#e0560c,#ffb15c)"></i><i style="flex:1;background:rgba(255,255,255,.22)"></i></div>
   <div class="say">${say}</div>${tags.length ? `<div class="row w" style="margin-top:6px">${tags.join('')}</div>` : ''}</div>`;
}

/* ---------- BOLETIM ---------- */
let SS = { k: '', C: [], sel: new Set(), odd: {}, stake: 1 };
const legKey = c => c.m.id + '|' + c.mk + '|' + c.sel + '|' + c.line;
function boletimPanel(off) {
  const d = ymdAdd(today(), off), C = safeCands(d), auto = safeAuto(C), k = d;
  if (SS.k !== k) SS = { k, C, sel: new Set(C.filter((_, i) => auto.has(i)).map(legKey)), odd: {}, stake: Math.max(CFG.min, 1) };
  SS.C = C; SS.auto = new Set(C.filter((_, i) => auto.has(i)).map(legKey));
  const pre = Object.values(DB.m).filter(m => m.ed === d && m.s === 'pre');
  const fav = pre.map(m => ({ m, P: predict(m) })).filter(x => x.P.conf >= 0.7).sort((a, b) => b.P.conf - a.P.conf).slice(0, 10);
  const val = pre.map(m => ({ m, P: predict(m) })).filter(x => x.P.value).sort((a, b) => b.P.value.ev - a.P.value.ev);
  let h = `<div class="gl hot"><div class="h3">${ic('target')} Boletim ${off ? 'de amanhã' : 'de hoje'}<span class="r">só jogos ${off ? 'de amanhã' : 'de hoje'}</span></div>
   <div class="seg"><button class="${BT === 'seg' ? 'on' : ''}" onclick="BT='seg';render()">${ic('shield')} Seguro</button><button class="${BT === 'fav' ? 'on' : ''}" onclick="BT='fav';render()">${ic('star')} Favoritos</button><button class="${BT === 'val' ? 'on' : ''}" onclick="BT='val';render()">${ic('gem')} Valor</button></div>`;
  if (BT === 'seg') {
    if (!C.length) h += `<div class="small muted" style="margin-top:10px">Nenhuma seleção chega aos ${pct(SAFE_LEG)}.</div>`;
    else h += `<div class="small muted" style="margin:10px 0 2px">Seleções com ${pct(SAFE_LEG)}+, juntas enquanto o boletim passa dos ${pct(SAFE_SLIP)}. As odds em cinzento são só estimativa: para registar, mete a da Betano em cada uma.</div>` +
      C.map((c, i) => { const key = legKey(c), od = SS.odd[key] != null ? SS.odd[key] : c.odd; return `<div class="leg"><input type="checkbox" ${SS.sel.has(key) ? 'checked' : ''} onchange="ssTog(${i},this.checked)"><div><div class="t">${esc(c.lb)}</div><div class="g">${dayLbl(c.m.d)} · ${hhmm(c.m.d)} · ${esc(mLabel(c.m))} · ${esc(mkName(c.mk))}</div><div class="p">Vi ${pct(c.p)}</div></div><input class="od${SS.odd[key] == null ? ' est' : ''}" inputmode="decimal" value="${ln(od)}" oninput="ssOdd(${i},this)"></div>`; }).join('') + `<div class="sum" id="ssSum"></div>`;
  } else if (BT === 'fav') {
    h += fav.length ? `<div class="small muted" style="margin:10px 0 2px">Os favoritos mais claros do Vi. Compara a <b>odd justa</b> com a da Betano: se a Betano pagar mais, há valor.</div>` + fav.map(({ m, P }) => `<div class="why" onclick="GT='ana';openMatch('${m.id}')"><span><b style="color:#fff">${esc(pName(m, P.fav))}</b><div class="small muted">vs ${esc(pName(m, P.fav === 'a' ? 'b' : 'a'))} · ${hhmm(m.d)} · ${esc(m.ev)}</div></span><b>${pct(P.conf)}<div class="small" style="color:var(--or2)">justa ${odd2(1 / P.conf)}</div></b></div>`).join('') : `<div class="small muted" style="margin-top:10px">Sem favoritos claros (70%+).</div>`;
  } else {
    h += val.length ? val.map(({ m, P }) => `<div class="why"><span>${esc(selLabel(m, P.value.mk, P.value.sel, P.value.line))}<div class="small muted">${esc(mLabel(m))} · Vi ${pct(P.value.p)}</div></span><b>@ ${odd2(P.value.odd)} <span class="pos small">${sPct(P.value.ev)}</span></b></div>`).join('')
      : `<div class="small" style="margin-top:10px">A ESPN quase nunca dá odds de ténis, por isso o «valor» faz-se contigo: abre um jogo, mete a odd da Betano e o Vi diz se paga acima do justo.</div>`;
  }
  return h + '</div>';
}
function ssTog(i, on) { const k = legKey(SS.C[i]); if (on) SS.sel.add(k); else SS.sel.delete(k); ssSum(); }
function ssOdd(i, el) { SS.odd[legKey(SS.C[i])] = num(el.value); el.classList.remove('est'); ssSum(); }
const ssLegs = () => SS.C.filter(c => SS.sel.has(legKey(c))).map(c => ({ c, odd: SS.odd[legKey(c)] != null ? SS.odd[legKey(c)] : c.odd }));
function ssSum() {
  const el = $('#ssSum'); if (!el) return;
  const L = ssLegs(); if (!L.length) { el.innerHTML = '<span class="muted">Escolhe pelo menos uma seleção.</span>'; return; }
  const P = L.reduce((a, x) => a * x.c.p, 1), O = L.reduce((a, x) => a * (x.odd > 1 ? x.odd : 1), 1);
  el.innerHTML = `<div class="row"><span>${L.length} seleç${L.length === 1 ? 'ão' : 'ões'} · Vi dá <b class="pos">${pct(P)}</b></span><b style="margin-left:auto;font-size:1.2rem">@ ${O.toFixed(2)}</b></div>
   <label class="f">Valor (€)</label><input class="in" id="ssStake" inputmode="decimal" value="${ln(SS.stake)}" oninput="SS.stake=num(this.value)">
   <div class="row" style="margin-top:10px"><button class="btn or full" onclick="placeSlip()">${ic('check')} Registar múltipla</button><button class="btn" onclick="shareSlip()">${ic('share')}</button></div>`;
}
function placeSlip() {
  const L = ssLegs(), stake = num(($('#ssStake') || {}).value);
  if (!L.length) return toast('Escolhe as seleções'); if (L.some(x => !(SS.odd[legKey(x.c)] > 1))) return toast('Mete a odd da Betano em todas as seleções (as cinzentas são só estimativa)');
  if (L.some(x => !canBet(x.c.m))) return toast('Um dos jogos já começou');
  if (!(stake >= CFG.min)) return toast('A aposta mínima é ' + eur(CFG.min)); if (stake > accStats('tu').bal) return toast('Sem saldo');
  const duel = 'd' + Date.now().toString(36);
  newMulti('tu', L.map(x => safeLeg(x.c, x.odd)), stake, { duel, src: 'seguro', p: r2(L.reduce((a, x) => a * x.c.p, 1)) });
  let mine = SS.C.filter(c => SS.auto.has(legKey(c))), same = mine.length === L.length && L.every(x => SS.auto.has(legKey(x.c)));
  const ts = Math.min(stake, accStats('to').bal); let msg, mood = 'win';
  const mineReal = mine.every(c => SS.odd[legKey(c)] > 1); if (!mineReal) { mine = L.map(x => x.c); same = true; }   // sem odds reais nas dele, vai no teu (que tem)
  if (mine.length && ts >= CFG.min) { newMulti('to', mine.map(c => safeLeg(c, SS.odd[legKey(c)])), ts, { duel, src: 'seguro', p: r2(mine.reduce((a, c) => a * c.p, 1)) }); msg = same ? 'É o meu boletim. Vou contigo!' : `Eu fico com o meu: <b>${mine.map(c => esc(c.lb)).join(' + ')}</b>.`; }
  else { BETS.push({ id: 'vp' + Date.now().toString(36), acc: 'to', g: L[0].c.m.id, gl: '', gd: L[0].c.m.d, mk: 'pass', stake: 0, odd: 0, t: Date.now(), st: 'pass', ret: 0, lb: 'Passou', duel }); msg = 'Sem saldo… passo.'; mood = 'sad'; }
  saveBets();
  openSheet('Duelo marcado', `<div class="opinion"><div class="face">${viFace(mood)}</div><div>${msg}</div></div><div class="row" style="margin-top:14px"><button class="btn full" onclick="closeSheet();render()">Fechar</button><button class="btn or full" onclick="closeSheet();CT='duelo';go('contas')">Ver duelo</button></div>`, true);
  render();
}
function shareSlip() { const L = ssLegs(); if (!L.length) return; shareText(`🎾 Boletim seguro do Mister Vi\n` + L.map((x, i) => `${i + 1}) ${x.c.lb} @ ${odd2(x.odd)} (${mLabel(x.c.m)})`).join('\n') + `\nOdd total ${L.reduce((a, x) => a * x.odd, 1).toFixed(2)} · o Vi dá ${pct(L.reduce((a, x) => a * x.c.p, 1))}\n(simulação)`); }
async function shareText(txt) { try { if (navigator.share) { await navigator.share({ text: txt }); return; } } catch (e) { if (e && e.name === 'AbortError') return; } try { await navigator.clipboard.writeText(txt); toast('Copiado!'); } catch (e) { window.open('https://wa.me/?text=' + encodeURIComponent(txt), '_blank'); } }
function pastPanel(off) {
  const Y = dayVerdict(off);
  let h = `<div class="gl hot"><div class="h3">${ic('check')} Veredito do dia<span class="r">${Y.n ? 'vencedor ' + Y.w + '/' + Y.n : ''}</span></div>`;
  if (!Y.n && !Y.S) return h + '<div class="small muted">Sem previsões guardadas para este dia.</div></div>';
  if (Y.n) h += attr('Acertou no vencedor', Y.w / Y.n * 100, `${Y.w} de ${Y.n} (${pct(Y.w / Y.n)})`);
  if (Y.S) h += `<div class="h3" style="margin-top:10px">${ic('shield')} Boletim seguro<span class="r">${Y.sr.w}/${Y.sr.n} · ${Y.sr.st === 'won' ? '<b class="pos">ganhou</b>' : Y.sr.st === 'lost' ? '<b class="neg">perdeu</b>' : 'em curso'}</span></div>` + Y.S.legs.map(l => `<div class="why"><span>${okIc(l.r == null ? null : l.r !== 'lost')} ${esc(l.lb)} <span class="muted small">${esc(l.gl)}</span></span><b class="muted">${pct(l.p)}</b></div>`).join('');
  return h + '</div>';
}

/* ---------- FOLHA ---------- */
function openSheet(title, html, short) { const b = $('#sheetBox'); b.className = 'box' + (short ? ' short' : ''); b.innerHTML = `<div class="grab"></div><div class="sh"><h3>${title}</h3><button class="x" onclick="closeSheet()">${ic('x')}</button></div>${html}`; $('#sheet').classList.add('on'); b.scrollTop = 0; }
function closeSheet() { $('#sheet').classList.remove('on'); }
function askConfirm(msg, ok, fn) { openSheet('Confirmar', `<p>${msg}</p><div class="row"><button class="btn full" onclick="closeSheet()">Cancelar</button><button class="btn or full" onclick="${fn}">${ok}</button></div>`, true); }

/* ---------- FICHA DO JOGO ---------- */
function openMatch(id) {
  const m = mOf(id); if (!m) return;
  const P = predict(m);
  const setsW = m.sets.filter(x => x[0] > x[1]).length, setsL = m.sets.filter(x => x[1] > x[0]).length;
  let h = `<div class="gl" style="margin-top:8px"><div class="hd small muted" style="display:flex;gap:6px;align-items:center">${esc(m.ev)}${m.rd ? ' · ' + esc(m.rd) : ''}<span style="margin-left:auto">${sfTag(m.sf)}</span></div>
   <div class="vsr" style="margin-top:10px"><div class="pl">${pav(m, 'a', 66)}<div class="nm">${esc(m.a.n)}</div></div>
   <div class="capw"><div class="cap">${m.s === 'pre' ? pct(P.pA) + ' · ' + pct(1 - P.pA) : setsW + ' : ' + setsL}<small>${m.s === 'pre' ? 'Vi · ' + dayLbl(m.d) + ' ' + hhmm(m.d) : m.s === 'in' ? 'ao vivo' : 'final'}</small></div></div>
   <div class="pl">${pav(m, 'b', 66)}<div class="nm">${esc(m.b.n)}</div></div></div>
   ${m.sets.length ? `<div class="small" style="text-align:center;margin-top:8px">${m.sets.map(x => x[0] + '-' + x[1]).join(' · ')}</div>` : ''}</div>
   <div class="pills">${[['ana', 'Análise'], ['jog', 'Jogos e sets'], ['pl', 'Jogadores'], ['odd', 'Odds da Betano']].map(([k, t]) => `<button class="pill ${GT === k ? 'on' : ''}" onclick="GT='${k}';openMatch('${id}')">${t}</button>`).join('')}</div>`;
  if (GT === 'ana') h += tabAna(m, P); else if (GT === 'jog') h += tabJog(m, P); else if (GT === 'pl') h += tabPl(m, P); else h += tabOdd(m, P);
  const mine = BETS.filter(b => b.st !== 'pass' && (b.g === m.id || (b.legs && b.legs.some(l => l.g === m.id))));
  if (mine.length) h += `<div class="h2">${ic('list')} Apostas neste jogo</div><div class="gl">${mine.map(betRow).join('')}</div>`;
  if (m.s === 'pre' && new Date(m.d).getTime() > Date.now() - (m.man ? 1e12 : 0)) h += `<button class="btn or full" style="margin-top:6px" onclick="openBet('${m.id}')">${ic('target')} Apostar neste jogo</button>`;
  if (m.man && m.s === 'pre') h += `<button class="btn full" style="margin-top:8px" onclick="openManResult('${m.id}')">${ic('check')} Meter o resultado (jogo manual)</button>`;
  openSheet(esc(shortName(m.a.n)) + ' <span class="muted">vs</span> ' + esc(shortName(m.b.n)), h);
}
function tabAna(m, P) {
  const d = P.ra - P.rb;
  let h = `<div class="gl">` + attr(esc(m.a.n), P.pA * 100, pct(P.pA)) + attr(esc(m.b.n), (1 - P.pA) * 100, pct(1 - P.pA)) +
    `<div class="why"><span>Odd justa</span><b>${odd2(1 / P.pA)} · ${odd2(1 / (1 - P.pA))}</b></div><div class="why"><span>Jogos esperados</span><b>~${P.eg.toFixed(1).replace('.', ',')}</b></div></div>`;
  h += `<div class="h2">${ic('chip')} Porque pensa assim</div><div class="gl">
    <div class="why"><span>Elo geral</span><b>${Math.round(P.A.e)} · ${Math.round(P.B.e)}</b></div>
    <div class="why"><span>Elo em ${SURF_NAME[P.sf].toLowerCase()}</span><b>${Math.round(P.A.es[P.sf])} · ${Math.round(P.B.es[P.sf])}</b></div>
    <div class="why"><span>Diferença usada (70% geral + 30% superfície)</span><b>${d >= 0 ? '+' : '−'}${Math.abs(Math.round(d))} para ${esc(shortName(d >= 0 ? m.a.n : m.b.n))}</b></div>
    <div class="why"><span>Formato</span><b>melhor de ${m.bo}</b></div>
    ${P.pNV != null ? `<div class="why"><span>Odd da casa sem margem (peso ${pct(P.W)})</span><b>${pct(P.pNV)} · ${pct(1 - P.pNV)}</b></div><div class="why"><span>Só o modelo do Vi</span><b>${pct(P.pElo)}</b></div>` : ''}
    ${P.A.nov || P.B.nov ? `<div class="small muted" style="margin-top:6px">Jogador novo para o Vi: o Elo inicial vem do ranking. A previsão fica mais certa com os jogos.</div>` : ''}
    ${fxBlock(m, P)}
    <div class="small muted" style="margin-top:8px">Superfície errada? <a href="#" onclick="event.preventDefault();cycleSurf('${m.id}')" style="color:var(--or2)">Mudar superfície</a></div></div>`;
  return h;
}
function fxBlock(m, P) {
  const F = P.fx && P.fx.list; if (!F || !F.length) return '';
  const fmt = (x, v) => x.id === 'sv' ? (v >= 0 ? '+' : '−') + Math.abs(v * 100).toFixed(1).replace('.', ',') + ' pts' : x.id === 'age' ? (v ? v + ' anos' : '—') : (v ? 'sim' : 'não');
  // efeito em pontos percentuais para o jogador A (a partir da probabilidade sem esse fator)
  const pp = x => { const z = Math.log(P.pElo / (1 - P.pElo)); const q0 = 1 / (1 + Math.exp(-(z - x.v))); return (P.pElo - q0) * 100; };
  const rows = F.map(x => { const e = pp(x), who = e >= 0 ? m.a.n : m.b.n; return `<div class="why"><span>${x.nm}<br><small class="muted">${esc(shortName(m.a.n))} ${fmt(x, x.a)} · ${esc(shortName(m.b.n))} ${fmt(x, x.b)}</small></span><b>${Math.abs(e) < 0.5 ? 'neutro' : '+' + Math.abs(e).toFixed(1).replace('.', ',') + ' pp ' + esc(shortName(who))}</b></div>`; }).join('');
  return `<div class="h2" style="margin-top:12px">${ic('chart')} Outros fatores (testados às cegas)</div>${rows}
    <div class="small muted" style="margin-top:6px">Também testados e postos de parte por não acertarem melhor: confronto direto (H2H), forma recente, superfície além do Elo, canhoto e altura.</div>`;
}
function cycleSurf(id) { const m = mOf(id); m.sf = { h: 'c', c: 'g', g: 'h' }[m.sf] || 'h'; m.sfMan = true; if (DB.m[id]) saveDB(); else LS.set('man', MAN); openMatch(id); render(); }
function tabJog(m, P) {
  const fav = P.fav, dog = fav === 'a' ? 'b' : 'a', L = gameLines(P);
  let h = `<div class="h2">${ic('chart')} Total de jogos</div><div class="gl"><table class="tbl"><tr><th>Linha</th><th>Mais</th><th>Justa</th><th>Menos</th><th>Justa</th></tr>` +
    L.tl.map(t => { const o = probs(P, 'tg', 'o', t), u = probs(P, 'tg', 'u', t); return `<tr class="tap" onclick="openBet('${m.id}','tg','o',${t})"><td>${ln(t)}</td><td>${pct(o.w)}</td><td>${odd2(fairOf(o))}</td><td>${pct(u.w)}</td><td>${odd2(fairOf(u))}</td></tr>`; }).join('') + `</table></div>`;
  h += `<div class="h2">${ic('vs')} Handicap de jogos</div><div class="gl"><table class="tbl"><tr><th>Aposta</th><th>Vi</th><th>Justa</th></tr>` +
    L.hl.map(x => { const a = probs(P, 'hg', fav, -x), b = probs(P, 'hg', dog, x); return `<tr class="tap" onclick="openBet('${m.id}','hg','${fav}',${-x})"><td>${esc(shortName(pName(m, fav)))} −${ln(x)}</td><td>${pct(a.w)}</td><td>${odd2(fairOf(a))}</td></tr><tr class="tap" onclick="openBet('${m.id}','hg','${dog}',${x})"><td>${esc(shortName(pName(m, dog)))} +${ln(x)}</td><td>${pct(b.w)}</td><td>${odd2(fairOf(b))}</td></tr>`; }).join('') + `</table></div>`;
  const s20a = probs(P, 's20', 'a'), s20b = probs(P, 's20', 'b'), ns = probs(P, 'ns', 'o');
  h += `<div class="h2">${ic('list')} Sets</div><div class="gl"><div class="why"><span>${esc(shortName(m.a.n))} ganha ${m.bo === 5 ? '3-0' : '2-0'}</span><b>${pct(s20a.w)} · justa ${odd2(fairOf(s20a))}</b></div><div class="why"><span>${esc(shortName(m.b.n))} ganha ${m.bo === 5 ? '3-0' : '2-0'}</span><b>${pct(s20b.w)} · justa ${odd2(fairOf(s20b))}</b></div><div class="why"><span>Vai a ${m.bo === 5 ? '5' : '3'} sets</span><b>${pct(ns.w)} · justa ${odd2(fairOf(ns))}</b></div></div>
   <div class="small muted">Toca numa linha para apostar. Modelo ponto a ponto com «dia bom / dia mau», testado em jogos reais de 2025-26 (total previsto 23,7 vs 23,4 real no ATP).</div>`;
  return h;
}
function tabPl(m, P) {
  const card = (s, X) => `<div class="gl"><div class="row">${pav(m, s, 50)}<div style="flex:1"><b>${esc(pName(m, s))}</b><div class="small muted">${flag((s === 'a' ? m.a : m.b).ioc || X.ioc)}${esc((s === 'a' ? m.a : m.b).ioc || X.ioc || '')}${X.rank ? ' · ranking #' + X.rank : ''}</div></div></div>
    <div style="margin-top:12px">${attr('Elo geral', clamp((X.e - 1300) / 12, 0, 100), Math.round(X.e))}${['h', 'c', 'g'].map(k => attr('Elo ' + SURF_NAME[k].toLowerCase() + ` <span class="muted small">(${X.ns[k]} j)</span>`, clamp((X.es[k] - 1300) / 12, 0, 100), Math.round(X.es[k]))).join('')}
    ${attr('Serviço (pontos ganhos vs média)', 50 + (X.sv || 0) * 500, ((X.sv || 0) >= 0 ? '+' : '−') + Math.abs((X.sv || 0) * 100).toFixed(1).replace('.', ',') + ' pts %')}${attr('Resposta (pontos ganhos vs média)', 50 + (X.rv || 0) * 500, ((X.rv || 0) >= 0 ? '+' : '−') + Math.abs((X.rv || 0) * 100).toFixed(1).replace('.', ',') + ' pts %')}</div>
    <div class="small muted">${X.n} jogos estudados${X.last ? ' · último ' + X.last.slice(6) + '/' + X.last.slice(4, 6) + '/' + X.last.slice(0, 4) : ''}</div></div>`;
  return card('a', P.A) + card('b', P.B);
}
function tabOdd(m, P) {
  const o = MAN[m.id] && MAN[m.id].o || m.o || {};
  return `<div class="gl"><div class="small" style="margin-bottom:6px">Mete as odds de vencedor da Betano: o Vi junta-as ao Elo (peso ${pct(CFG.mktW)}) e diz onde há valor.</div>
   <div class="row"><div style="flex:1"><label class="f">${esc(shortName(m.a.n))}</label><input class="in" id="oA" inputmode="decimal" value="${o.a ? ln(o.a) : ''}"></div><div style="flex:1"><label class="f">${esc(shortName(m.b.n))}</label><input class="in" id="oB" inputmode="decimal" value="${o.b ? ln(o.b) : ''}"></div></div>
   <button class="btn or full" style="margin-top:12px" onclick="saveOdds('${m.id}')">${ic('check')} Guardar e recalcular</button>
   ${o.a ? (() => { const pa = 1 / P.pElo, pb = 1 / (1 - P.pElo); const eA = P.pElo * o.a - 1, eB = (1 - P.pElo) * o.b - 1; return `<div class="why" style="margin-top:10px"><span>${esc(shortName(m.a.n))} @ ${odd2(o.a)} (Elo: justa ${odd2(pa)})</span><b class="${eA > 0 ? 'pos' : 'neg'}">${sPct(eA)}</b></div><div class="why"><span>${esc(shortName(m.b.n))} @ ${odd2(o.b)} (Elo: justa ${odd2(pb)})</span><b class="${eB > 0 ? 'pos' : 'neg'}">${sPct(eB)}</b></div><div class="small muted">Valor = só pelo Elo do Vi contra a odd da Betano. Positivo = a Betano paga acima do justo.</div>`; })() : ''}</div>`;
}
function saveOdds(id) {
  const a = num($('#oA').value), b = num($('#oB').value), m = mOf(id);
  if (!(a > 1 && b > 1)) return toast('Mete as duas odds');
  if (DB.m[id]) { DB.m[id].o = { a, b, p: 'Betano' }; saveDB(); } else { MAN[id].o = { a, b }; LS.set('man', MAN); }
  toast('Odds guardadas'); openMatch(id); render();
}

/* ---------- APOSTAR ---------- */
let BF = null;
function canBet(m) { return m && m.s === 'pre' && (m.man || new Date(m.d).getTime() > Date.now()); }
function openBet(id, mk, sel, line) {
  const m = mOf(id); if (!canBet(m)) return toast('Este jogo já começou — já não dá para apostar');
  const P = predict(m);
  BF = { id, mk: mk || 'ml', sel: sel || P.fav, line: line != null ? line : null, stake: Math.max(CFG.min, 1), odd: '' };
  if (BF.mk === 'ml') { const o = m.o || (MAN[id] && MAN[id].o) || {}; BF.odd = BF.sel === 'a' ? (o.a || '') : (o.b || ''); }
  drawBet();
}
function drawBet() {
  const m = mOf(BF.id);
  const segMk = [['ml', 'Vencedor'], ['hg', 'Handicap'], ['tg', 'Total']].map(([k, t]) => `<button class="${BF.mk === k ? 'on' : ''}" onclick="BF.mk='${k}';BF.sel='${k === 'tg' ? 'o' : BF.sel === 'o' || BF.sel === 'u' ? 'a' : BF.sel}';BF.line=${k === 'tg' ? 'Math.round(predict(mOf(BF.id)).eg)+0.5' : k === 'hg' ? "(BF.sel==='a'?-1:1)*2.5" : 'null'};BF.odd='';drawBet()">${t}</button>`).join('');
  const sels = BF.mk === 'tg' ? [['o', 'Mais'], ['u', 'Menos']] : [['a', shortName(m.a.n)], ['b', shortName(m.b.n)]];
  openSheet('A tua aposta', `<div class="small muted">${esc(mLabel(m))} · ${esc(m.ev)}</div>
   <label class="f">Mercado</label><div class="seg">${segMk}</div>
   <label class="f">Escolha</label><div class="seg">${sels.map(([k, t]) => `<button class="${BF.sel === k ? 'on' : ''}" onclick="BF.sel='${k}';drawBet()">${esc(t)}</button>`).join('')}</div>
   ${BF.mk !== 'ml' ? `<label class="f">${BF.mk === 'hg' ? 'Handicap (jogos) da tua escolha' : 'Linha de jogos'}</label><input class="in" id="bLine" inputmode="decimal" value="${BF.line == null ? '' : ln(BF.line)}" oninput="betOpinion()">` : ''}
   <div class="row"><div style="flex:1"><label class="f">Odd da Betano</label><input class="in" id="bOdd" inputmode="decimal" value="${BF.odd ? ln(BF.odd) : ''}" oninput="betOpinion()"></div><div style="flex:1"><label class="f">Valor (€)</label><input class="in" id="bStake" inputmode="decimal" value="${ln(BF.stake)}" oninput="betOpinion()"></div></div>
   <div class="opinion" id="bOp"></div>
   <button class="btn or full" style="margin-top:12px" id="bGo" onclick="placeBet()">${ic('check')} Registar a minha aposta</button>
   <div class="small muted" style="margin-top:6px">O Vi responde com a aposta dele no mesmo jogo e com o mesmo valor.</div>`, true);
  betOpinion();
}
function readBF() { BF.line = BF.mk === 'ml' ? null : num($('#bLine') && $('#bLine').value); BF.odd = num($('#bOdd').value); BF.stake = num($('#bStake').value); }
function betOpinion() {
  readBF();
  const m = mOf(BF.id), P = predict(m), box = $('#bOp');
  if (BF.mk !== 'ml' && BF.line == null) { box.className = 'opinion'; box.innerHTML = `<div class="face">${viFace('ok')}</div><div>Diz-me a linha.</div>`; return; }
  const q = probs(P, BF.mk, BF.sel, BF.line), fair = fairOf(q); let cls = 'opinion', mood = 'ok', msg;
  if (!(BF.odd > 1)) msg = `Para mim acontece ${pct(q.w)} das vezes${q.push > 0.005 ? ` (${pct(q.push)} devolvida)` : ''}. Odd justa: <b>${odd2(fair)}</b>.`;
  else { const ev = evOf(q, BF.odd); if (ev >= 0.05) { cls += ' good'; mood = 'win'; msg = `Boa! Dou-lhe ${pct(q.w)}. Com ${odd2(BF.odd)} tens <b>valor ${sPct(ev)}</b>.`; } else if (ev >= 0) msg = `Dou-lhe ${pct(q.w)}. Valor ${sPct(ev)}: justa.`; else { cls += ' bad'; mood = 'sad'; msg = `Hum… dou-lhe ${pct(q.w)} (justa ${odd2(fair)}). Com ${odd2(BF.odd)} perdes ${sPct(ev)} a longo prazo.`; } }
  box.className = cls; box.innerHTML = `<div class="face">${viFace(mood)}</div><div>${msg}</div>`;
  $('#bGo').disabled = !(BF.odd > 1 && BF.stake >= CFG.min && BF.stake <= accStats('tu').bal && (BF.mk === 'ml' || BF.line != null));
}
function placeBet() {
  readBF();
  if (!canBet(mOf(BF.id))) return toast('Este jogo já começou');
  const m = mOf(BF.id), P = predict(m), c = { mk: BF.mk, sel: BF.sel, line: BF.line, odd: BF.odd };
  const q = probs(P, c.mk, c.sel, c.line), ev = evOf(q, c.odd), duel = 'd' + Date.now().toString(36);
  newBet('tu', m, c, BF.stake, { p: r2(q.w), ev: r2(ev), duel });
  // o Vi: se a tua aposta tem valor para ele, acompanha; senão aposta no favorito dele com a odd justa −5% (se houver odd real usa-a)
  let tc = null; const o = m.o || (MAN[m.id] && MAN[m.id].o);
  if (ev > 0) tc = Object.assign({}, c, { p: q.w });
  else if (o && o.a > 1) { const s = P.pElo >= 0.5 ? 'a' : 'b', od = s === 'a' ? o.a : o.b, qq = probs(P, 'ml', s); if (qq.w * od - 1 > 0) tc = { mk: 'ml', sel: s, line: null, odd: od, p: qq.w }; }
  const stake = Math.min(BF.stake, accStats('to').bal); let msg, mood;
  if (tc && stake >= CFG.min) { newBet('to', m, tc, stake, { p: r2(tc.p), duel }); msg = tc.mk === c.mk && tc.sel === c.sel && tc.line === c.line ? 'Concordo contigo! Vou no mesmo.' : `Eu vou em <b>${esc(selLabel(m, tc.mk, tc.sel, tc.line))}</b> @ ${odd2(tc.odd)}.`; mood = 'win'; }
  else { BETS.push({ id: 'vp' + Date.now().toString(36), acc: 'to', g: m.id, gl: mLabel(m), gd: m.d, mk: 'pass', stake: 0, odd: 0, t: Date.now(), st: 'pass', ret: 0, lb: 'Passou', duel }); msg = 'Aqui não vejo valor. Passo — fico com o meu dinheiro.'; mood = 'sad'; }
  saveBets();
  openSheet('Duelo marcado', `<div class="opinion"><div class="face">${viFace(mood)}</div><div>${msg}</div></div><div class="row" style="margin-top:14px"><button class="btn full" onclick="closeSheet();render()">Fechar</button><button class="btn or full" onclick="closeSheet();CT='duelo';go('contas')">Ver duelo</button></div>`, true);
  render();
}
function voidBet(id) { const b = BETS.find(x => x.id === id); if (!b || b.st !== 'open') return; BETS.filter(x => x.duel && x.duel === b.duel && (x.st === 'open' || x.st === 'pass')).concat([b]).forEach(x => { x.st = 'void'; x.ret = x.stake; x.tset = Date.now(); }); saveBets(); closeSheet(); toast('Aposta anulada'); render(); }

/* ---------- ANALISAR (jogo à mão: Challenger, ITF, qualquer um) ---------- */
let AN = { tour: 'atp', a: '', b: '', sf: 'h', bo: 3 };
function allNames(tour) { const T = SEED.tours[tour].p; const s = new Set(Object.values(T).map(r => r[0])); Object.values(PU[tour]).forEach(p => s.add(p.nm)); return [...s]; }
function viewAnalisar() {
  const recent = Object.values(MAN).sort((a, b) => b.t - a.t).slice(0, 8);
  return `<div class="gl" style="margin-top:14px"><div class="h3">${ic('search')} Analisar um jogo</div><div class="small muted">Para jogos que a ESPN não mostra (Challenger, ITF, WTA 125): escreve os dois jogadores como aparecem na Betano.</div>
   <label class="f">Circuito</label><div class="seg">${[['atp', 'ATP / Challenger'], ['wta', 'WTA / ITF']].map(([k, t]) => `<button class="${AN.tour === k ? 'on' : ''}" onclick="AN.tour='${k}';render()">${t}</button>`).join('')}</div>
   ${['a', 'b'].map(s => `<label class="f">Jogador ${s === 'a' ? '1' : '2'}</label><div class="srch"><input class="in" id="an_${s}" value="${esc(AN[s])}" autocomplete="off" oninput="anSug('${s}',this.value)" placeholder="ex.: ${s === 'a' ? 'Ben Shelton' : 'Rafael Jodar'}"><div class="sug" id="sug_${s}" style="display:none"></div></div>`).join('')}
   <label class="f">Superfície</label><div class="seg">${['h', 'c', 'g'].map(k => `<button class="${AN.sf === k ? 'on' : ''}" onclick="AN.sf='${k}';AN.a=$('#an_a').value;AN.b=$('#an_b').value;render()">${SURF_NAME[k]}</button>`).join('')}</div>
   <label class="f">Formato</label><div class="seg">${[3, 5].map(k => `<button class="${AN.bo === k ? 'on' : ''}" onclick="AN.bo=${k};AN.a=$('#an_a').value;AN.b=$('#an_b').value;render()">Melhor de ${k}</button>`).join('')}</div>
   <button class="btn or full" style="margin-top:14px" onclick="anGo()">${ic('chip')} Analisar</button></div>
   ${recent.length ? `<div class="h2">${ic('clock')} Análises recentes</div><div class="gl">${recent.map(x => `<div class="why" onclick="GT='ana';openMatch('${x.m.id}')"><span>${esc(mLabel(x.m))} <span class="muted small">${SURF_NAME[x.m.sf]}</span></span><b>${x.m.s === 'post' ? (x.m.w === 'a' ? shortName(x.m.a.n) : shortName(x.m.b.n)) + ' ✓' : 'em aberto'}</b></div>`).join('')}</div>` : ''}`;
}
function anSug(s, v) {
  const box = $('#sug_' + s), k = normName(v); if (k.length < 2) { box.style.display = 'none'; return; }
  const T = SEED.tours[AN.tour].p, L = Object.entries(T).filter(([kk]) => kk.includes(k)).sort((x, y) => (x[1][11] || 9999) - (y[1][11] || 9999)).slice(0, 8);
  box.innerHTML = L.map(([kk, r]) => `<div onclick="$('#an_${s}').value='${esc(r[0]).replace(/'/g, "\\'")}';$('#sug_${s}').style.display='none'">${esc(r[0])} <small>${esc(r[1])}${r[11] ? ' · #' + r[11] : ''}</small></div>`).join('') || '<div><small>sem resultados — fica como jogador novo</small></div>';
  box.style.display = 'block';
}
function anGo() {
  AN.a = $('#an_a').value.trim(); AN.b = $('#an_b').value.trim();
  if (!AN.a || !AN.b) return toast('Escreve os dois jogadores');
  const id = 'man' + Date.now().toString(36), d = new Date(Date.now() + 3600e3).toISOString();
  const m = { id, man: true, t: AN.tour, ev: 'Análise manual', d, ed: today(), s: 'pre', det: '', rd: '', a: { n: AN.a, ioc: '', rk: 0 }, b: { n: AN.b, ioc: '', rk: 0 }, sets: [], w: null, ret: false, bo: AN.bo, sf: AN.sf };
  MAN[id] = { m, t: Date.now() }; LS.set('man', MAN);
  GT = 'ana'; openMatch(id); render();
}
function openManResult(id) {
  const m = mOf(id);
  openSheet('Resultado', `<div class="small muted">Escreve os sets como «6-4 3-6 7-5» (do ponto de vista de ${esc(m.a.n)}).</div><label class="f">Sets</label><input class="in" id="mr" placeholder="6-4 6-3"><label class="f">Desistência?</label><div class="seg"><button id="mrN" class="on" onclick="this.classList.add('on');$('#mrY').classList.remove('on')">Não</button><button id="mrY" onclick="this.classList.add('on');$('#mrN').classList.remove('on')">Sim</button></div><button class="btn or full" style="margin-top:12px" onclick="saveManResult('${id}')">Guardar</button>`, true);
}
function saveManResult(id) {
  const sets = ($('#mr').value.match(/(\d+)\s*-\s*(\d+)/g) || []).map(s => s.split('-').map(x => +x.trim()));
  if (!sets.length) return toast('Formato: 6-4 6-3');
  const m = MAN[id].m, wa = sets.filter(x => x[0] > x[1]).length, wb = sets.filter(x => x[1] > x[0]).length;
  m.sets = sets; m.s = 'post'; m.w = wa > wb ? 'a' : 'b'; m.ret = $('#mrY').classList.contains('on');
  LS.set('man', MAN); settleAll(); closeSheet(); toast('Resultado guardado'); render();
}

/* ---------- CONTAS + DUELO ---------- */
function stTag(b) { if (b.st === 'open') return '<span class="tag" style="--k:#60a5fa">em jogo</span>'; if (b.st === 'won') return `<span class="tag" style="--k:var(--pos)">ganhou ${sEur(b.ret - b.stake)}</span>`; if (b.st === 'lost') return `<span class="tag" style="--k:var(--neg)">perdeu ${sEur(-b.stake)}</span>`; return `<span class="tag">${b.st === 'push' ? 'devolvida' : b.st === 'void' ? 'anulada' : 'passou'}</span>`; }
function betRow(b) {
  const legs = b.legs ? `<div class="legs">${b.legs.map(l => `${l.r === 'won' ? '<span class="pos">✓</span>' : l.r === 'lost' ? '<span class="neg">✗</span>' : '•'} ${esc(l.lb)} @ ${odd2(l.odd)} <span class="muted">${esc(l.gl)}</span>`).join('<br>')}</div>` : '';
  return `<div class="bet"><div class="who" style="--k:${ACC[b.acc].c}">${ic(ACC[b.acc].ic)}</div><div class="m"><div class="t">${esc(b.lb)} <span class="muted">@ ${odd2(b.odd)}</span></div><div class="g">${b.legs ? 'Boletim' : esc(b.gl)} · ${dayLbl(b.gd)}${b.res ? ' · ' + esc(b.res) : ''}</div>${legs}<div style="margin-top:5px">${stTag(b)}${b.acc === 'tu' && b.st === 'open' ? ` <button class="btn sm" style="min-height:26px;padding:2px 10px" onclick="askConfirm('Anular esta aposta? O duelo do Vi também é anulado.','Anular',&quot;voidBet('${b.id}')&quot;)">anular</button>` : ''}</div></div><div class="v">${eur(b.stake)}<small>${b.st === 'open' ? 'pode dar ' + eur(b.stake * b.odd) : ''}</small></div></div>`;
}
function duels() { const by = {}; BETS.filter(b => b.duel).forEach(b => { (by[b.duel] = by[b.duel] || {})[b.acc] = b; }); return Object.values(by).filter(d => d.tu).sort((a, b) => b.tu.t - a.tu.t); }
const betPL = b => !b || b.st === 'open' || b.st === 'void' || b.st === 'pass' ? 0 : r2((b.ret || 0) - b.stake);
function viewContas() {
  let h = `<div class="seg" style="margin-top:14px"><button class="${CT === 'contas' ? 'on' : ''}" onclick="CT='contas';render()">${ic('wallet')} Contas</button><button class="${CT === 'duelo' ? 'on' : ''}" onclick="CT='duelo';render()">${ic('vs')} Duelo</button></div>`;
  if (CT === 'duelo') {
    const D = duels().filter(d => d.tu.st !== 'void'); let you = 0, him = 0, w = 0, l = 0, e = 0, open = 0;
    D.forEach(d => { if (d.tu.st === 'open' || (d.to && d.to.st === 'open')) { open++; return; } const a = betPL(d.tu), b = betPL(d.to); you += a; him += b; if (Math.abs(a - b) < 0.005) e++; else if (a > b) w++; else l++; });
    h += `<div class="gl hot"><div class="vs"><div><div class="avb me">${ic('star')}</div><b>Tu</b><div class="${you >= 0 ? 'pos' : 'neg'}" style="font-weight:700">${sEur(you)}</div></div><div class="mid">VS</div><div><div class="avb">${viFace(him > you ? 'win' : him < you ? 'sad' : 'ok')}</div><b>Mister Vi</b><div class="${him >= 0 ? 'pos' : 'neg'}" style="font-weight:700">${sEur(him)}</div></div></div><div class="small muted" style="text-align:center;margin-top:10px">Ganhaste ${w} · perdeste ${l} · empate ${e} · ${open} em jogo</div></div>`;
    if (!D.length) return h + `<div class="gl small muted">Abre um jogo, regista a tua aposta e o Vi responde com a dele.</div>`;
    return h + D.map(d => { const a = betPL(d.tu), b = betPL(d.to), closed = d.tu.st !== 'open' && (!d.to || d.to.st !== 'open'); const cell = (x, who, win) => `<div class="${closed && win ? 'win' : ''}"><div class="small muted">${who}</div>${x && x.st !== 'pass' ? `<b>${esc(x.lb)}</b><div class="small muted">@ ${odd2(x.odd)} · ${eur(x.stake)}</div><div style="margin-top:4px">${stTag(x)}</div>` : '<b class="muted">Passou</b>'}</div>`; return `<div class="gl"><b>${esc(d.tu.src === 'seguro' ? 'Boletim seguro' : d.tu.gl)}</b><div class="duel">${cell(d.tu, 'Tu', a > b)}${cell(d.to, 'Mister Vi', b > a)}</div></div>`; }).join('');
  }
  h += `<div class="accs" style="margin-top:12px">${['tu', 'to', 'pi'].map(k => { const s = accStats(k); return `<div class="acct ${ACCF === k ? 'on' : ''}" style="--k:${ACC[k].c}" onclick="ACCF=ACCF==='${k}'?'all':'${k}';render()">${ic(ACC[k].ic)}<div class="n">${ACC[k].n}</div><div class="v">${eur(s.bal)}</div><div class="small ${s.profit >= 0 ? 'pos' : 'neg'}">${sEur(s.profit)}</div></div>`; }).join('')}</div>`;
  if (ACCF !== 'all') { const s = accStats(ACCF), n = s.w + s.l; h += `<div class="gl">${attr('Taxa de acerto', n ? s.w / n * 100 : 0, n ? `${pct(s.w / n)} (${s.w}/${n})` : '—')}${attr('ROI', clamp(50 + s.roi * 100, 0, 100), sPct(s.roi))}${attr('Em jogo', s.start ? s.open / s.start * 100 : 0, eur(s.open))}</div>`; }
  if (ACCF === 'pi') h += botPanel(); else if (ACCF === 'all') h += botMini();
  h += `<div class="row w" style="margin-top:10px"><button class="btn sm" onclick="exportCSV()">${ic('download')} Exportar</button><button class="btn sm" onclick="printBets()">${ic('print')} Imprimir</button><button class="btn sm" onclick="openDeposit()">${ic('coins')} Recarregar</button></div>`;
  const L = BETS.filter(b => b.st !== 'pass' && (ACCF === 'all' || b.acc === ACCF)).sort((a, b) => b.t - a.t), open = L.filter(b => b.st === 'open'), done = L.filter(b => b.st !== 'open');
  h += `<div class="h2">${ic('clock')} Em jogo<span class="r">${open.length} · ${eur(open.reduce((s, b) => s + b.stake, 0))}</span></div>` + (open.length ? `<div class="gl hot">${open.map(betRow).join('')}</div>` : '<div class="gl small muted">Nada em jogo.</div>');
  h += `<div class="h2">${ic('list')} Histórico</div>` + (done.length ? `<div class="gl">${done.slice(0, 150).map(betRow).join('')}</div>` : '<div class="gl small muted">Ainda sem apostas fechadas.</div>');
  return h;
}
function openDeposit() { openSheet('Recarregar banca', `<label class="f">Conta</label><select class="in" id="dAcc"><option value="tu">Tu</option><option value="to">Mister Vi</option><option value="pi">Vi sozinho</option></select><label class="f">Valor (€)</label><input class="in" id="dVal" inputmode="decimal" value="50"><button class="btn or full" style="margin-top:12px" onclick="doDeposit()">Juntar</button>`, true); }
function doDeposit() { const v = num($('#dVal').value); if (!(v > 0)) return toast('Valor inválido'); DEPOS.push({ acc: $('#dAcc').value, v: r2(v), t: Date.now() }); LS.set('depos', DEPOS); closeSheet(); render(); }
const ST_TXT = { open: 'em jogo', won: 'ganhou', lost: 'perdeu', push: 'devolvida', void: 'anulada' };
function exportCSV() {
  const f = v => String(v == null ? '' : v).replace('.', ',');
  const rows = [['conta', 'registada', 'jogo', 'aposta', 'odd', 'valor', 'estado', 'retorno', 'lucro', 'prob_vi']];
  BETS.filter(b => b.st !== 'pass' && (ACCF === 'all' || b.acc === ACCF)).forEach(b => rows.push([ACC[b.acc].n, new Date(b.t).toLocaleString('pt-PT'), b.legs ? 'Boletim' : b.gl, b.legs ? b.legs.map(l => l.lb).join(' + ') : b.lb, f(b.odd), f(b.stake), ST_TXT[b.st] || b.st, b.st === 'open' ? '' : f(b.ret), b.st === 'open' ? '' : f(r2(b.ret - b.stake)), b.p != null ? f(b.p) : '']));
  const csv = '﻿' + rows.map(r => r.map(x => /[;"\n]/.test(String(x)) ? '"' + String(x).replace(/"/g, '""') + '"' : x).join(';')).join('\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); a.download = 'mister-vi-apostas-' + today() + '.csv'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}
function printBets() { const L = BETS.filter(b => b.st !== 'pass' && (ACCF === 'all' || b.acc === ACCF)); $('#print').innerHTML = `<h2>Mister Vi — ${ACCF === 'all' ? 'todas as contas' : ACC[ACCF].n}</h2><table><tr><th>Conta</th><th>Jogo</th><th>Aposta</th><th>Odd</th><th>Valor</th><th>Estado</th></tr>${L.map(b => `<tr><td>${ACC[b.acc].n}</td><td>${esc(b.legs ? 'Boletim' : b.gl)}</td><td>${esc(b.lb)}</td><td>${odd2(b.odd)}</td><td>${eur(b.stake)}</td><td>${ST_TXT[b.st] || b.st}</td></tr>`).join('')}</table>`; window.print(); }

/* ---------- MAIS ---------- */
function statsAll() {
  const R = { n: 0, win: 0, gn: 0, gp: 0, ga: 0, conf: {}, bn: 0, bw: 0, bu: 0, sf: {}, tour: {} };
  Object.values(DB.m).forEach(m => {
    const v = verdict(m); if (!v) return; R.n++; if (v.win) R.win++;
    if (v.games != null) { R.gn++; R.gp += v.p.eg; R.ga += v.games; }
    const b = v.conf < 0.6 ? '50-60' : v.conf < 0.7 ? '60-70' : v.conf < 0.8 ? '70-80' : '80+'; const C = R.conf[b] = R.conf[b] || { n: 0, w: 0, p: 0 }; C.n++; C.p += v.conf; if (v.win) C.w++;
    const S = R.sf[m.sf] = R.sf[m.sf] || { n: 0, w: 0 }; S.n++; if (v.win) S.w++;
    const T = R.tour[m.t] = R.tour[m.t] || { n: 0, w: 0 }; T.n++; if (v.win) T.w++;
    if (v.pk && (v.pkr === 'won' || v.pkr === 'lost')) { R.bn++; if (v.pkr === 'won') R.bw++; R.bu += v.pku; }
  });
  return R;
}
function wilson(k, n) { if (!n) return [0, 1]; const z = 1.96, p = k / n, d = 1 + z * z / n, c = (p + z * z / (2 * n)) / d, mm = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d; return [c - mm, c + mm]; }
function openStats() {
  const R = statsAll(); const sl = Object.values(SLIPS).map(slipResult).filter(x => x && x.st !== 'open'), slW = sl.filter(x => x.st === 'won').length;
  if (!R.n && !sl.length && !botStats().n) return openSheet('Estatísticas', `<div class="gl empty"><div class="face">${viFace('ok')}</div>Enche-se sozinho: o Vi guarda a previsão de cada jogo antes de começar e compara com o resultado.</div>`);
  const pm = (k, n) => { const [a, b] = wilson(k, n); return `${pct(k / n)} <span class="muted small">(${Math.round(a * 100)}–${Math.round(b * 100)}%)</span>`; };
  let h = `<div class="gl">${attr('Vencedor certo', R.win / R.n * 100, pm(R.win, R.n) + ` · ${R.n} jogos`)}${Object.entries(R.tour).map(([k, T]) => attr(k.toUpperCase(), T.w / T.n * 100, `${T.w}/${T.n}`)).join('')}${Object.entries(R.sf).map(([k, S]) => attr(SURF_NAME[k], S.w / S.n * 100, `${S.w}/${S.n}`)).join('')}
    <div class="why"><span>Jogos por encontro: previsto vs real</span><b>${R.gn ? (R.gp / R.gn).toFixed(1).replace('.', ',') + ' vs ' + (R.ga / R.gn).toFixed(1).replace('.', ',') : '—'}</b></div>
    ${sl.length ? `<div class="why"><span>Boletins seguros inteiros</span><b>${slW}/${sl.length}</b></div>` : ''}
    ${(() => { const L = safeLegStats(); return L ? `<div class="why"><span>Seleções seguras</span><b>${L.w}/${L.n} (${pct(L.w / L.n)}) · prometia ${pct(L.p)}</b></div>` : ''; })()}
    <div class="why"><span>Peso que o Vi dá às odds (aprendido)</span><b>${pct(calibW().w)} · ${calibW().n} jogos</b></div>
    ${R.bn ? `<div class="why"><span>Apostas do Vi</span><b class="${R.bu >= 0 ? 'pos' : 'neg'}">${R.bw}/${R.bn} · ${unitsTxt(R.bu)}</b></div>` : ''}</div>
    <div class="h2">${ic('chip')} Quando o Vi diz X%, acontece…</div><div class="gl"><table class="tbl"><tr><th>Confiança</th><th>Jogos</th><th>Dizia</th><th>Aconteceu</th></tr>${['50-60', '60-70', '70-80', '80+'].filter(b => R.conf[b]).map(b => { const C = R.conf[b]; return `<tr><td>${b}%</td><td>${C.n}</td><td>${pct(C.p / C.n)}</td><td class="${Math.abs(C.w / C.n - C.p / C.n) < 0.08 ? 'pos' : 'neg'}">${pct(C.w / C.n)}</td></tr>`; }).join('')}</table></div>
    <div class="h2">${ic('robot')} Vi sozinho (bot)<span class="r">${botStats().n} apostas</span></div><div class="gl">${(() => { const B = botStats(); return B.w + B.l ? botStatsBlock(B) : '<div class="small muted">O bot aposta sozinho quando atualizas antes dos jogos. As estatísticas aparecem depois dos primeiros resultados.</div>'; })()}</div>
    <button class="btn full" style="margin-top:10px" onclick="exportPreds()">${ic('download')} Exportar previsões (Excel)</button>
    <div class="h2">${ic('wallet')} Contas</div><div class="gl">${['tu', 'to', 'pi'].map(k => { const s = accStats(k); return `<div class="why"><span>${ACC[k].n}</span><b class="${s.profit >= 0 ? 'pos' : 'neg'}">${sEur(s.profit)} · ROI ${sPct(s.roi)}</b></div>`; }).join('')}</div>
    <div class="gl small muted">Teste às cegas antes de nascer (jun 2025 → jun 2026, jogos de tour): o Elo do Vi acertou 65% (ATP) e 67% (WTA) dos vencedores, contra 63%/62% do ranking.</div>`;
  openSheet('Estatísticas', h);
}
let RT = 'atp', RS = 'e';
function openRank() {
  const T = SEED.tours[RT].p, rows = Object.keys(T).map(k => seedP(RT, k)).concat(Object.values(PU[RT]).filter(p => !T[normName(p.nm)]));
  const val = p => RS === 'e' ? p.e : p.es[RS];
  const L = rows.filter(p => p.n >= 15 && p.last >= ymdAdd(today(), -400)).sort((a, b) => val(b) - val(a)).slice(0, 40);
  openSheet('Ranking do Vi', `<div class="pills">${[['atp', 'ATP'], ['wta', 'WTA']].map(([k, t]) => `<button class="pill ${RT === k ? 'on' : ''}" onclick="RT='${k}';openRank()">${t}</button>`).join('')}<span style="width:6px"></span>${[['e', 'Geral'], ['h', 'Duro'], ['c', 'Terra'], ['g', 'Relva']].map(([k, t]) => `<button class="pill ${RS === k ? 'on' : ''}" onclick="RS='${k}';openRank()">${t}</button>`).join('')}</div>
   <div class="gl"><table class="tbl"><tr><th>#</th><th>Jogador</th><th>Elo</th><th>Rank ATP/WTA</th></tr>${L.map((p, i) => `<tr><td>${i + 1}</td><td style="text-align:left">${esc(p.nm)} <span class="muted small">${flag(p.ioc)}${esc(p.ioc)}</span></td><td><b>${Math.round(val(p))}</b></td><td>${p.rank ? '#' + p.rank : '—'}</td></tr>`).join('')}</table></div><div class="small muted">Elo do Vi: força real pelos resultados (ganhar a fortes vale mais). Dados: Jeff Sackmann / Tennis Abstract (CC BY-NC-SA) + ESPN.</div>`);
}
function openHow() {
  openSheet('Como pensa o Vi', `<div class="gl" style="line-height:1.55">
   <p><b>1. Elo.</b> Cada jogador tem uma força que sobe quando ganha e desce quando perde — ganhar a um forte vale muito, a um fraco vale pouco. Calculado com todos os jogos desde 2012 (ATP, WTA, Challenger, ITF) e atualizado com os resultados da ESPN.</p>
   <p><b>2. Superfície.</b> Há um Elo para piso duro, terra e relva. O Vi junta 70% do geral com 30% do da superfície (o melhor no teste).</p>
   <p><b>3. Melhor de 5.</b> Nos Grand Slams masculinos o favorito ganha mais vezes: o Vi converte a probabilidade set a set.</p>
   <p><b>4. Jogos.</b> A partir do serviço e da resposta de cada um (pontos ganhos face à média), calcula jogo a jogo, set a set, e mistura «dia bom / normal / dia mau» — sem isso o modelo dava jogos a mais. Dá handicap, total de jogos e sets.</p>
   <p><b>5. Outros fatores.</b> Testados um a um às cegas. Entraram os que acertam melhor: serviço + resposta do último ano, idade (acima dos 31 o Elo exagera) e paragem longa (mais de 60 dias sem jogar). Ficaram de fora porque não ajudavam: confronto direto (H2H), forma recente (o serviço+resposta já a apanha), superfície extra, canhoto e altura. O caso «besta negra» também foi testado: o Elo já explica esses duelos.</p>
   <p><b>6. Teste às cegas.</b> Jun 2025 → jun 2026 (jogos que o Vi não viu): 66% de acerto no ATP e 66% na WTA, melhor que o ranking (63-64%). Quando diz 70%, acontece ~70%.</p>
   <p><b>7. Odds.</b> A ESPN quase não dá odds de ténis: mete as da Betano na ficha do jogo. Se a Betano paga acima da odd justa do Vi, há valor.</p></div>`);
}
function openHelp() {
  const q = (t, x) => `<div class="gl"><b>${t}</b><div class="small" style="margin-top:4px;line-height:1.5">${x}</div></div>`;
  openSheet('O que quer dizer', q('Vencedor', 'Quem ganha o encontro. Se um jogador desiste, a Betano tem regras próprias; o Vi anula as apostas de jogos/handicap e mantém a de vencedor só se já houve pelo menos um set acabado.') + q('Handicap de jogos', '«Shelton −3,5 jogos» ganha se o Shelton fizer pelo menos mais 4 jogos do que o adversário no encontro todo. «Jodar +3,5» ganha se o Jodar perder por 3 jogos ou menos (ou ganhar).') + q('Total de jogos', 'Soma dos jogos de todos os sets. 6-4 6-3 = 19 jogos. «Mais de 21,5» precisa de 22 ou mais.') + q('Odd justa e valor', 'Odd justa = 1 ÷ probabilidade do Vi. Se a Betano pagar mais do que a odd justa, há valor (a longo prazo ganha-se).') + q('Elo', 'Força de cada jogador pelos resultados. 2000+ = top mundial; diferença de 200 pontos ≈ 76% para o mais forte.'));
}
function botCurve(c) {
  if (c.length < 2) return '';
  const W = 320, H = 90, mn = Math.min(0, ...c), mx = Math.max(0, ...c), sp = mx - mn || 1, x = i => 8 + i / (c.length - 1) * (W - 16), y = v => 8 + (mx - v) / sp * (H - 16);
  const pts = c.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' '), last = c[c.length - 1];
  return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block;margin:6px 0"><line x1="8" x2="${W - 8}" y1="${y(0)}" y2="${y(0)}" stroke="rgba(255,255,255,.3)" stroke-dasharray="3 3"/><polyline points="${pts}" fill="none" stroke="${last >= 0 ? 'var(--pos)' : 'var(--neg)'}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="${x(c.length - 1)}" cy="${y(last)}" r="3.5" fill="${last >= 0 ? 'var(--pos)' : 'var(--neg)'}"/></svg><div class="small muted">Lucro acumulado do bot, aposta a aposta (linha tracejada = zero).</div>`;
}
function botStatsBlock(S, noTop) {
  const row = (lbl, txt, cls) => `<div class="why"><span>${lbl}</span><b class="${cls || ''}">${txt}</b></div>`;
  let h = (noTop ? '' : attr('Acerto no vencedor', S.hit == null ? 0 : S.hit * 100, S.hit == null ? '—' : `${pct(S.hit)} (${S.w}-${S.l})`) + row('Lucro', S.roi == null ? '—' : `${sEur(S.pl)} · ROI ${sPct(S.roi)}`, S.pl > 0 ? 'pos' : S.pl < 0 ? 'neg' : '')) + botCurve(S.curve);
  h += row('Com o favorito da casa', S.favN ? `${S.favW}/${S.favN} · ${sEur(S.favPl)}` : '—', S.favPl > 0 ? 'pos' : S.favPl < 0 ? 'neg' : '') +
    row('Contra a casa (azarão)', S.dogN ? `${S.dogW}/${S.dogN} · ${sEur(S.dogPl)}` : '—', S.dogPl > 0 ? 'pos' : S.dogPl < 0 ? 'neg' : '') +
    row('Quando tem 70%+ de certeza', S.confN ? `${S.confW}/${S.confN} (${pct(S.confW / S.confN)})` : '—') +
    row('Teste às cegas', BOT_TEST.txt, 'muted');
  const gs = Object.entries(S.byG).filter(([, o]) => o.n >= 3).sort((a, b) => b[1].n - a[1].n);
  if (gs.length) h += `<table class="tbl" style="margin-top:8px"><tr><th style="text-align:left">Circuito · piso</th><th>V/N</th><th>Lucro</th></tr>${gs.map(([k, o]) => `<tr><td style="text-align:left">${esc(k)}</td><td>${o.w}/${o.n}</td><td class="${o.pl >= 0 ? 'pos' : 'neg'}">${sEur(o.pl)}</td></tr>`).join('')}</table>`;
  if (S.days.length) h += `<table class="tbl" style="margin-top:8px"><tr><th style="text-align:left">Dia</th><th>V-D</th><th>Lucro</th></tr>${S.days.slice(0, 14).map(x => `<tr><td style="text-align:left">${new Date(x.k + 'T12:00:00').toLocaleDateString('pt-PT', { weekday: 'short', day: '2-digit', month: '2-digit' })}</td><td>${x.w}-${x.l}</td><td class="${x.pl >= 0 ? 'pos' : 'neg'}">${sEur(x.pl)}</td></tr>`).join('')}</table>`;
  return h;
}
function botHome() {
  const S = botStats(); if (!CFG.piOn && !S.n) return '';
  return `<div class="gl" style="cursor:pointer" onclick="ACCF='pi';CT='contas';go('contas')"><div class="h3">${ic('robot')} Vi sozinho · bot automático<span class="r">${CFG.piOn ? '<b class="pos">ligado</b>' : '<b class="neg">desligado</b>'}</span></div>
    <div class="opinion" style="margin:6px 0 8px"><div class="face">${viFace(S.roi == null ? 'ok' : S.roi >= 0 ? 'win' : 'sad')}</div><div class="small">${S.open ? `Tenho <b>${S.open} aposta${S.open === 1 ? '' : 's'}</b> em jogo (${eur(S.openL.reduce((s, b) => s + b.stake, 0))}): ${S.openL.slice(0, 3).map(b => esc(b.lb.replace(' ganha', '').replace(' vence', ''))).join(', ')}${S.open > 3 ? '…' : ''}.` : 'Aposto sozinho em todos os jogos com odds das próximas 36 horas, quando atualizas.'}</div></div>
    ${S.w + S.l ? attr('Acerto', S.hit * 100, `${pct(S.hit)} (${S.w}-${S.l})`) + `<div class="why"><span>Lucro</span><b class="${S.pl >= 0 ? 'pos' : 'neg'}">${sEur(S.pl)} · ROI ${sPct(S.roi)}</b></div>` : ''}
    <div class="small muted" style="margin-top:4px">Toca para ver tudo o que o bot fez.</div></div>`;
}
function botMini() {
  const S = botStats();
  return `<div class="gl" style="cursor:pointer" onclick="ACCF='pi';render()"><div class="opinion" style="margin:0"><div class="face">${viFace(S.roi == null ? 'ok' : S.roi >= 0 ? 'win' : 'sad')}</div><div><b>Vi sozinho</b> · ${CFG.piOn ? 'ligado' : '<span class="neg">desligado</span>'}<div class="small muted">${S.n ? `${S.n} apostas sozinho · ${S.w}-${S.l} · ${S.open} em jogo${S.roi != null ? ' · ROI ' + sPct(S.roi) : ''}` : 'Aposta sozinho em todos os jogos com odds quando atualizas. Toca para ver.'}</div></div></div></div>`;
}
function botPanel() {
  const S = botStats(), nf = S.w + S.l;
  const verdict = nf < 50 ? `Ainda é cedo: com ${nf} apostas fechadas manda a sorte. Começa a ler a partir de ~100; com confiança, a partir de ~300.`
    : S.roi >= 0 ? 'Está a dar lucro: melhor do que se esperava. Continua a observar antes de acreditar.'
    : S.roi > -0.06 ? 'Perto do esperado: acerta bastante, mas os favoritos pagam pouco e a margem da casa come o resto.'
    : 'Abaixo do esperado: as casas estão a saber mais do que ele (lesões, cansaço). É por isso que a app junta as odds.';
  return `<div class="gl"><div class="h3">${ic('robot')} Como se porta sozinho<span class="r">${CFG.piOn ? 'ligado' : 'desligado'}</span></div>
    <div class="opinion"><div class="face">${viFace('ok')}</div><div class="small">Em cada jogo com odds das próximas 36 horas aposto <b>${eur(CFG.piStake)}</b> no jogador que o <b>meu Elo</b> prefere (sem copiar as odds), à odd da ESPN do momento. Ninguém me mexe: é a experiência honesta.</div></div>
    ${botStatsBlock(S)}
    <div class="small" style="margin-top:8px">${verdict}</div>
    <div class="small muted" style="margin-top:8px">Eu só aposto quando atualizas a app: abre-a pelo menos uma vez por dia antes dos jogos.</div>
    ${!CFG.piOn ? `<button class="btn or full" style="margin-top:12px" onclick="CFG.piOn=true;LS.set('cfg',CFG);pilotRun();render()">Ligar o Vi sozinho</button>` : ''}</div>`;
}
function exportPreds() {
  const f = v => String(v == null ? '' : v).replace('.', ',');
  const rows = [['dia', 'circuito', 'torneio', 'piso', 'melhor_de', 'jogador_a', 'jogador_b', 'rank_a', 'rank_b', 'vencedor', 'resultado', 'vi_prob_a', 'elo_prob_a', 'casa_prob_a', 'odd_a', 'odd_b', 'jogos_previstos', 'jogos_reais', 'vencedor_certo', 'aposta_vi', 'odd', 'resultado_aposta', 'unidades']];
  Object.entries(PREDS).forEach(([id, p]) => { const m = mOf(id); if (!m || m.s !== 'post' || !m.w) return; const v = verdict(m); rows.push([p.ed, String(m.t).toUpperCase(), m.ev || p.ev || '', SURF_NAME[m.sf] || '', m.bo || p.bo || '', m.a.n, m.b.n, m.a.rk || '', m.b.rk || '', m.w === 'a' ? m.a.n : m.b.n, m.sets.map(x => x[0] + '-' + x[1]).join(' '), f(p.pA), f(p.pE), f(p.nv), f(p.oa), f(p.ob), f(p.eg), gameTot(m), v ? (v.win ? 1 : 0) : '', p.pk ? p.pk.lb : '', p.pk ? f(p.pk.odd) : '', v && v.pk ? v.pkr : '', v && v.pk ? f(r2(v.pku)) : '']); });
  const csv = '﻿' + rows.map(r => r.map(x => /[;"\n]/.test(String(x)) ? '"' + String(x).replace(/"/g, '""') + '"' : x).join(';')).join('\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); a.download = 'mister-vi-previsoes-' + today() + '.csv'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  toast('Ficheiro gerado (abre no Excel)');
}
function safeLegStats() {
  let n = 0, w = 0, p = 0; Object.values(SLIPS).forEach(S => S.legs.forEach(l => { const r = outcome(l, mOf(l.g)); if (r === 'won' || r === 'lost') { n++; p += l.p; if (r === 'won') w++; } }));
  return n ? { n, w, p: p / n } : null;
}
function openCfg() {
  const inp = (id, l, v) => `<label class="f">${l}</label><input class="in" id="${id}" inputmode="decimal" value="${ln(v)}">`;
  openSheet('Definições', `<div class="row">${['tu', 'to', 'pi'].map(k => `<div style="flex:1">${inp('c_' + k, 'Banca ' + ACC[k].n, CFG.bank[k])}</div>`).join('')}</div>${inp('c_min', 'Aposta mínima (€)', CFG.min)}${inp('c_pis', 'Aposta do piloto (€)', CFG.piStake)}${inp('c_w', 'Peso da odd da casa (%)', Math.round(CFG.mktW * 100))}
   <label class="f">Vi sozinho (bot automático)</label><div class="seg"><button id="c_on" class="${CFG.piOn ? 'on' : ''}" onclick="this.classList.add('on');$('#c_off').classList.remove('on')">Ligado</button><button id="c_off" class="${!CFG.piOn ? 'on' : ''}" onclick="this.classList.add('on');$('#c_on').classList.remove('on')">Desligado</button></div>
   <button class="btn or full" style="margin-top:14px" onclick="saveCfg()">Guardar</button><button class="btn full" style="margin-top:10px" onclick="askConfirm('Apagar todas as apostas?','Apagar','wipeBets()')">Recomeçar as contas</button>`);
}
function saveCfg() { const v = id => num($('#' + id).value); ['tu', 'to', 'pi'].forEach(k => { const x = v('c_' + k); if (x >= 0) CFG.bank[k] = r2(x); }); if (v('c_min') > 0) CFG.min = r2(v('c_min')); if (v('c_pis') > 0) CFG.piStake = r2(v('c_pis')); if (v('c_w') != null) CFG.mktW = clamp(v('c_w'), 0, 100) / 100; CFG.piOn = $('#c_on').classList.contains('on'); LS.set('cfg', CFG); closeSheet(); toast('Guardado'); render(); }
function wipeBets() { BETS = []; DEPOS = []; saveBets(); LS.set('depos', DEPOS); closeSheet(); render(); }
function openBackup() { openSheet('Cópia de segurança', `<button class="btn or full" onclick="exportAll()">${ic('download')} Exportar tudo</button><label class="f" style="margin-top:14px">Importar</label><input type="file" accept=".json" class="in" onchange="importAll(this)">`, true); }
function exportAll() { const data = {}; ['bets', 'preds', 'depos', 'cfg', 'slips', 'man', 'pu', 'done', 'db'].forEach(k => data[k] = LS.get(k, null)); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify({ app: 'mister-vi', ver: APP_VER, data })], { type: 'application/json' })); a.download = 'mister-vi-copia-' + today() + '.json'; document.body.appendChild(a); a.click(); setTimeout(() => a.remove(), 1000); }
function importAll(inp) { const f = inp.files && inp.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { try { const j = JSON.parse(r.result); if (j.app !== 'mister-vi') throw new Error('não é do Mister Vi'); Object.entries(j.data).forEach(([k, v]) => { if (v != null) LS.set(k, v); }); setTimeout(() => location.reload(), 500); } catch (e) { toast(esc(e.message)); } }; r.readAsText(f); }
function openNet() { openSheet('Testar ligação', `<button class="btn or full" onclick="netTest(this)">Testar agora</button><div id="netBox" style="margin-top:10px"></div>`, true); }
async function netTest(btn) { btn.disabled = true; const url = `${ESPN}/atp/scoreboard?dates=${today()}`, rows = []; let best = null; for (let i = 0; i < BRIDGES.length; i++) { const t0 = Date.now(); try { const r = await fetch(BRIDGES[i].f(url), { cache: 'no-store' }); const j = await r.json(); const ms = Date.now() - t0; rows.push(`✓ ${BRIDGES[i].n}: ${(j.events || []).length} torneios (${ms} ms)`); if (!best || ms < best.ms) best = { i, ms }; } catch (e) { rows.push(`✗ ${BRIDGES[i].n}`); } } if (best) LS.set('bridge', best.i); $('#netBox').innerHTML = `<div class="gl small">${rows.join('<br>')}</div>`; btn.disabled = false; }
function viewMais() {
  const T = [['chart', 'Estatísticas', 'openStats()'], ['trophy', 'Ranking do Vi', 'openRank()'], ['chip', 'Como pensa', 'openHow()'], ['info', 'O que quer dizer', 'openHelp()'], ['gear', 'Definições', 'openCfg()'], ['save', 'Cópia de segurança', 'openBackup()'], ['pulse', 'Testar ligação', 'openNet()']];
  if (!isStandalone()) T.push(['phone', 'Instalar app', 'openInstall()']);
  return `<div class="tiles" style="margin-top:14px">${T.map(([i, l, f]) => `<div class="tile" onclick="${f}">${ic(i)}<b>${l}</b></div>`).join('')}</div><div class="gl small muted" style="text-align:center">Mister Vi v${APP_VER} · dados: Jeff Sackmann / Tennis Abstract (CC BY-NC-SA 4.0) + ESPN · simulação, sem dinheiro real<br>© 2026 Júlio Melo</div>`;
}

/* ---------- instalar ---------- */
let DEFER = null;
const isStandalone = () => (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); DEFER = e; if (VIEW === 'inicio') render(); });
window.addEventListener('appinstalled', () => { LS.set('instHide', 1); toast('Mister Vi instalado!'); render(); });
function installBanner() { if (isStandalone() || LS.get('instHide', 0)) return ''; return `<div class="gl row"><span style="color:var(--or2)">${ic('phone')}</span><div style="flex:1"><b>Instala o Mister Vi</b><div class="small muted">Fica no ecrã do telemóvel, como uma app.</div></div><button class="btn or sm" onclick="doInstall()">Instalar</button><button class="btn sm" onclick="LS.set('instHide',1);render()">${ic('x')}</button></div>`; }
async function doInstall() { if (DEFER) { DEFER.prompt(); try { const r = await DEFER.userChoice; if (r && r.outcome === 'accepted') LS.set('instHide', 1); } catch (e) {} DEFER = null; render(); return; } openInstall(); }
function openInstall() { openSheet('Instalar como app', `<div class="gl">${isIOS() ? '<b>iPhone:</b> abre no Safari → Partilhar (□↑) → «Adicionar ao ecrã principal».' : '<b>Android (Chrome):</b> menu ⋮ → «Instalar app» ou «Adicionar ao ecrã principal».'}</div>`, true); }

/* ---------- arranque ---------- */
$('#topFace').innerHTML = viFace('ok'); $('#btnRefresh').innerHTML = ic('refresh');
document.querySelectorAll('[data-ic]').forEach(el => { el.outerHTML = ic(el.dataset.ic); });
window.addEventListener('hashchange', () => { const v = location.hash.slice(1); if (VIEWS.includes(v) && v !== VIEW) { VIEW = v; render(); } });
render();
fetch('ratings.json').then(r => r.json()).then(j => { SEED = j; migrate(); settleAll(); render(); setTimeout(bossFeed, 50); }).catch(() => { $('#view').innerHTML = '<div class="gl">Não consegui carregar os dados do Vi (ratings.json). Abre com internet uma vez.</div>'; });
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
