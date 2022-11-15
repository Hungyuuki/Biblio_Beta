import db from "../models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { notAuth } from "../middleWares/handle_errors";

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
      const accessToken = response[1]
        ? jwt.sign(
            {
              id: response[0].id,
              email: response[0].email,
              role_code: response[0].role_code,
            },
            process.env.JWT_SECRET,
            { expiresIn: "5s" }
          )
        : null;
      //JWT_SECRET_REFRESH_TOKEN
      const refreshToken = response[1]
        ? jwt.sign(
            {
              id: response[0].id,
            },
            process.env.JWT_SECRET_REFRESH_TOKEN,
            { expiresIn: "15d" }
          )
        : null;
      resolve({
        err: response[1] ? 0 : 1,
        mes: response[1] ? "Register is successfully" : "Email already exists",
        access_token: accessToken ? `Bearer ${accessToken}` : accessToken,
        refresh_token: refreshToken,
      });
      if (refreshToken) {
        await db.User.update(
          {
            refresh_token: refreshToken,
          },
          {
            where: { id: response[0].id },
          }
        );
      }
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
      const accessToken = isChecked
        ? jwt.sign(
            {
              id: response.id,
              email: response.email,
              role_code: response.role_code,
            },
            process.env.JWT_SECRET,
            { expiresIn: "5s" }
          )
        : null;
      //JWT_SECRET_REFRESH_TOKEN
      const refreshToken = isChecked
        ? jwt.sign(
            {
              id: response.id,
            },
            process.env.JWT_SECRET_REFRESH_TOKEN,
            { expiresIn: "2d" }
          )
        : null;
      resolve({
        err: accessToken ? 0 : 1,
        mes: accessToken
          ? "Login is successfully"
          : response
          ? "Password is wrong"
          : "This email is not exist",
        access_token: accessToken ? `Bearer ${accessToken}` : accessToken,
        refresh_token: refreshToken,
      });
      if (refreshToken) {
        await db.User.update(
          {
            refresh_token: refreshToken,
          },
          {
            where: { id: response.id },
          }
        );
      }
    } catch (error) {
      reject(error);
    }
  });

//refreshToken
export const refreshToken = (refresh_token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOne({
        where: { refresh_token }, //tìm trong db xem có refreshToken hay không
      });
      if (response) {
        jwt.verify(
          refresh_token,
          process.env.JWT_SECRET_REFRESH_TOKEN,
          (err) => {
            if (err) {
              resolve({
                err: 1,
                mes: "Refresh token expired. Require login", //kiểm tra xem token có bị expired hay không, nếu có lỗi thì login lại
              });
            } else {
              //nếu không có lỗi thì tạo mới một accessToken
              const accessToken = jwt.sign(
                {
                  id: response.id,
                  email: response.email,
                  role_code: response.role_code,
                },
                process.env.JWT_SECRET,
                { expiresIn: "2d" }
              );
              resolve({
                err: accessToken ? 0 : 1,
                mes: accessToken
                  ? "OK"
                  : "Fail to generate new access token. Let try more time",
                access_token: accessToken
                  ? `Bearer ${accessToken}`
                  : accessToken,
                  'refresh_token': refresh_token
              });
            }
          }
        );
      }
    } catch (error) {
      reject(error);
    }
  });
