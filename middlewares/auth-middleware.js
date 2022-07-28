const jwt = require('jsonwebtoken');
// const  User  = require("../schemas/user");
const { User } = require('../models/index');

// 사용자 인증 미들웨어
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const [tokenType, tokenValue] = authorization.split(' ');

  if (tokenType !== 'Bearer') {
    res.status(401).send({
      errMessage: '로그인 후 사용하세요.',
    });
    return;
  }

  try {
    const { userId } = jwt.verify(tokenValue, 'sparta');
    User.findByPk(userId).then((user) => {
      res.locals.user = user;
      next();
    });
  } catch (error) {
    res.status(401).send({
      errMessage: '로그인 후 사용하세요.',
    });
    return;
  }
};
