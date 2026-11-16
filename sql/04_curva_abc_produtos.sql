-- Curva ABC: A ate 80% da receita acumulada, B ate 95%, C o restante (PostgreSQL)
WITH receita_sku AS (
  SELECT sku, SUM(quantidade * preco_unitario * (1 - desconto_pct)) AS receita
  FROM pedidos
  GROUP BY sku
),
acumulado AS (
  SELECT sku, receita,
         SUM(receita) OVER (ORDER BY receita DESC, sku) / SUM(receita) OVER () AS pct_acumulado
  FROM receita_sku
)
SELECT sku,
       ROUND(receita, 2) AS receita,
       ROUND(100 * pct_acumulado, 1) AS pct_acumulado,
       CASE WHEN pct_acumulado <= 0.80 THEN 'A' WHEN pct_acumulado <= 0.95 THEN 'B' ELSE 'C' END AS classe
FROM acumulado
ORDER BY receita DESC;
