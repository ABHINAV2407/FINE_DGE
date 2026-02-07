const TransactionModel = require("../models/transactionModel");
const ApiError = require("../util/apiError");
const ValidationError = require("../util/validationError");
const cacheService = require("../services/cacheService");

const createTransactionHandler = async (req, res) => {

  const { type, category, amount, } = req.body;
  const userId = req.user.userId;

  const transaction = await TransactionModel.create({ userId, type, category, amount });
  cacheService.delete(`summary:${userId}`);
  res.status(200).json(transaction);
};

const getAllTransactionHandler = async (req, res) => {
  const transactions = await TransactionModel.find({ userId: (req.user.userId) });
  res.status(200).json({
    success: true,
    message: 'Transactions fetched Successfully',
    transactions
  });
}

const getTransactionHandler = async (req, res, next) => {
  try {
    const transaction = await TransactionModel.findById(req.params.id);
    if (!transaction) return next(new ApiError(404, 'Transaction not found'));
    res.status(200).json({
      success: true,
      message: 'Transaction fetched Successfully',
      transaction
    });
  } catch (error) {
    error.statusCode = 404;
    error.message = 'Transaction not found';
    return next(error);
  }

}

const updateTransactionHandler = async (req, res, next) => {
  try {
    const updateData = {};

    if (req.body.amount !== undefined) {
      updateData.amount = req.body.amount;
    }

    if (req.body.type !== undefined) {
      updateData.type = req.body.type;
    }

    if (req.body.category !== undefined) {
      updateData.category = req.body.category;
    }

    if (Object.keys(updateData).length === 0) {
      return next(new ApiError(400, 'No valid fields provided for update'));
    }

    const transaction = await TransactionModel.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId
      },
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!transaction) {
      return next(new ApiError(400, 'Transaction not found'));
    }
    cacheService.delete(`summary:${req.user.userId}`);
    res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      transaction
    });

  } catch (error) {
    error.statusCode = 500;
    error.message = 'Failed to update transaction';
    return next(error);

  }
};

const deleteTransactionHandler = async (req, res, next) => {
  const transaction = await TransactionModel.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.userId
  });
  if (!transaction) return next(new ApiError(400, 'Transaction not found'));
  cacheService.delete(`summary:${req.user.userId}`);
  res.status(200).send({
    success: true,
    message: 'transaction deleted Successfully'
  });
};

const getFilteredTransactionsHandler = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { category, startDate, endDate } = req.query;

    const query = { userId };

    if (category) {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};

      if (startDate) {
        query.date.$gte = new Date(startDate);
      }

      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    const data = await TransactionModel.find(query).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });

  } catch (error) {
    next(error);
  }
};



module.exports = {
  createTransactionHandler,
  getAllTransactionHandler,
  getTransactionHandler,
  updateTransactionHandler,
  deleteTransactionHandler,
  getFilteredTransactionsHandler
}