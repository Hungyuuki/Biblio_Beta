const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');//import multer-storage-cloudinary để cloudinary chấp nhận storage để lưu ảnh png
const multer = require('multer');
require('dotenv').config() //không có còng này thì sẽ không đọc được dòng 6 nên sẽ không kết nối được lên cloundinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg', 'png'],
  params: {
    folder: 'IRIDGE'
  }
});

const uploadCloud = multer({ storage }); //khai báo lưu trữ trong storage của multer

module.exports = uploadCloud;
