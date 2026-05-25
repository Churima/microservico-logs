const express = require('express');
const logRoutes = require('./routes/logRoutes');
const config = require('./config/loadConfig'); // Importa o leitor do .ini

const app = express();

// Permite que o Express entenda JSON no corpo (body) das requisições
app.use(express.json());

// Registra as rotas
app.use('/api', logRoutes);

// Pega a porta da seção [SERVER] do arquivo .ini
const PORT = config.SERVER.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Microserviço rodando na porta ${PORT}`);
});