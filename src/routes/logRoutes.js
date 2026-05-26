const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');

// Define a rota POST em /api/InsereLogs
router.post('/InsereLogs', logController.inserirLog);

// Define a rota GET em /api/ConsultarLogs
router.get('/ConsultarLogs', logController.consultarLogs);

module.exports = router;