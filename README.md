# 📊 Microserviço de Logs (MVP)

Este projeto é um MVP desenvolvido para modernizar a arquitetura de observabilidade da empresa. O objetivo principal é substituir a gravação tradicional de logs em arquivos de texto (`.txt`) por uma estrutura de alto desempenho baseada em banco de dados **NoSQL (Elasticsearch)**.

A longo prazo, a meta é escalar este serviço para implantação real em servidores de clientes (*on-premise*), distribuído como um executável autossuficiente (`.exe`) e configurável via arquivo `.ini`.

---

## 🚀 Tecnologias Utilizadas

* **Node.js + Express:** Criação da API REST rápida e leve para ingestão de dados.
* **Elasticsearch:** Banco de dados NoSQL focado em busca textual, indexação automática e alta performance.
* **Kibana / Elasticvue:** Interfaces visuais para consulta, filtro e análise de logs com suporte a *Query DSL*.
* **Docker:** Para orquestração rápida do banco e da interface visual no ambiente de desenvolvimento local.

---

## ⚙️ Arquitetura e Funcionamento

O microserviço atua como uma ponte (API) entre o sistema ERP e o banco de dados de logs. 

1. O sistema de origem faz uma requisição `POST` enviando um JSON estruturado.
2. O microserviço recebe, valida e envia esse payload para o Elasticsearch.
3. O Elasticsearch indexa automaticamente todos os campos (mesmo objetos aninhados), permitindo buscas complexas de forma instantânea (ex: buscar logs onde `TipoLog = "ERRO"` ou buscar por palavras-chave na observação).

---

## 🛠️ Configuração do Ambiente

O microserviço foi desenhado para ser facilmente configurado por equipes de implantação através de um arquivo externo, sem necessidade de alterar o código-fonte.

Crie um arquivo chamado `LogsConfig.ini` na mesma pasta do projeto (ou do executável) com a seguinte estrutura:

```ini
[SERVER]
# Porta em que o microserviço vai rodar
PORT=3000

[ELASTICSEARCH]
# URL de conexão com o banco de dados
NODE=http://localhost:9200