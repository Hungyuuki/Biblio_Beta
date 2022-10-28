import db from "../models";
import data from "../../data/data.json";
import { generateCode } from "../helpers/function";

export const insertData = () =>
  new Promise(async (resolve, reject) => {
    try {
      console.log(Object.keys(data))
      const categories = Object.keys(data);
      categories.forEach(async (item) => {
        await db.Category.create({
          code: generateCode(item),
          value: item,
        });
      });

      const dataArr = Object.entries(data);
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
