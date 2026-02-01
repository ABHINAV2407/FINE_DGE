const TransactionModel = require("../models/transaction.model");

const createTransactionHandler = async (req, res) => {

  const { type, category, amount, } = req.body;
  const userId = req.user.userId;

  //validation
  if (!type || !category || !amount) {
    return res.status(500).send({
      success: false,
      messgae: 'please provide required fields',
    })
  }
  const transaction = await TransactionModel.create({userId,type,category,amount});
  res.status(200).json(transaction);
};

const getAllTransactionHandler = async (req,res) => {
   const transactions = await TransactionModel.find({userId: (req.user.userId)});
   res.status(200).json({
    success:true,
    message:'Transactions fetched Successfully',
    transactions
});
}

const getTransactionHandler = async (req,res) => {
  try{
      const transaction = await TransactionModel.findById(req.params.id);
      if (!transaction) return res.status(404).json({ error: "Transaction not found" });
       res.status(200).json({
            success:true,
            message:'Transaction fetched Successfully',
            transaction
        });
  }catch(error){
    res.status(404).json({
      success:false,
      message:'Transaction not found',
      error 
    })
  }
  
}

const updateTransactionHandler = async (req, res) => {
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
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update"
      });
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
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      transaction
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update transaction",
      error: error.message
    });
  }
};

const deleteTransactionHandler = async (req, res) => {
  const transaction = await TransactionModel.findOneAndDelete({
  _id: req.params.id,
  userId: req.user.userId
  });
  if (!transaction) return res.status(404).json({success: false, message: "Transaction not found" });
  console.log('i am here')
   res.status(200).send({
    success : true,
    message: 'transaction deleted Successfully'
  });
};


module.exports = {
  createTransactionHandler,
  getAllTransactionHandler,
  getTransactionHandler,
  updateTransactionHandler,
  deleteTransactionHandler
}