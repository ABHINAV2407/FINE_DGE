const express = require('express');
const transactionController = require('../controllers/transactionController');
const {authMiddleware} = require('../middlewares/authMiddleware');
const transactionRoute = express.Router();

transactionRoute.post("/",authMiddleware, transactionController.createTransactionHandler);
transactionRoute.get("/",authMiddleware, transactionController.getAllTransactionHandler);
transactionRoute.get("/:id",authMiddleware, transactionController.getTransactionHandler);
transactionRoute.patch("/:id",authMiddleware, transactionController.updateTransactionHandler);
transactionRoute.delete("/:id",authMiddleware, transactionController.deleteTransactionHandler);


module.exports = {
  transactionRoute
}
