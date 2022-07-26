const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../schemas/user");
const authMiddleware = require("../middlewares/auth-middleware");

// 회원가입
router.post("/users", async (req, res) => {
  const { nickname, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.status(400).send({ errorMessage: "패스워드가 일치 하지 않습니다." });
    return;
  }

  const existUsers = await User.find({
    $or: [{ nickname }, { email }],
  });

  if (existUsers.length) {
    res
      .status(400)
      .send({ errorMessage: "이미 가입된 이메일 또는 닉네임이 있습니다." });
    return;
  }

  const user = new User({ email, nickname, password });
  await user.save();
  res.status(201).send({});
});

// 로그인
router.post("/auth", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });
  if (!user) {
    res.status(400).send({
      errorMessage: "이메일 또는 비밀번호가 맞지 않습니다.",
    });
    return;
  }

  const token = jwt.sign({ userId: user.userId }, "sparta");
  res.send({ token });
});

// 내 정보 조회(사용자 인증 미들웨어에서 인증된 값을 가져와서 로그인여부를 확인)
router.get("/users/me", authMiddleware, async (req, res) => {
  const { user } = res.locals;
  res.send({
    user: {
      email: user.email,
      nickname: user.nickname,
    },
  });
});

module.exports = router;
