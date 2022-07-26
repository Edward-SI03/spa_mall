const mongoose = require("mongoose");

// mongoose 활용법 - schema를 생성하여 데이터를 관리하기 위해 모델을 작성
const goodsSchema = mongoose.Schema({
  // goodsId:{
  //     type:Number,
  //     required: true,
  //     unique:true,
  // },
  name: {
    type: String,
    // required:true,
    // unique:true,
  },
  thumbnailUrl: {
    type: String,
  },
  category: {
    type: String,
  },
  price: {
    type: Number,
  },
});
goodsSchema.virtual("goodsId").get(function () {
  return this._id.toHexString();
});
goodsSchema.set("toJSON", {
  virtuals: true,
});

// 모델 작성
module.exports = mongoose.model("Goods", goodsSchema);
