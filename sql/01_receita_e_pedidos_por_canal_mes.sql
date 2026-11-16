-- Receita e pedidos por canal e por mes (PostgreSQL)
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
SELECT date_trunc('month', l.data)::date AS mes,
       c.canal,
       COUNT(DISTINCT l.pedido_id) AS pedidos,
       ROUND(SUM(l.receita), 2) AS receita
FROM linhas l
JOIN canais c ON c.canal_id = l.canal_id
GROUP BY 1, 2
ORDER BY 1, 2;
