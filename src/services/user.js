import db from "../models";

export const getUserById = (userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOne({
        where: { id: userId }, //tìm userID trong cột id
        //tiến hành khi lấy user thì không lấy ra pasword
        attributes: {//khai báo trong đối tượng sẽ trích xuất ra các thuộc tính nào
          exclude: ["password", "role_code"], //khai báo trong đối tưỡng được trích ra sẽ không có các thuộc tính nào
        },
        include: [
          {
            model: db.Role,
            as: "roleData",
            attributes: ["id", "code", "value"]
          },
        ],
      });
      resolve({
        err: response ? 0 : 1,
        mes: response ? "Got it" : "User is not found",
        userData: response,
      });
    } catch (error) {
      reject(error);
    }
  });
