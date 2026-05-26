const client = require('../config/elastic'); // Importa a conexão com o banco
const config = require('../config/loadConfig'); // Importa o leitor do .ini

// Pega o nome do índice do .ini (se não achar, usa um padrão por segurança)
const NOME_INDICE = config.ELASTICSEARCH.INDEX || 'meus-logs-app';

exports.inserirLog = async (req, res) => {
  try {
    const logData = req.body;

    if (!logData.timestamp) {
      logData.timestamp = new Date().toISOString();
    }

    // Grava usando o nome do índice que veio do .ini
    const resultado = await client.index({
      index: NOME_INDICE,
      document: logData
    });

    return res.status(201).json({
      message: "Log gravado com sucesso!",
      id: resultado._id
    });

  } catch (erro) {
    console.error('Erro ao inserir log:', erro);
    return res.status(500).json({ error: 'Erro ao gravar no banco de dados' });
  }
};

exports.consultarLogs = async (req, res) => {
  try {
    const { 
      tipoLog, 
      tipoPrograma, 
      idintegracaoEcommerce, 
      observacao, 
      descricao, 
      termo, 
      dataInicio, 
      dataFim,
      size
    } = req.query;

    let queryElastic = {
      bool: {
        must: []
      }
    };

    if (tipoLog) {
      queryElastic.bool.must.push({
        query_string: { 
          default_field: "TipoLog", 
          query: `*${tipoLog}*` 
        }
      });
    }

    if (tipoPrograma) {
      queryElastic.bool.must.push({
        query_string: { 
          default_field: "TipoPrograma", 
          query: `*${tipoPrograma}*` 
        }
      });
    }

    if (idintegracaoEcommerce) {
      queryElastic.bool.must.push({
        query_string: { 
          default_field: "Conteudo.IdIntegracaoEcommerce", 
          query: `*${idintegracaoEcommerce}*` 
        }
      });
    }

    if (observacao) {
      queryElastic.bool.must.push({
        query_string: { 
          default_field: "Conteudo.Observacao", 
          query: `*${observacao}*` 
        }
      });
    }

    if (descricao) {
      queryElastic.bool.must.push({
        query_string: { 
          default_field: "Conteudo.Descricao", 
          query: `*${descricao}*` 
        }
      });
    }

    if (termo) {
      queryElastic.bool.must.push({
        query_string: { query: `*${termo}*` }
      });
    }

    if (dataInicio || dataFim) {
      let filtroData = {
        range: {
          "timestamp": {} 
        }
      };

      if (dataInicio) {
        filtroData.range.timestamp.gte = dataInicio;
      }
      
      if (dataFim) {
        filtroData.range.timestamp.lte = dataFim;
      }

      queryElastic.bool.must.push(filtroData);
    }

    const limiteResultados = size ? parseInt(size, 10) : 100;

    if (limiteResultados > 10000) {
      limiteResultados = 10000;
    }
    
    // Busca usando o índice do .ini (colocamos o * no final para buscar qualquer variação de data se houver)
    const resultado = await client.search({
      index: `${NOME_INDICE}*`, 
      size: limiteResultados, 
      query: queryElastic,
      sort: [ { "timestamp": { order: "desc" } } ]
    });

    const logsEncontrados = resultado.hits.hits.map(hit => hit._source);

    return res.status(200).json({
      total: resultado.hits.total.value,
      logs: logsEncontrados
    });

  } catch (erro) {
    console.error('Erro ao consultar logs:', erro);
    return res.status(500).json({ error: 'Erro ao buscar dados no Elasticsearch' });
  }
};