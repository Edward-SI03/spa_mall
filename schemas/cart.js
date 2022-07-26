const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: {
    type: String,
  },
  goodsId: {
    type: String,
    // required: true,
    // unique:true,
  },
  quantity: {
    type: Number,
    // required:true,
  },
});

module.exports = mongoose.model("Cart", schema);
