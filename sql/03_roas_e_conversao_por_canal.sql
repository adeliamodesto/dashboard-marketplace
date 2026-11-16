-- ROAS e taxa de conversao dos anuncios por canal (PostgreSQL)
-- ROAS = receita atribuida / investimento; conversao = pedidos atribuidos / cliques
SELECT c.canal,
       ROUND(SUM(a.investimento), 2) AS investimento,
       ROUND(SUM(a.receita_atribuida), 2) AS receita_atribuida,
       ROUND(SUM(a.receita_atribuida) / SUM(a.investimento), 2) AS roas,
       ROUND(100.0 * SUM(a.pedidos_atribuidos) / SUM(a.cliques), 2) AS conversao_pct
FROM anuncios a
JOIN canais c ON c.canal_id = a.canal_id
GROUP BY c.canal
ORDER BY roas DESC;
