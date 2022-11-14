import * as controllers from '../controllers'
import express from 'express'
import verifyToken from '../middleWares/verify_token'
import {isCreatorOrAdmin} from '../middleWares/verify_role'
import uploadCloud from '../middleWares/uploader'

const router = express.Router()
//Public routes
router.get('/', controllers.getBooks) //get ra book, callback hàm getBooks của controllers
//Private routes
router.use(verifyToken) //đặt lệnh này trước để verify token(xác minh token) trước, nếu verify được
router.use(isCreatorOrAdmin) //Lấy role_user, tức là thỏa 2 điều kiện dòng 7 và 8 thì chạy xuống dòng dưới
// router.get('/', controllers.getCurrentUser) //thì mới chạy được xuống đây để get ra user hiện tại
router.post('/', uploadCloud.single('image'), controllers.createNewBook) 
//gắn data của image vào request, để qua được bước này sẽ tới controller lấy được data đó trả res về cho ng dùng
router.put('/', uploadCloud.single('image'), controllers.updateBook)
router.delete('/', controllers.deleteBook)//vì không cần up ảnh nên không cần middleware
module.exports = router

//uploadCloud.single('image') là một middleware, thì trong khi định hướng các route thì ta truyền vào param thứ 1 là /, param thứ 2, param thứ 3 là res trả về người dùng,
// tức là các middleware sẽ đứng giữa param thứ 1 là req, và param cuối là res