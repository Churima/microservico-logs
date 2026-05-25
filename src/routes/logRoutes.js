const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');

// Define a rota POST em /api/InsereLogs
router.post('/InsereLogs', logController.createLog);

module.exports = router;