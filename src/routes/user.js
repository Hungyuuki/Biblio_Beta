import * as controllers from '../controllers'
import express from 'express'
import verifyToken from '../middleWares/verify_token'

const router = express.Router()
//Private routes
router.use(verifyToken) //đặt lệnh này trước để verify token(xác minh token) trước, nếu verify được
// router.use(isModeratorOrAdmin) //Lấy role_user, tức là thỏa 2 điều kiện dòng 7 và 8 thì chạy xuống dòng dưới
router.get('/', controllers.getCurrentUser) //thì mới chạy được xuống đây để get ra user hiện tại
module.exports = router
