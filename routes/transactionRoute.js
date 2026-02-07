const express = require('express');
const transactionController = require('../controllers/transactionController');
const {authMiddleware} = require('../middlewares/authMiddleware');
const {TransactionInputValidations} = require('../middlewares/validationMiddleware')
const transactionRoute = express.Router();

transactionRoute.post("/",authMiddleware,TransactionInputValidations, transactionController.createTransactionHandler);
transactionRoute.get("/filter",authMiddleware, transactionController.getFilteredTransactionsHandler);
transactionRoute.get("/",authMiddleware, transactionController.getAllTransactionHandler);
transactionRoute.get("/:id",authMiddleware, transactionController.getTransactionHandler);
transactionRoute.patch("/:id",authMiddleware, transactionController.updateTransactionHandler);
transactionRoute.delete("/:id",authMiddleware, transactionController.deleteTransactionHandler);



module.exports = {
  transactionRoute
}
