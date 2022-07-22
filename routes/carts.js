const express = require("express");
const Cart = require("../schemas/cart")
const Goods = require("../schemas/goods")
const router = express.Router();

router.get("/carts", async (req,res)=>{
    const carts = await Cart.find()
    const goodsIds = carts.map(cart => cart.goodsId)
    const goods = await Goods.find({goodsId: goodsIds})
    
    res.json({
        carts:carts.map(cart =>{
            return{
                quantity: cart.quantity,
                goods: goods.find(item=>{
                    return item.goodsId === cart.goodsId
                })
            }
        })
    })
})

module.exports = router