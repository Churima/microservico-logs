const { Client } = require('@elastic/elasticsearch');
const config = require('./loadConfig');

const client = new Client({
  node: config.ELASTICSEARCH.NODE
});

client.ping()
  .then(() => console.log('Conectado ao Elasticsearch com sucesso!'))
  .catch(err => console.error('Erro ao conectar no Elasticsearch:', err));

module.exports = client;