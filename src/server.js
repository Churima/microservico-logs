require('dotenv').config();
const express = require('express');
const logRoutes = require('./routes/logRoutes');

const app = express();

// Permite que o Express entenda JSON no corpo (body) das requisições
app.use(express.json());

// Registra as rotas
app.use('/api', logRoutes);

// Pega a porta do arquivo .env ou usa a 8080 como fallback
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Microserviço rodando na porta ${PORT}`);
});