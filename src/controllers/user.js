import * as services from "../services";
import { interalServerError } from "../middleWares/handle_errors";

export const getCurrentUser = async (req, res) => {
  try {
    const { id } = req.user
    const response = await services.getUserById(id);
    //truyền id của người dùng hiện tại vào hàm để lấy response
    return res.status(200).json(response);
  } catch (error) {
    return interalServerError(res);
  }
};
