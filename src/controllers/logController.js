const client = require('../config/elastic'); // Importa a conexão com o banco
const config = require('../config/loadConfig'); // Importa o leitor do .ini
const crypto = require('crypto');

// Pega o nome do índice do .ini (se não achar, usa um padrão por segurança)
const NOME_INDICE = config.ELASTICSEARCH.INDEX || 'meus-logs-app';

exports.inserirLog = async (req, res) => {
  try {
    const logData = req.body;

    if (!logData.timestamp) {
      logData.timestamp = new Date().toISOString();
    }

    // Gera um ID único para o registro
    logData.id_unico_log = crypto.randomUUID();  

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
      termo, 
      dataInicio, 
      dataFim,
      size,
      ultimoTimestamp,     
      ultimoIdUnico,      
      ...filtrosDinamicos // Para filtrar de forma dinamica o nome das colunas
    } = req.query;

    let queryElastic = {
      bool: {
        must: []
      }
    };

    for (const coluna in filtrosDinamicos) {
      const valor = filtrosDinamicos[coluna];
      if (valor) {
        const ehNumero = /^-?\d+(\.\d+)?$/.test(valor);
        if (ehNumero) {
          queryElastic.bool.must.push({
            match: { [coluna]: valor }
          });
        } else {
          queryElastic.bool.must.push({
            query_string: { 
              default_field: coluna, 
              query: `*${valor}*` 
            }
          });
        }
      }
    }

    if (termo) {
      queryElastic.bool.must.push({
        query_string: { query: `*${termo}*` }
      });
    }

    if (dataInicio || dataFim) {
      let filtroData = { range: { "timestamp": {} } };
      if (dataInicio) filtroData.range.timestamp.gte = dataInicio;
      if (dataFim) filtroData.range.timestamp.lte = dataFim;
      queryElastic.bool.must.push(filtroData);
    }

    let limiteResultados = size ? parseInt(size, 10) : 100;

    // Trava de segurança para não quebrar a janela padrão de 10k do Elasticsearch
    if (limiteResultados > 10000) {
      limiteResultados = 10000;
    }
    
    // Monta a estrutura da chamada
    let opcoesBusca = {
      index: `${NOME_INDICE}*`, 
      size: limiteResultados, 
      query: queryElastic,
      sort: [ 
        { "timestamp": { order: "desc" } },
        { "id_unico_log.keyword": { order: "desc" } } // Campo otimizado que nós mesmos criamos
      ] 
    };

    if (ultimoTimestamp && ultimoIdUnico) {
      const timestampNumerico = Number(ultimoTimestamp);
      opcoesBusca.search_after = [timestampNumerico, ultimoIdUnico];
    }

    // Executa a busca no banco NoSQL
    const resultado = await client.search(opcoesBusca);

    // Mapeia o array com as informações dos logs (_source)
    const logsEncontrados = resultado.hits.hits.map(hit => hit._source);

    // Lógica para descobrir o marcador da próxima página:
    let proximoTimestamp = null;
    let proximoIdUnico = null;
    
    if (resultado.hits.hits.length > 0) {
      const ultimoHit = resultado.hits.hits[resultado.hits.hits.length - 1];
      proximoTimestamp = ultimoHit.sort[0]; 
      proximoIdUnico = ultimoHit.sort[1];
    }

    // Retorna o pacote pronto com os logs e a indicação de paginação
    return res.status(200).json({
      total: resultado.hits.total.value, 
      logs: logsEncontrados,             
      proximaPagina: proximoTimestamp ? {
        ultimoTimestamp: proximoTimestamp,
        ultimoIdUnico: proximoIdUnico
      } : null 
    });

  } catch (erro) {
    console.error('Erro ao consultar logs:', erro);
    return res.status(500).json({ error: 'Erro ao buscar dados no Elasticsearch' });
  }
};