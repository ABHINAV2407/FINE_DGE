const express = require('express');
const summaryController = require('../controllers/summaryController');
const {authMiddleware} = require('../middlewares/authMiddleware');
const summaryRoute = express.Router();

summaryRoute.get("/",authMiddleware, summaryController.getSummaryHandler);

module.exports = {
  summaryRoute
}