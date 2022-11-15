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
          //Chương trình chạy và gặp await thì nó sẽ chờ cho tới khi hàm create tạo được value item.
          code: generateCode(item),//một trường của categories, phần code là phần tự gene ra
          value: item,//một trường của categories
        });//tới đây căn bản là tạo xong 1 phần tử category
      });//thì sẽ tới việc bắt đầu map các phần tử book vào category
      const dataArr = Object.entries(data);// Trả về mảng thuộc tính đếm được của các cặp [key, value] với object đã cho, tức là trả về value của các item
      dataArr.forEach((item) => {//duyệt mảng item
        item[1]?.map(async (book) => {//lưu trữ book vào từng item một cách không đồng bộ(không lần lượt) theo dạng [key, value], 
          //trong đó mỗi key là một category, còn mỗi value lại là một mảng các book
          await db.Book.create({//chờ cho book create được các trường dữ liệu thì lưu các trường này vào book và map vào item
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
      resolve("it's OK");//đây là trả về một promise
    } catch (error) {
      reject(error);
    }
  });
//Đôi nét về async/await: 
// Hàm async nói chung là viết code không đồng bộ hoạt động dựa trên cơ chế đồng bộ.
// Các hàm async luôn trả về một giá trị, đó gọi là một Promise.
// Và Promise này sẽ resolve bất kỳ giá trị nào được trả về bằng từ khóa return (trong trường hợp trên thì promise sẽ resolve message “it's OK”)

//Từ khóa Await chỉ được sử dụng bên trong một đoạn code có từ khóa Async.
//Từ khóa Await sẽ báo cho JS chờ cho đến khi một promise trả về một giá trị.
//Lưu ý: Await chỉ làm cho khối có từ khóa Async phải chờ thôi chứ không phải là toàn bộ chương trình phải chờ.

//Promise: Nó chính là kết quả trả về của một hàm nào đó chứ không có gì khó hiểu cả,
//chẳng qua trong bất đồng bộ thì sẽ có những lúc promise bị pending hoặc không được trả về.
//Còn trong đồng bộ thì kết quả luôn trả về(nên thường ko gọi là promise)