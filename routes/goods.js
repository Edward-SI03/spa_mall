const express = require('express');
const router = express.Router();
// const Cart = require("../schemas/cart");
// const Goods = require("../schemas/goods");
const { User, Goods, Cart } = require('../models/index');
const { Op } = require('sequelize');
const authMiddleware = require('../middlewares/auth-middleware');

// 전체 상품 목록 보기
router.get('/goods', authMiddleware, async (req, res) => {
  const { category } = req.query;

  const goods = await Goods.findAll({
    order: [['goodsId', 'desc']],
    where: category ? { category } : undefined,
  });
  res.json({ goods: goods });
  // 키벨류 값이 같으면
  // res.json({goods:goods}) 로 작성가능(비할당 구조화, 비구조화)
});

// 장바구니 상품보기
router.get('/goods/cart', authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const cart = await Cart.findAll({
    where: { userId },
  });

  const goodsIds = cart.map((c) => c.goodsId);

  // 루프 줄이기 위해 Mapping 가능한 객체로 만든것
  const goodsKeyById = await Goods.findAll({
    where: {
      goodsId: goodsIds,
    },
  }).then((goods) =>
    goods.reduce(
      (prev, g) => ({
        ...prev,
        [g.goodsId]: g,
      }),
      {}
    )
  );

  res.send({
    cart: cart.map((c) => ({
      quantity: c.quantity,
      goods: goodsKeyById[c.goodsId],
    })),
  });

  // const carts = await Cart.find(userId);
  // const goodsIds = carts.map((cart) => cart.goodsId);
  // const goods = await Goods.find({ goodsIds: goodsIds  });

  // res.json({
  //   cart: carts.map((cart) => {
  //     return {
  //       quantity: cart.quantity,
  //       goods: goods.find((item) => {
  //         return item.goodsId === cart.goodsId;
  //       }),
  //     };
  //   }),
  // });
});

// 제품 상세보기 구버전
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

// 제품 상세조회
router.get('/goods/:goodsId', authMiddleware, async (req, res) => {
  const { goodsId } = req.params;

  const goods = await Goods.findByPk(goodsId);

  // const [detail] = goods.filter((item) => item.goodsId === Number(goodsId))
  res.json({ goods });
});

// 상품 장바구니에 담기(원래 상품담기인데 put 으로 통일함)
// router.post("/goods/:goodsId/cart", async (req,res)=>{
//     const {goodsId} = req.params
//     const {quantity} = req.body

//     const existcarts = await Cart.find({goodsId: Number(goodsId)})
//     if(existcarts.length){
//         return res.status(400).json({success: false, errMsg:"이미 장바구니에 상품이 들어있습니다."})
//     }
//     await Cart.create({ goodsId:Number(goodsId), quantity})
//     res.json({success:true})
// })

// 장바구니에서 제품 삭제
router.delete('/goods/:goodsId/cart', authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { goodsId } = req.params;

  const existcarts = await Cart.findOne({
    where: {
      userId,
      goodsId,
    },
  });
  if (existcarts) {
    await existcarts.destroy();
  }
  res.json({ success: true });
});

// 장바구니 제품 추가 및 수정
router.put('/goods/:goodsId/cart', authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { goodsId } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) {
    return res
      .status(400)
      .json({ success: false, errMsg: '수량은 1이상으로 설정해주세요.' });
  }

  const existcarts = await Cart.findOne({ where: { userId, goodsId } });
  if (!existcarts) {
    await Cart.create({ userId, goodsId, quantity });
    // return res.status(400).json({success: false, errMsg:"장바구니에 해당 상품이 없습니다."})
  } else {
    await Cart.update({ quantity }, { where: { goodsId } });
  }

  res.json({ success: true });
});

// POST 메소드의 특징은 GET 메소드와는 다르게 body 라는 추가적인 정보를 담아 서버에 전달 할 수 있기 때문에
// 정보값을 body라는 이름으로 넘겨줄 예정
router.post('/goods', async (req, res) => {
  const { name, thumbnailUrl, category, price } = req.body;

  // const goods = await Goods.find();

  // if (goods.length) {
  //   return res
  //     .status(400)
  //     .json({ success: false, errMsg: "이미 있는 데이터 입니다." });
  // }

  const createdGoods = await Goods.create({
    name,
    thumbnailUrl,
    category,
    price,
  });
  res.json({ goods: createdGoods });
});

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
