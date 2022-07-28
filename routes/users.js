const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Joi = require('joi');
// const  User  = require("../schemas/user");
const { User } = require('../models/index');
const { Op } = require('sequelize');
const authMiddleware = require('../middlewares/auth-middleware');

// 회원가입
const postUserSchema = Joi.object({
  nickname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
});

router.post('/users', async (req, res) => {
  try {
    const { nickname, email, password, confirmPassword } =
      await postUserSchema.validateAsync(req.body);

    if (password !== confirmPassword) {
      res.status(400).send({
        errorMessage: '패스워드가 일치 하지 않습니다.',
      });
      return;
    }

    const existUsers = await User.findAll({
      where: {
        [Op.or]: [{ nickname }, { email }],
      },
    });

    if (existUsers.length) {
      res.status(400).send({
        errorMessage: '이미 가입된 이메일 또는 닉네임이 있습니다.',
      });
      return;
    }
    await User.create({ email, nickname, password });
    res.status(201).send({});
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
    });
  }
});

// 로그인
const postAuthSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
router.post('/auth', async (req, res) => {
  try {
    const { email, password } = await postAuthSchema.validateAsync(req.body);

    const user = await User.findOne({ where: { email, password } });

    if (!user) {
      res.status(400).send({
        errorMessage: '이메일 또는 비밀번호가 맞지 않습니다.',
      });
      return;
    }

    const token = jwt.sign({ userId: user.userId }, 'sparta');
    res.send({ token });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
    });
  }
});

// 내 정보 조회(사용자 인증 미들웨어에서 인증된 값을 가져와서 로그인여부를 확인)
router.get('/users/me', authMiddleware, async (req, res) => {
  const { user } = res.locals;
  res.send({
    user: {
      email: user.email,
      nickname: user.nickname,
    },
  });
});

module.exports = router;
