const express = require('express');
const dotenv = require('dotenv');
const {healthRoute} = require('./routes/healthRoute');
const {authRoute} = require('./routes/authRoute');
const {transactionRoute} = require('./routes/transactionRoute');
const {summaryRoute} = require('./routes/summaryRoute');
const connectDB = require('./config/db')
dotenv.config();

connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/health", healthRoute);
app.use("/users",authRoute);
app.use("/transactions",transactionRoute);
app.use('/summary',summaryRoute)

const port = process.env.PORT || 8080;
app.listen(port, (err) => {
  if (err) {
    return console.log('Something bad happened', err);
  }
  console.log(`Server is running on ${port}`);
});

module.exports = app;