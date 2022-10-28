import * as services from "../services";
import { interalServerError } from "../middleWares/handle_errors";


//READ
export const getBooks = async (req, res) => {
  try {
    const response = await services.getBooks(req.query);
    //truyền req.query của người dùng hiện tại vào hàm để lấy response
    return res.status(200).json(response);
  } catch (error) {
    return interalServerError(res);
  }
};

//CREATE
export const createNewBook = async (req, res) => {
  try {
    if(!body.title || !body.price || !body.available || !body.category_code || !body.image){
      return res.status(400).json({
        err: 1,
        mess: "Missing input"
      })
    }
    const response = await services.createNewBook(req.query);
    //truyền req.query của người dùng hiện tại vào hàm để lấy response
    return res.status(200).json(response);
  } catch (error) {
    return interalServerError(res);
  }
};
