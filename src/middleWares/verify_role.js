import { notAuth } from "./handle_errors"

export const isAdmin =(req, res, next) => { //check admin
    const { role_code } = req.user //lấy được role_code khi request user
    if (role_code!== 'R1') return notAuth('Require role admin', res)
    next()
}
export const isModeratorOrAdmin =(req, res, next) => { //check moderator
    const { role_code } = req.user //lấy được role_code khi request user
    if (role_code!== 'R1' && role_code!== 'R2') return notAuth('Require role moderator or Admin', res)
    //Nếu role không phải R1 và R2 tức là không xác minh được là R1 và R2 thì yêu cầu 1 trong 2 role này
    next()
}