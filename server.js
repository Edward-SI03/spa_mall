const http = require("./app")
require("./socket")
const port = 3000;

http.listen(port, () => {
    console.log(port, '포트로 서버가 열렸어요!');
  });