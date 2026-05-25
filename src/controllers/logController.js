const elasticClient = require('../config/elastic');

exports.createLog = async (req, res) => {
  try {
    const logData = req.body;

    // Se o JSON estiver vazio, retorna erro
    if (!logData || Object.keys(logData).length === 0) {
      return res.status(400).json({ error: 'O corpo da requisição não pode estar vazio.' });
    }

    // Grava no Elasticsearch
    // 'index' é o nome da "tabela" onde os dados ficarão salvos
    const result = await elasticClient.index({
      index: 'meus-logs-app',
      document: {
        timestamp: new Date(), // Adiciona a data/hora automaticamente
        ...logData            // Espalha todas as chaves do seu JSON dinamicamente
      }
    });

    return res.status(201).json({
      message: 'Log gravado com sucesso!',
      id: result._id
    });

  } catch (error) {
    console.error('Erro ao gravar log:', error);
    return res.status(500).json({ error: 'Erro interno no servidor ao gravar o log.' });
  }
};