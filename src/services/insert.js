import db from "../models";//db, data là một object
import data from "../../data/data.json";
import { generateCode } from "../helpers/function";
//service này dùng để insert data từ file data.json
export const insertData = () =>
  new Promise(async (resolve, reject) => {//khai báo đây là một promise
    try {
      console.log(Object.keys(data))
      const categories = Object.keys(data);  //keys là danh sách tên các thuộc tính properties name
      //truyền data vừa được import để lấy ra một mảng các đối tượng categories trong file data.json
      categories.forEach(async (item) => { //duyệt mảng categories, đặt tên các phần tử là item, mỗi item là một phần tử category, khai báo forEach là một hàm bất đồng bộ bằng từ khóa async,
        //sau đó đặt từ khóa await để pending hàm forEach, chờ cho hàm create tạo xong từng item một rồi mới duyệt tiếp, tức là cứ khi duyệt được 1 vòng thì create 1 lần rồi mới duyệt tiếp.
        await db.Category.create({//hàm create sẽ tạo item là các phần tử category ứng với từng phần tử data một.
          //Chương trình chạy và gặp await thì nó sẽ tạm dừng thực hiện cả hàm insertData(), 
          //tới khi trả về resolve là ("it's OK") thì mới tiếp tục quay ngược lại duyệt để tiếp tục create
          code: generateCode(item),
          value: item,
        });//tới đây căn bản là tạo xong 1 phần tử category
      });
      const dataArr = Object.entries(data);// Trả về mảng thuộc tính đếm được của các cặp [key, value] với object đã cho, tức là trả về value của các item
      dataArr.forEach((item) => {
        item[1]?.map(async (book) => {
          await db.Book.create({
            id: book?.upc,
            title: book?.bookTitle,
            price: +book?.bookPrice,
            available: +book?.available,
            image: book?.imageUrl,
            description: book?.bookDescription,
            category_code: generateCode(item[0]),
          });
        });
      });
      resolve("it's OK");
    } catch (error) {
      reject(error);
    }
  });
