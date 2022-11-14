import express from 'express';
import cors from 'cors';
require('dotenv').config();//dùng file môi trường
import initRoutes from './src/routes'
require('./connect_DB');
const app = express();  //tạo server, cần biến app để thực hiện các hành vi của express, giữ Express application mới của mình
app.use(cors({   //cấu hình cors để bao gồm client phải có 2 điều kiện dưới đây
    origin: process.env.CLIENT_URL,               //lấy biến CLIENT_URL trong file .env
    methods: ['GET', 'POST', 'PUT', 'DELETE']      //khai báo 4 method để CRUD
}));

app.use(express.json())   //để server đọc được thông tin của client gửi lên, nếu có thông tin là một string thì sẽ convert thông tin đó sang một đối tượng json
app.use(express.urlencoded({extended: true})) //cái này để cấu trúc lại dữ liệu ng dùng truyefn vào, + đọc thông tin nếu người dùng gửi lên là mảng hoặc object dạng json
initRoutes(app);
app.use((err, req, res, next) => { //cấu hình server nếu vào sai đường dẫn '/' thì sẽ hiện ra một response như sau:
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
  });

const PORT = process.env.PORT || 8888;
const listener = app.listen(PORT, () => {  //kiểm tra port đang chạy bằng cách dùng hàm listen để truyền PORT hiện tại vào và console.log ra port, tham số đầu tiên là một PORT
   console.log('Server is running on the port ' + listener.address().port)  //tham số thứ 2 là một callback, tức là listen PORT xong rồi mới ném ra một dòng thông báo
});
//listen event giống như là event handler, hoặc mouseHandler nhưng chỉ bắt 1 sự kiện trong số các sự kiện thay vì bắt tất cả