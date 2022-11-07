import db from "../models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const hashPassword = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const register = ({ userName, email, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOrCreate({
        where: { email },
        defaults: {
          userName,
          email,
          password: hashPassword(password),
        },
      });
      //Nếu có 1 đăng ký mới thì sẽ tạo ra một token, chứa các giá trị đã được mã hóa ở trong cặp ngoặc, nếu không có đăng ký mới thì token sẽ trả về null
      const token = response[1]
        ? jwt.sign(
            {
              id: response[0].id,
              email: response[0].email,
              role_code: response[0].role_code,
            },
            process.env.JWT_SECRET,
            { expiresIn: "5d" }
          )
        : null;
      resolve({
        err: response[1] ? 0 : 1,
        mes: response[1] ? "Register is successfully" : "Email already exists",
        'access_token': token ? `Bearer ${token}` : token,
      });
    } catch (error) {
      reject(error);
    }
  });

//login
export const login = ({ userName, email, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOne({
        where: { email },
        raw: true,
      });

      // So sánh pass mình truyền vào với pass mà có sẵn trên DB, nếu response là null thì isChecked cũng là null luôn
      const isChecked =
        response && bcrypt.compareSync(password, response.password);
      const token = isChecked
        ? jwt.sign(
            {
              id: response.id,
              email: response.email,
              role_code: response.role_code,
            },
            process.env.JWT_SECRET,
            { expiresIn: "5d" }
          )
        : null;
      resolve({
        err: token ? 0 : 1,
        mes: token
          ? "Login is successfully"
          : response
          ? "Password is wrong"
          : "This email is not exist",
        access_token: token ? `Bearer ${token}` : token,
      });

      resolve({
        err: 0,
        mes: "This is Login service",
      });
    } catch (error) {
      reject(error);
    }
  });
