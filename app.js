const express = require('express')
const app = express()
const port = 3000

// use는 미들웨어를 사용할수 있게 해줌
// next()를 사용해야 다른 미들웨어도 사용 가능, 안하면 거기서 멈춤
// app.use((req, res, next) => {
//     console.log("미들웨어 사용")
//     next()
// })

const requstMiddleware = (req, res, next)=>{
    console.log("request : ", req.originalUrl, " - ", new Date())
    next()
}

app.use(requstMiddleware)

// /api 로 시작되는 주소는 routes/goods.js 에 있는 Router 미들웨어를 통해 처리
const goodsRouter = require("./routes/goods");
app.use("/api", [goodsRouter]);

// get도 사실 미들웨어
app.get('/', (req, res) =>{
    res.send('Hello World!')
})

// listen은 express로 만든 웹서버를 실행시켜줌
app.listen(port, () => {
    console.log(port, "포트로 서버가 열렸어요!")
})

