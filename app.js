const express = require('express');
const Http = require('http');

const app = express();
// http가 express 서버를 상속받아서 확장해줌
const http = Http.createServer(app);
const port = 3000;
const router = express.Router();

// index.js는 생략 가능
// const connect = require("./schemas");
// connect();

// use는 미들웨어를 사용할수 있게 해줌
// next()를 사용해야 다른 미들웨어도 사용 가능, 안하면 거기서 멈춤
// app.use((req, res, next) => {
//     console.log("미들웨어 사용")
//     next()
// })

// const requstMiddleware = (req, res, next) => {
//   console.log("request : ", req.originalUrl, " - ", new Date());
//   next();
// };

// 정적파일(api요청이나 다름 값들로 바뀌는 게아닌 파일들)들을 가져와 서버에 적용
app.use(express.static('assets'));

// body로 전달받은 json데이터는 바로 사용 불가능
// json미들웨어를 통해 body로 들어오는 json을 파싱 해줌
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use("/", express.urlencoded({ extended: false }), router);
// app.use(requstMiddleware);

// /api 로 시작되는 주소는 routes/goods.js 에 있는 Router 미들웨어를 통해 처리
const usertRouter = require('./routes/users');
const goodsRouter = require('./routes/goods');
app.use('/api', [usertRouter, goodsRouter]);

// get도 사실 미들웨어
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// listen은 express로 만든 웹서버를 실행시켜줌
// http.listen(port, () => {
//   console.log(port, '포트로 서버가 열렸어요!');
// });

module.exports = http