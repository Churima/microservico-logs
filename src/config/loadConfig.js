const fs = require('fs');
const path = require('path');
const ini = require('ini');

// Se o projeto estiver rodando como .exe, ele pega a pasta do executável externo.
// Se estiver em modo de desenvolvimento, ele pega a raiz do projeto.
const rootDir = process.pkg 
  ? path.dirname(process.execPath) 
  : path.resolve(__dirname, '../../');

const iniPath = path.join(rootDir, 'LogsConfig.ini');

let config = {
  SERVER: { PORT: 8080 },
  ELASTICSEARCH: { NODE: 'http://localhost:9200' }
};

// Verifica se o arquivo .ini existe antes de tentar ler
if (fs.existsSync(iniPath)) {
  const fileContent = fs.readFileSync(iniPath, 'utf-8');
  config = ini.parse(fileContent);
  console.log(`Configurações carregadas do arquivo: ${iniPath}`);
} else {
  console.warn(`Arquivo LogsConfig.ini não encontrado em: ${iniPath}. Usando padrões do sistema.`);
}

module.exports = config;