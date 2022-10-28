import jwt from 'jsonwebtoken';
import { notAuth } from './handle_errors';
const verifyToken = (req, res, next) => {
  //next: chạy xong đối tượng này rồi sẽ chạy qua đối tượng khác
  const token = req.headers.authorization
  if (!token) return notAuth('Require authorization', res)

  const accessToken = token.split(' ')[1]
  //tách chuỗi access_token ra làm 2 bằng 1 dấu cách, và cho vào một mảng 2 phần tử, thì phần tử thứ 1 là chuỗi Bearer
  //phần tử thứ 2 là đoạn token dùng để gắn token vào header
  jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
    //verify một đối tượng user đã được trả về sau khi giải mã đoạn token
    if (err) return notAuth('Access token may be expired or invalid', res)
    req.user = user
    next()
  });
};

export default verifyToken
