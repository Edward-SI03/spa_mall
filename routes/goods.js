const express = require('express');
const router = express.Router();
const Cart = require("../schemas/cart")
const Goods = require("../schemas/goods")

// router.get('/', (req, res) => {
// 	res.send('this is home page');
// });

// router.get('/about', (req, res) => {
// 	res.send('this is about page');
// });

router.get('/goods', async (req, res) => {

    const {category} = req.query

    const goods = await Goods.find({category})
	res.json({goods:goods})
    // 키벨류 값이 같으면
    // res.json({goods:goods}) 로 작성가능(비할당 구조화, 비구조화)
});

// router.get("/goods/:goodsId", (req, res) => {
//     const goodsId = req.params.goodsId;

//     // console.log(goodsId)
//     // res.send(`goodsId : ${goodsId}`)

//     const filterdItem = goods.filter(item => {
//         return item.goodsId === parseInt(goodsId);
//     })

//     res.json({
//         detail : filterdItem[0]
//     }); 
// });

router.get('/goods/:goodsId', async (req, res) => {
    const {goodsId} = req.params

    const [detail] = await Goods.find({ goodsId: Number(goodsId) })

    // const [detail] = goods.filter((item) => item.goodsId === Number(goodsId))
    res.json({detail:detail})
});

router.post("/goods/:goodsId/cart", async (req,res)=>{
    const {goodsId} = req.params
    const {quantity} = req.body

    const existcarts = await Cart.find({goodsId: Number(goodsId)})
    if(existcarts.length){
        return res.status(400).json({success: false, errMsg:"이미 장바구니에 상품이 들어있습니다."})
    }
    await Cart.create({ goodsId:Number(goodsId), quantity})
    res.json({success:true})
    
})


// POST 메소드의 특징은 GET 메소드와는 다르게 body 라는 추가적인 정보를 담아 서버에 전달 할 수 있기 때문에  
// 정보값을 body라는 이름으로 넘겨줄 예정
router.post("/goods", async (req, res)=>{
    const { goodsId, name, thumbnailUrl, category, price } = req.body

    const goods = await Goods.find({ goodsId })

    if(goods.length){
        return res.status(400).json({ success:false, errMsg:"이미 있는 데이터 입니다." })
    }

    const createdGoods = await Goods.create({ goodsId, name, thumbnailUrl, category, price })
    res.json({goods:createdGoods})
})

module.exports = router;


// const goods = [
//     {
//       goodsId: 4,
//       name: "상품 4",
//       thumbnailUrl:
//         "https://cdn.pixabay.com/photo/2016/09/07/02/11/frogs-1650657_1280.jpg",
//       category: "drink",
//       price: 0.1,
//     },
//     {
//       goodsId: 3,
//       name: "상품 3",
//       thumbnailUrl:
//         "https://cdn.pixabay.com/photo/2016/09/07/02/12/frogs-1650658_1280.jpg",
//       category: "drink",
//       price: 2.2,
//     },
//     {
//       goodsId: 2,
//       name: "상품 2",
//       thumbnailUrl:
//         "https://cdn.pixabay.com/photo/2014/08/26/19/19/wine-428316_1280.jpg",
//       category: "drink",
//       price: 0.11,
//     },
//     {
//       goodsId: 1,
//       name: "상품 1",
//       thumbnailUrl:
//         "https://cdn.pixabay.com/photo/2016/09/07/19/54/wines-1652455_1280.jpg",
//       category: "drink",
//       price: 6.2,
//     },
//   ];