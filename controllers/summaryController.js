const mongoose = require("mongoose");
const TransactionModel = require("../models/transaction.model");

const getSummaryHandler = async (req,res) => {
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

    const income =
      summary.find(s => s._id === "income")?.total || 0;
    const expense =
      summary.find(s => s._id === "expense")?.total || 0;

    res.status(200).json({
      income,
      expense,
    });

}

module.exports = {
  getSummaryHandler
}