# Dashboard de performance de marketplace

Projeto de portfólio em Power BI e SQL para acompanhar a performance de vendas em marketplaces. Todos os dados são fictícios.

Status: base de dados e consultas SQL prontas. O relatório em Power BI está em construção.

## Pergunta de negócio

Quais canais e produtos dão mais resultado, e onde a margem e o investimento em anúncios precisam de ajuste?

## Indicadores

- Receita e pedidos por canal e por mês
- Margem por canal
- ROAS (retorno sobre o investimento em anúncios)
- Taxa de conversão
- Curva ABC dos produtos (participação no faturamento)

## Estrutura do repositório

| Pasta | Conteúdo |
|---|---|
| `dados/` | Base fictícia em CSV: pedidos, produtos, canais e anúncios |
| `sql/` | Consultas dos indicadores (PostgreSQL), uma por arquivo |
| `scripts/` | Script que gera a base fictícia |

A pasta `powerbi/`, com o arquivo do relatório (.pbix) e as capturas de tela, será criada quando o relatório estiver pronto.

## Sobre os dados

Os dados foram gerados por script, com semente fixa, e não pertencem a nenhuma empresa. São 6 canais de marketplace, 120 produtos e 3.565 pedidos de janeiro a junho de 2026, com sazonalidade e poucos produtos concentrando a maior parte da receita. Os valores de comissão, frete e investimento em anúncios são inventados.

## Como usar

1. Carregue os quatro CSVs de `dados/` em tabelas com os mesmos nomes (`pedidos`, `produtos`, `canais`, `anuncios`).
2. Rode as consultas de `sql/` ou importe os CSVs direto no Power BI.

## Definições

- Receita: quantidade × preço unitário × (1 − desconto)
- Margem: receita − custo do produto − comissão do canal − taxa fixa por pedido − frete pago pelo vendedor
- ROAS: receita atribuída aos anúncios ÷ investimento
- Conversão: pedidos atribuídos ÷ cliques
- Curva ABC: classe A até 80% da receita acumulada, B até 95% e C o restante

## Contexto

O projeto se baseia na minha experiência com a operação de e-commerce e marketplaces de um varejo, em que acompanhei margem, ROAS, conversão e curva ABC por canal. Os números deste repositório não são dados reais de nenhuma empresa.

## Autora

Adélia Modesto | [LinkedIn](https://www.linkedin.com/in/adeliamodesto)
