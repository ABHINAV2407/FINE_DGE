const express = require('express');
const healthController = require('../controllers/healthController');
const healthRoute = express.Router();

healthRoute.get("/", healthController.healthHandler);

module.exports = {
  healthRoute
}