import db from "../models";
import { Op } from "sequelize";
import { v4 as generateId } from "uuid";
const cloudinary = require("cloudinary").v2;
//READ
export const getBooks = ({ page, limit, order, name, available, ...query }) =>
  new Promise(async (resolve, reject) => {
    //truyền vào đây những trường mà người dùng muốn(page, limit, order, còn các cái khác lấy qua biến query)
    try {
      const queries = { nest: true, raw: true }; //nest: true: từ bảng này lấy data của bảng khác dùng association bằng 1 khóa phụ thì những data của bảng khác sẽ gom lại thành một object
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const fLimit = +limit || +process.env.LIMIT_BOOK; //limit là số bản ghi mình muốn có trong 1 page, nếu người dùng truyền vào số limit thì lấy số đó làm limit, còn nếu ko thì mặc định limit = 7
      queries.offset = offset * fLimit; //Đại loại dùng để phân trang, offset * limit = số bản ghi
      queries.limit = fLimit; //Câu lệnh queries.... là để người dùng truyền vào page hoặc limit hoặc order dưới dạng query
      if (order) queries.order = [order];
      if (name) query.title = { [Op.substring]: name }; //cần phân biệt query là để tìm kiếm theo tên, còn queries là một đối tượng
      if (available) query.available = { [Op.between]: available };
      const response = await db.Book.findAndCountAll({
        where: query, //where này để filter chứ ko phải để query
        ...queries, //rải offset và limit ở trên xuống
        attributes: {
          exclude: ["category_code", "description"], //Không hiện ra 2 cột này nữa
        },
        include: [
          {
            model: db.Category,
            attributes: { exclude: ["createdAt", "updatedAt"] },
            as: "categoryData",
          },
          //thay vào đó thì hiện ra categoryData, vì nó đã bao gồm category_code, đây là chức năng của nest: true
        ],
      });
      resolve({
        err: response.rows.length > 0 ? 0 : 1,
        mes: response.rows.length > 0 ? "Got it" : "Cannot found book(s)",
        bookData: response,
      });
      console.log(response);
    } catch (error) {
      reject(error);
    }
  });

//CREATE
export const createNewBook = (body, fileData) =>
  new Promise(async (resolve, reject) => {
    //truyền vào đây những trường mà người dùng muốn(page, limit, order, còn các cái khác lấy qua biến query)
    try {
      const response = await db.Book.findOrCreate({
        where: { title: body?.title }, //where này để filter chứ ko phải để query
        defaults: {
          ...body,
          image: fileData?.path,
          id: generateId(),
          filename: fileData?.filename,
        },
      });
      resolve({
        err: response[1] ? 0 : 1,
        mes: response[1] ? "Created" : "Cannot create new book",
      }); //kiểm tra xem có data không
      if (fileData && !response[1])
        cloudinary.uploader.destroy(fileData.filename); //nếu có fileData, và không tạo được books mới thì sẽ xóa ảnh
    } catch (error) {
      reject(error);
      if (fileData) cloudinary.uploader.destroy(fileData.filename); //nếu có fileData thì cũng xóa ảnh luôn
    }
  });

//UPDATE
export const updateBook = ({ bookid, ...body }, fileData) =>
  new Promise(async (resolve, reject) => {
    //truyền vào đây những trường mà người dùng muốn(page, limit, order, còn các cái khác lấy qua biến query)
    try {
      if (fileData) body.image = fileData?.path; //nếu có ảnh thì body sẽ có trường ảnh là fileData.path,
      // còn nếu không có ảnh thì phần body sẽ gồm những thông tin truyền vào mà không có file ảnh
      const response = await db.Book.update(body, {
        //hàm update trả về 1 mảng, trong mảng đó gồm có 1 phần tử, là số lượng công việc cần update
        where: { id: bookid }, // gán giá trị bookid cho cột id trên DB
      });
      resolve({
        err: response[0] > 0 ? 0 : 1,
        mes:
          response[0] > 0
            ? `${response[0]} book updated`
            : "Can not Update/Book ID not found",
      }); //kiểm tra xem có data không
      if (fileData && response[0] === 0) cloudinary.uploader.destroy(fileData.filename);//response[0] === 0 tức là nếu không update thì sẽ hủy cái bước gửi ảnh lên
    } catch (error) {
      reject(error);
      if (fileData) cloudinary.uploader.destroy(fileData.filename); //nếu có fileData thì cũng xóa ảnh luôn
    }
  });

//DELETE
// [id1, id2]


/*
params = {
    bookids=[id1, id2],
    filename=[filename1, filename2]
}
*/
export const deleteBook = (bookids, filename) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Book.destroy({
            where: { id: bookids }
        })
        resolve({
            err: response > 0 ? 0 : 1,// Nếu trả về 0 thì là ko xóa dòng nào, nếu >0 thì trả về 0, không >0 thì trả về 1
            mes: `${response} book(s) deleted`
        })
        cloudinary.api.delete_resources(filename)
    } catch (error) {
        reject(error)
    }
})
