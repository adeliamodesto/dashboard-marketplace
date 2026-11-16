// Gera os CSVs ficticios da pasta dados/ (semente fixa: o resultado e sempre o mesmo).
// Uso: node gerar_dados.js
const fs = require('fs');
function build() {
  let s = 2026;
  function rnd() { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }
  const r2 = (x) => (Math.round(x * 100) / 100).toFixed(2);
  const pad = (n) => String(n).padStart(2, '0');
  const canais = [[1, 'Mercado Livre', 0.14, 6], [2, 'Shopee', 0.18, 3], [3, 'Amazon', 0.13, 0], [4, 'Magazine Luiza', 0.16, 0], [5, 'Americanas', 0.15, 0], [6, 'TikTok Shop', 0.06, 2]];
  const pesoCanal = [0.34, 0.26, 0.16, 0.10, 0.07, 0.07];
  const cats = ['Casa', 'Brinquedos', 'Papelaria', 'Beleza', 'Ferramentas', 'Acessorios'];
  const produtos = [];
  for (let i = 1; i <= 120; i++) {
    const custo = 8 + rnd() * 92; const preco = custo * (1.4 + rnd() * 0.9);
    produtos.push({ sku: 'SKU' + String(i).padStart(3, '0'), nome: 'Produto ' + String(i).padStart(3, '0'), categoria: cats[Math.floor(rnd() * cats.length)], custo: +r2(custo), preco: +r2(preco) });
  }
  const ordem = produtos.map((_, i) => i);
  for (let i = ordem.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [ordem[i], ordem[j]] = [ordem[j], ordem[i]]; }
  const wSku = ordem.map((_, k) => 1 / Math.pow(k + 1, 1.05)); const somaW = wSku.reduce((a, b) => a + b, 0);
  const acumSku = []; wSku.reduce((a, w, k) => (acumSku[k] = a + w / somaW, acumSku[k]), 0);
  function sorteiaSku() { const x = rnd(); let k = 0; while (k < acumSku.length - 1 && x > acumSku[k]) k++; return produtos[ordem[k]]; }
  function sorteiaCanal() { let x = rnd(), a = 0; for (let k = 0; k < pesoCanal.length; k++) { a += pesoCanal[k]; if (x <= a) return k; } return 0; }
  const sazonal = [0.85, 0.90, 1.00, 1.05, 1.15, 1.05]; const dias = [31, 28, 31, 30, 31, 30];
  const pedidos = []; const agr = {}; let id = 1;
  for (let m = 0; m < 6; m++) {
    const n = Math.round(600 * sazonal[m] * (0.95 + rnd() * 0.1));
    for (let i = 0; i < n; i++) {
      const dia = 1 + Math.floor(rnd() * dias[m]); const k = sorteiaCanal(); const p = sorteiaSku();
      const qx = rnd(); const qtd = qx < 0.7 ? 1 : qx < 0.9 ? 2 : 3;
      const dx = rnd(); const desc = dx < 0.5 ? 0 : dx < 0.75 ? 0.05 : 0.10;
      const preco = +r2(p.preco * (1 + k * 0.01)); const frete = rnd() < 0.6 ? +r2(5 + rnd() * 13) : 0;
      pedidos.push([ 'P' + String(id++).padStart(5, '0'), '2026-' + pad(m + 1) + '-' + pad(dia), canais[k][0], p.sku, qtd, r2(preco), desc.toFixed(2), r2(frete) ].join(','));
      const ch = m + '-' + k; agr[ch] = agr[ch] || { n: 0, rec: 0 }; agr[ch].n++; agr[ch].rec += qtd * preco * (1 - desc);
    }
  }
  const anuncios = [];
  for (let m = 0; m < 6; m++) for (let k = 0; k < 6; k++) {
    const a = agr[m + '-' + k]; const atr = Math.max(1, Math.round(a.n * (0.30 + rnd() * 0.15)));
    const recAtr = a.rec * (atr / a.n); const conv = 0.02 + rnd() * 0.04; const cliques = Math.round(atr / conv);
    const impressoes = Math.round(cliques / (0.008 + rnd() * 0.012)); const cpc = (k === 5 ? 0.9 : 0.45) + rnd() * 0.6;
    anuncios.push(['2026-' + pad(m + 1) + '-01', canais[k][0], r2(cliques * cpc), impressoes, cliques, atr, r2(recAtr)].join(','));
  }
  const files = {};
  files['dados/canais.csv'] = 'canal_id,canal,comissao_pct,taxa_fixa_pedido\n' + canais.map(c => [c[0], c[1], c[2].toFixed(2), r2(c[3])].join(',')).join('\n') + '\n';
  files['dados/produtos.csv'] = 'sku,nome,categoria,custo,preco_base\n' + produtos.map(p => [p.sku, p.nome, p.categoria, r2(p.custo), r2(p.preco)].join(',')).join('\n') + '\n';
  files['dados/pedidos.csv'] = 'pedido_id,data,canal_id,sku,quantidade,preco_unitario,desconto_pct,frete_vendedor\n' + pedidos.join('\n') + '\n';
  files['dados/anuncios.csv'] = 'mes,canal_id,investimento,impressoes,cliques,pedidos_atribuidos,receita_atribuida\n' + anuncios.join('\n') + '\n';
  return files;
}
const f = build();
for (const k of Object.keys(f)) { fs.mkdirSync(require('path').dirname(k), { recursive: true }); fs.writeFileSync(k, f[k]); }
