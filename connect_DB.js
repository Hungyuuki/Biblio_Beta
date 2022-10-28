const { Sequelize } = require('sequelize');
//file này để import Sequelize để sử dụng mySQL
const sequelize = new Sequelize('user_management_using_nodejs', 'root', null, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
})


//Test kết nối với DB trên phpMyAdmin
const connectionDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}


//Khi index.js chạy mà chạy tới file này thì sẽ callback hàm này để test kết nối ngay trên file này luôn
connectionDatabase();