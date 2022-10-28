import db from "../models";
import { Op } from "sequelize";


//READ
export const getBooks = ({ page, limit, order, name, available, ...query }) => new Promise(async (resolve, reject) => {
    //truyền vào đây những trường mà người dùng muốn(page, limit, order, còn các cái khác lấy qua biến query)
    try {
      const queries = {nest: true, raw: true}; //nest: true: từ bảng này lấy data của bảng khác dùng association bằng 1 khóa phụ thì những data của bảng khác sẽ gom lại thành một object
      const offset = (!page || +page <= 1) ? 0 : (+page - 1);
      const fLimit = +limit || +process.env.LIMIT_BOOK; //limit là số bản ghi mình muốn có trong 1 page, nếu người dùng truyền vào số limit thì lấy số đó làm limit, còn nếu ko thì mặc định limit = 7
      queries.offset = offset * fLimit; //Đại loại dùng để phân trang, offset * limit = số bản ghi
      queries.limit = fLimit; //Câu lệnh queries.... là để người dùng truyền vào page hoặc limit hoặc order dưới dạng query
      if (order) queries.order = [order];
      if (name) query.title = { [Op.substring]: name }; //cần phân biệt query là để tìm kiếm theo tên, còn queries là một đối tượng
      if (available) query.available = {[Op.between]: available }
      const response = await db.Book.findAndCountAll({
        where: query, //where này để filter chứ ko phải để query
        ...queries, //rải offset và limit ở trên xuống
        attributes: {
          exclude: ['category_code']//Không hiện ra category_code nữa
        },
        include: [
          {model: db.Category, attributes: {exclude: ['createdAt', 'updatedAt']}, as:'categoryData'} 
          //thay vào đó thì hiện ra categoryData, vì nó đã bao gồm category_code, đây là chức năng của nest: true
      ]
      });
      resolve({
        err: (response.rows.length > 0) ? 0 : 1,
        mes: (response.rows.length > 0) ? "Got it" : "Cannot found book(s)",
        bookData: response,
      });
      console.log(response)
    } catch (error) {
      reject(error);
    }
  });


  //CREATE
  export const createNewBooks = (body) => new Promise(async (resolve, reject) => {
    //truyền vào đây những trường mà người dùng muốn(page, limit, order, còn các cái khác lấy qua biến query)
    try {
      const response = await db.Book.findOrCreate({
        where: {title: body.title}, //where này để filter chứ ko phải để query
        default: body
      });
      resolve({
        err: response[1] ? 0 : 1,
        mes: response[1] ? "Created" : "Cannot Created book(s)"
      });
      console.log(response)
    } catch (error) {
      reject(error);
    }
  });

  //UPDATE
  //DELETE
