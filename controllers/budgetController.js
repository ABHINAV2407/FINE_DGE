const Budget = require("../models/budgetModel");
const budgetService = require("../services/budgetService")
const ApiError = require("../util/apiError");

const upsertBudgetHandler = async (req, res) => {
  const { monthlyGoal, savingsTarget } = req.body;

  if (monthlyGoal === undefined || savingsTarget === undefined) {
    throw new ValidationError("monthlyGoal and savingsTarget are required");
  }

  if (typeof monthlyGoal !== "number" || typeof savingsTarget !== "number") {
    throw new ValidationError("monthlyGoal and savingsTarget must be numbers");
  }

  if (monthlyGoal <= 0) {
    throw new ValidationError("monthlyGoal must be greater than 0");
  }

  if (savingsTarget < 0) {
    throw new ValidationError("savingsTarget cannot be negative");
  }

  const userId = req.user.userId;

  const budget = await Budget.findOneAndUpdate(
    { user: userId },
    req.body,
    { new: true, upsert: true }
  );

  res.status(200).json({ success: true, data: budget });
};

const getBudgetHandler = async (req, res) => {
  const userId = req.user.userId;

  const budget = await Budget.findOne({ user: userId });

  res.json({ success: true, data: budget });
};

const getBudgetReportHandler = async (req, res) => {
  const userId = req.user.userId;

  const report = await budgetService.getBudgetReport(userId);

  res.json({ success: true, data: report });
};

module.exports = {
  upsertBudgetHandler,
  getBudgetHandler,
  getBudgetReportHandler
}
