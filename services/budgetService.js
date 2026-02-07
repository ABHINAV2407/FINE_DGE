const Budget = require("../models/budgetModel");
const mongoose = require("mongoose");
const TransactionModel = require("../models/transactionModel");

const getBudgetReport = async (userId) => {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);

  const totals = await TransactionModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: start, $lt: end }
      }
    },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" }
      }
    }
  ]);

  let income = 0;
  let expense = 0;

  totals.forEach((t) => {
    if (t._id === "income") income = t.total;
    if (t._id === "expense") expense = t.total;
  });

  const budget = await Budget.findOne({ user: userId });

  if (!budget) {
    return {
      income,
      expense,
      balance: income - expense,
      message: "No budget set"
    };
  }

  const remainingBudget = budget.monthlyGoal - expense;
  const savingsProgress = income - expense;

  return {
    income,
    expense,
    balance: income - expense,
    monthlyGoal: budget.monthlyGoal,
    savingsTarget: budget.savingsTarget,
    remainingBudget,
    savingsProgress,
    isBudgetExceeded: expense > budget.monthlyGoal,
    isSavingsOnTrack: savingsProgress >= budget.savingsTarget
  };
};

module.exports = {
  getBudgetReport
}
