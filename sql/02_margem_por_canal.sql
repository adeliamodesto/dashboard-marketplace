-- Margem por canal: receita - custo do produto - comissao - frete (PostgreSQL)
WITH linhas AS (
  SELECT p.pedido_id, p.data, p.canal_id, p.sku,
         p.quantidade * p.preco_unitario * (1 - p.desconto_pct) AS receita,
         p.quantidade * pr.custo AS custo,
         p.quantidade * p.preco_unitario * (1 - p.desconto_pct) * c.comissao_pct + c.taxa_fixa_pedido AS comissao,
         p.frete_vendedor AS frete
  FROM pedidos p
  JOIN produtos pr ON pr.sku = p.sku
  JOIN canais c ON c.canal_id = p.canal_id
)
SELECT c.canal,
       ROUND(SUM(l.receita), 2) AS receita,
       ROUND(SUM(l.custo), 2) AS custo_produto,
       ROUND(SUM(l.comissao), 2) AS comissao_e_taxas,
       ROUND(SUM(l.frete), 2) AS frete,
       ROUND(SUM(l.receita - l.custo - l.comissao - l.frete), 2) AS margem,
       ROUND(100 * SUM(l.receita - l.custo - l.comissao - l.frete) / SUM(l.receita), 1) AS margem_pct
FROM linhas l
JOIN canais c ON c.canal_id = l.canal_id
GROUP BY c.canal
ORDER BY margem DESC;
