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
```

---

## 💻 Como rodar o projeto localmente (Desenvolvimento)
1. Suba o banco de dados:
Certifique-se de ter o Docker instalado e inicie o Elasticsearch e o Kibana em segundo plano:

```Bash
docker-compose up -d
```
2. Instale as dependências da API:

```Bash
npm install
```
3. Inicie o microserviço:

```Bash
node src/server.js
```
Ou Gere um executável
```Bash
npm run build
```

## 📡 Exemplo de Uso (API)
Endpoint: POST /api/InsereLogs

Exemplo de Payload (JSON):

```JSON
{
  "Datahora": "07/01/2026 15:00:43.200",
  "Tipo": 1,
  "TipoPrograma": "Ema_ERP",
  "Porta": 0,
  "Conteudo": {
    "Observacao": "Erro ao abrir ERP",
    "Descricao": "Erro no abrir do sistema",
    "Origem": 2,
    "IdIntegracaoEcommerce": 0
  },
  "TipoLog": "ERRO"
}
Retorno de Sucesso (201 Created):
```

```JSON
{
  "message": "Log gravado com sucesso!",
  "id": "59EBYZ4BZUZarLvIs9O7"
}
```

## 🛣️ Próximos Passos (Roadmap)
[x] Criação da API de ingestão em Node.js.

[x] Integração com Elasticsearch para indexação dinâmica.

[x] Parametrização via arquivo LogsConfig.ini.

[x] Compilação do projeto Node.js em um arquivo executável (.exe) para implantação on-premise.

[ ] Criação de painéis (Dashboards) padronizados no Kibana.
