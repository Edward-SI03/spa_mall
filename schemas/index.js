const mongoose = require('mongoose');

// 몽구스를 이용하여 데이터베이스에 연결
// 두번째 인자 igmoreUndefined: true 를 넣으면 undefined 인 값들은 무시
const connect = () => {
  mongoose.connect('mongodb://localhost:27017/spa_mall', {
    ignoreUndefined: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
};

module.exports = connect;
