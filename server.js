const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const morgan = require("morgan");
const {healthRoute} = require('./routes/healthRoute');
const {authRoute} = require('./routes/authRoute');
const {budgetRoute} = require('./routes/budgetRoute');
const {transactionRoute} = require('./routes/transactionRoute');
const {summaryRoute} = require('./routes/summaryRoute');
const errorHandler = require('./middlewares/globalErrorHandler');
const rateLimiter = require("./middlewares/rateLimiter");
const connectDB = require('./config/db')

dotenv.config();

connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use(rateLimiter);

app.use("/health", healthRoute);
app.use("/users",authRoute);
app.use("/transactions",transactionRoute);
app.use('/summary',summaryRoute);
app.use('/budget',budgetRoute)

app.use(errorHandler);


const port = process.env.PORT || 8080;
app.listen(port, (err) => {
  if (err) {
    return console.log('Something bad happened', err);
  }
  console.log(`Server is running on ${port}`);
});

module.exports = app;