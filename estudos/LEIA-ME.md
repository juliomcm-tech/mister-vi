# Estudos do Mister Vi (novembro 2026)

Dados: arquivo público de Jeff Sackmann / Tennis Abstract (CC BY-NC-SA 4.0), via
`Aneeshers/tennis-sackmann-archive` — todos os jogos ATP, WTA, Challenger e ITF de 2012 a junho de 2026.

## Elo por superfície (teste às cegas)
- Elo geral + Elo por superfície (duro, terra, relva), K = k/(n+5)^0,4; Challenger conta 85%, ITF 70%, desistências 50%.
- Afinado em 2023-24, confirmado em junho 2025 → junho 2026 (jogos de tour que o modelo não viu):
  - **ATP:** acerta 65,4% dos vencedores (ranking oficial: 63,5%), log-loss 0,617 (ranking 0,633).
  - **WTA:** 66,6% (ranking 62,4%), log-loss 0,604 (ranking 0,635).
- Melhor mistura: 70% Elo geral + 30% Elo da superfície. Correção de calibração: ATP ×0,90, WTA ×1,06.

## Jogos (handicap e total)
- Pontos de serviço ganhos por superfície (2023-26): ATP duro 64,7%, terra 62,1%, relva 66,1%; WTA 56,9 / 55,2 / 58,7%.
- Modelo ponto → jogo → set → encontro. O modelo «puro» dava jogos a mais (ATP 25,0 previsto vs 23,4 real).
- Com mistura «dia bom / normal / dia mau» (δ = 0,05–0,065) acerta: ATP 23,7 vs 23,4; WTA 22,4 vs 22,5;
  «mais de 21,5» 55% vs 52,5% (ATP) e 47% vs 48% (WTA); handicaps do favorito a ±3 pontos.

## Por fazer
- Teste contra as odds da casa (as odds históricas de ténis grátis são raras; a OddsPapi tem histórico no plano grátis).
