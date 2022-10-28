"use strict";
const { Model } = require("sequelize");
// const user = require('./user');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Category.init(
    {
      //tạo đối tượng user có 3 properties
      code: DataTypes.STRING, //code là các thành phần của value, code để xử lý phần code này là nằm trong file function.js
      value: {
        type: DataTypes.STRING,
        set(value) {
          this.setDataValue(
            "value",
            value.charAt(0).toUpperCase() + value.slice(1) //xử lý viết hoa chữ cái đầu
          );
        },
      },
    },
    {
      sequelize,
      modelName: "Category",
    }
  );
  return Category;
};
