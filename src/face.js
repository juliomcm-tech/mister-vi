/* =====================================================================
   A CARA DO MISTER VI — crachá redondo de terra batida (desenho original)
   Pala branca de ténis, cabelo escuro, barba curta, munhequeira, bola em néon.
   mood: 'ok' · 'win' · 'sad'
   ===================================================================== */
function viFace(mood) {
  const mouth = mood === 'win'
    ? '<path d="M50 83 Q60 93 70 83 Q60 87.5 50 83Z" fill="#3a1208"/><path d="M52.5 84 Q60 86.6 67.5 84" stroke="#fff" stroke-width="2" fill="none"/>'
    : mood === 'sad' ? '<path d="M51.5 88 Q60 82 68.5 88" stroke="#3a1208" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
    : '<path d="M51 84.5 Q57 88 66 83.5" stroke="#3a1208" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
  const brow = mood === 'sad' ? ['M39 52 L52 49', 'M81 52 L68 49'] : mood === 'win' ? ['M39 49 Q45.5 44.5 52.5 47.5', 'M81 49 Q74.5 44.5 67.5 47.5'] : ['M39 50.5 Q45.5 46.5 52.5 49', 'M81 49 Q74.5 45.5 67.5 48'];
  const eye = mood === 'sad' ? 'M42 58 Q46 56 50 58' : null;
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<defs>
 <radialGradient id="vBg" cx=".5" cy=".38" r=".72"><stop offset="0" stop-color="#ffa24a"/><stop offset=".4" stop-color="#d4500f"/><stop offset=".75" stop-color="#4a1604"/><stop offset="1" stop-color="#140602"/></radialGradient>
 <linearGradient id="vSkin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3c7a0"/><stop offset="1" stop-color="#d69a6e"/></linearGradient>
 <linearGradient id="vVisor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dfe3ea"/></linearGradient>
 <linearGradient id="vShirt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1208"/><stop offset="1" stop-color="#0e0603"/></linearGradient>
 <linearGradient id="vGlass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>
 <clipPath id="vClip"><circle cx="60" cy="60" r="55"/></clipPath>
</defs>
<circle cx="60" cy="60" r="57" fill="url(#vBg)"/>
<g clip-path="url(#vClip)">
 <g stroke="#ffffff" stroke-opacity=".16" stroke-width="1.4" fill="none"><path d="M10 92 L110 92 M24 74 L96 74 M60 74 V92 M30 74 L18 112 M90 74 L102 112"/></g>
 <path d="M4 34 Q60 64 116 34" stroke="#d9ff3a" stroke-opacity=".35" stroke-width="2.4" fill="none"/>
 <g transform="rotate(32 88 34)">
  <rect x="85.5" y="56" width="5" height="40" rx="2" fill="#1a0b05" stroke="#ffb15c" stroke-width="1.2"/>
  <ellipse cx="88" cy="32" rx="17" ry="23" fill="rgba(20,8,3,.55)" stroke="#ffb15c" stroke-width="3.2"/>
  <clipPath id="vStr"><ellipse cx="88" cy="32" rx="15.5" ry="21.5"/></clipPath>
  <g clip-path="url(#vStr)" stroke="#ffe0b8" stroke-opacity=".55" stroke-width=".9">${Array.from({length:9},(_,i)=>`<line x1="${74+i*3.5}" y1="8" x2="${74+i*3.5}" y2="56"/>`).join('')}${Array.from({length:12},(_,i)=>`<line x1="70" y1="${12+i*3.6}" x2="106" y2="${12+i*3.6}"/>`).join('')}</g>
 </g>
 <path d="M4 86 Q60 56 116 86" stroke="#d9ff3a" stroke-opacity=".35" stroke-width="2.4" fill="none"/>
 <!-- polo -->
 <path d="M20 124 Q22 98 47 92 L60 99 L73 92 Q98 98 100 124 Z" fill="url(#vShirt)"/>
 <path d="M47 92 L55 104 L60 99 L65 104 L73 92" fill="#fff" opacity=".92"/>
 <path d="M60 99 V124" stroke="#ff7a1a" stroke-width="2"/>

 <path d="M53 91 L60 97.5 L67 91 Q66 86 60 86 Q54 86 53 91Z" fill="#c98a60"/>
</g>
<!-- cabeça -->
<ellipse cx="33.5" cy="62" rx="5.5" ry="7.5" fill="#dca17a"/><ellipse cx="86.5" cy="62" rx="5.5" ry="7.5" fill="#dca17a"/>
<path d="M60 30 C78 30 87 42 87 60 C87 78 76 90 60 90 C44 90 33 78 33 60 C33 42 42 30 60 30Z" fill="url(#vSkin)"/>
<!-- cabelo -->
<path d="M33.5 58 Q31 38 44 30 Q60 22 76 30 Q89 38 86.5 58 Q84 46 78 42 L42 42 Q36 46 33.5 58Z" fill="#2b1a12"/>
<path d="M34 60 Q34 66 36 70 L36 58Z M86 60 Q86 66 84 70 L84 58Z" fill="#2b1a12"/>
<!-- pala de ténis -->
<path d="M31 44 Q60 33 89 44 L89 50 Q60 40 31 50 Z" fill="url(#vVisor)" stroke="#c9ced8" stroke-width=".8"/>
<path d="M33 49 Q60 38 87 49 Q96 52 100 57 Q80 49 60 48 Q40 49 20 57 Q24 52 33 49Z" fill="#ff7a1a" stroke="#a84600" stroke-width="1"/>
<path d="M28 54 Q60 44 92 54" stroke="#fff" stroke-opacity=".5" stroke-width="1" fill="none"/>
<!-- sobrancelhas e olhos -->
<path d="${brow[0]}" stroke="#2b1a12" stroke-width="3.6" stroke-linecap="round" fill="none"/><path d="${brow[1]}" stroke="#2b1a12" stroke-width="3.6" stroke-linecap="round" fill="none"/>
${eye ? `<path d="${eye}" stroke="#1d0f08" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M70 58 Q74 56 78 58" stroke="#1d0f08" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
  : '<ellipse cx="46" cy="58.5" rx="3.6" ry="4.2" fill="#1d0f08"/><ellipse cx="74" cy="58.5" rx="3.6" ry="4.2" fill="#1d0f08"/><circle cx="47.3" cy="57" r="1.3" fill="#fff"/><circle cx="75.3" cy="57" r="1.3" fill="#fff"/>'}
<!-- nariz, barba curta, boca -->
<path d="M60 60 Q65 70 61.5 72.5 Q58 74.5 55.5 71.5" fill="#c98660"/>
<path d="M38 70 Q40 86 60 90 Q80 86 82 70 Q80 82 70 85 Q60 80 50 85 Q40 82 38 70Z" fill="#2b1a12" opacity=".35"/>
<path d="M50 79 Q60 75.5 70 79" stroke="#2b1a12" stroke-width="2.4" fill="none" opacity=".55" stroke-linecap="round"/>
${mouth}
<path d="M82 46 Q89 60 84 76 Q81 84 74 88" stroke="#ff9a3c" stroke-opacity=".55" stroke-width="2.4" fill="none" stroke-linecap="round"/>
<circle cx="25" cy="96" r="11" fill="#d9ff3a" opacity=".18"/>
<circle cx="25" cy="96" r="7.5" fill="#d9ff3a" stroke="#9fb800" stroke-width="1"/><path d="M18.5 93 Q25 98 31.5 93 M18.5 99.5 Q25 94.5 31.5 99.5" stroke="#f8ffd0" stroke-width="1.3" fill="none"/>
<!-- vidro + aro de néon -->
<ellipse cx="60" cy="30" rx="44" ry="20" fill="url(#vGlass)" opacity=".5" clip-path="url(#vClip)"/>
<circle cx="60" cy="60" r="56.5" fill="none" stroke="#ffb15c" stroke-width="3"/>
<circle cx="60" cy="60" r="52.5" fill="none" stroke="#d9ff3a" stroke-opacity=".7" stroke-width="1"/>
<path d="M22 22 A54 54 0 0 1 60 6" stroke="#fff" stroke-opacity=".6" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`;
}
