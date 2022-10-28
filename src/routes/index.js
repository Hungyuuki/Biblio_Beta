import user from "./user";
import auth from "./auth";
import insert from "./insert"
import book from "./book"
import { notFound } from "../middleWares/handle_errors";
//nội dung của file user.js sẽ được thể hiện khi ta gọi bằng đường dẫn đã được cấu hình dưới đây.
const initRoutes = (app) => {
  app.use('/api/v1/user', user)
  app.use('/api/v1/auth', auth)
  app.use('/api/v1/insert', insert) 
  app.use('/api/v1/book', book) 

  //định nghĩa route
  // app.use('/', (req, res) => {  //cấu hình một callback
  //trả về một res mỗi khi có req được gửi đến server
  // return res.send('***** Server is avaiable *****')
  //dòng trên điều hướng 1 route(tham số đầu tiên) tới một res(tham số thứ 2) được định nghĩa bên controller
  //dòng dưới điều hướng 1 route tới một res được định nghĩa ở dòng 8(tương tự)

  app.use(notFound);
}
module.exports = initRoutes
