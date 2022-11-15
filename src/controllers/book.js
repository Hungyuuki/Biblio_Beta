import * as services from "../services";
import { badRequest, interalServerError } from "../middleWares/handle_errors";
import {
  title,
  image,
  category_code,
  price,
  available,
  bookid,
  bookids,
  filename,
  description
} from "../helpers/joi_schema";
import joi from "joi";
const cloudinary = require("cloudinary").v2;

//READ
export const getBooks = async (req, res) => {
  try {
    const response = await services.getBooks(req.query);
    //truyền req.query của người dùng hiện tại vào hàm để lấy responsef
    return res.status(200).json(response);
  } catch (error) {
    return interalServerError(res);
  }
};

//CREATE
export const createNewBook = async (req, res) => {
  try {
    const fileData = req.file; //Lấy fileData trước đã
    const { error } = joi
      .object({ bookid, title, image, category_code, price, available, description })//thiếu description 
      .validate({ ...req.body, image: fileData?.path }); //Nếu fileData có thì mới lấy link path của image
    console.log(object);
    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
      return badRequest(error.details[0].message, res); //nếu có lỗi thì response ra một message
    }

    const response = await services.createNewBook(req.body, fileData);
    //truyền req.query của người dùng hiện tại vào hàm để lấy response
    return res.status(200).json(response);
  } catch (error) {
    return interalServerError(res);
  }
};

//UPDATE
export const updateBook = async (req, res) => {
  try {
    const fileData = req.file; //Lấy fileData trước đã
    const { error } = joi
      .object({ bookid })
      .validate({ bookid: req.body.bookid });
    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename); //nếu có lỗi kiểu như 500 thì xóa file ảnh
      return badRequest(error.details[0].message, res); // và ném ra lỗi
    }
    const response = await services.updateBook(req.body, fileData);
    //nếu không có lỗi thì sẽ update book bằng cách truyền body vào fileData
    return res.status(200).json(response);
  } catch (error) {
    return interalServerError(res);
  }
};

// DELETE
export const deleteBook = async (req, res) => {
  try {
    const { error } = joi.object({ bookids, filename }).validate(req.query); //muốn xóa đối tượng nào thì phải truyền vào đúng bằng này trường của đối tượng đó(có validate)
    if (error) {
      return badRequest(error.details[0].message, res);
    }
    const response = await services.deleteBook(
      req.query.bookids,
      req.query.filename
    );
    return res.status(200).json(response);
  } catch (error) {
    return interalServerError(res);
  }
};
