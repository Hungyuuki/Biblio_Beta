import * as services from "../services";
import { interalServerError } from "../middleWares/handle_errors";

export const insertData = async (req, res) => {
  try {
    const response = await services.insertData()//dòng này để gọi hàm insertData xử lý bên phía service
    //truyền id của người dùng hiện tại vào hàm để lấy response
    return res.status(200).json(response)
  } catch (error) {
    return interalServerError(res)
  }
};
