import * as services from "../services";
import { interalServerError, badRequest } from "../middleWares/handle_errors";
import { email, password, userName } from "../helpers/joi_schema";
import joi from "joi";

export const register = async (req, res) => {
  try {
    const { error } = joi
      .object({ userName, email, password })
      .validate(req.body); //đây là một object, ta so cái object này với dữ liệu mình muốn validate
    if (error) return badRequest(error.details[0]?.message, res);
    //Nếu bắt lỗi thì chạy dòng này còn không thì chạy xuống dưới
    const response = await services.register(req.body);
    //truyền phần body của người dùng vào request
    return res.status(200).json(response);
    // return res.status(200).json(error) //trả về error sang màn hình bên phải
  } catch (error) {
    return interalServerError(res);
  }
};

export const login = async (req, res) => {
  try {
    const { error } = joi
      .object({ userName, email, password })
      .validate(req.body); //đây là một object, ta so cái object này với dữ liệu mình muốn validate
    if (error) return badRequest(error.details[0]?.message, res);
    const response = await services.login(req.body);
    //truyền phần body của người dùng vào request
    console.log(req.body)
    return res.status(200).json(response);
  } catch (error) {
    return interalServerError(res);
  }
};
