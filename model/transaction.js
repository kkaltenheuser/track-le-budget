// dependencies
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//transaction schema
const transactionSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Enter a name for transaction"
    },
    value: {
      type: Number,
      required: "Enter an amount"
    },
    date: {
      type: Date,
      default: Date.now
    }
  }
);

// transaction var
const Transaction = mongoose.model("Transaction", transactionSchema);

// export
module.exports = Transaction;