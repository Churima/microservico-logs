const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

const client = new Client({
  node: process.env.ELASTIC_NODE
});

// Testa a conexão ao iniciar
client.ping()
  .then(() => console.log('Conectado ao Elasticsearch com sucesso!'))
  .catch(err => console.error('Erro ao conectar no Elasticsearch:', err));

module.exports = client;