const mongoose = require("mongoose");
const TransactionModel = require("../models/transactionModel");
const cacheService = require("../services/cacheService");

const getSummaryHandler = async (req, res) => {

  const userId = req.user.userId;
  const cacheKey = `summary:${userId}`;
  const cached = cacheService.get(cacheKey);
  if (cached) {
    const income = cached.find(s => s._id === "income")?.total || 0;
    const expense = cached.find(s => s._id === "expense")?.total || 0;
    return res.status(200).json({
      success: true,
      source: "cache",
      income,
      expense,
    });
  }

  const summary = await TransactionModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(req.user.userId)
      }
    },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" }
      }
    }
  ]);

  cacheService.set(cacheKey, summary, 15 * 1000);

  const income =
    summary.find(s => s._id === "income")?.total || 0;
  const expense =
    summary.find(s => s._id === "expense")?.total || 0;

  res.status(200).json({
    success: true,
    source: "DB",
    income,
    expense,
  });

}



const getMonthlyTrendsHandler = async (req, res) => {
  const userId = req.user.userId;
  const trends = await TransactionModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
        },
        income: {
          $sum: {
            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
          },
        },
        expense: {
          $sum: {
            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
          },
        },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);

  const data =  trends.map((t) => ({
    year: t._id.year,
    month: t._id.month,
    income: t.income,
    expense: t.expense,
    balance: t.income - t.expense,
  }));

    res.status(200).json({
    success: true,
    message : 'Monthly trend report fetched successfully.',
    data
  });
};


module.exports = {
  getSummaryHandler,
  getMonthlyTrendsHandler
}