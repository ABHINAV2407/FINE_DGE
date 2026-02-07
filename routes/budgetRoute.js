const express = require('express');
const budgetController = require('../controllers/budgetController');
const {authMiddleware} = require('../middlewares/authMiddleware');
const budgetRoute = express.Router();

budgetRoute.post("/", authMiddleware, budgetController.upsertBudgetHandler);
budgetRoute.get("/", authMiddleware, budgetController.getBudgetHandler);
budgetRoute.get("/report", authMiddleware, budgetController.getBudgetReportHandler);

module.exports = {
  budgetRoute
}