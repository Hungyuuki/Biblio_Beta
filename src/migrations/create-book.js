"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Books", {//chờ cho tạo bảng có chứa các trường xong thì mới thực hiện up
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      title: { type: Sequelize.STRING },
      price: { type: Sequelize.FLOAT, defaultValue: 0 },
      available: { type: Sequelize.INTEGER, defaultValue: 0 },
      image: { type: Sequelize.STRING },
      description: { type: Sequelize.TEXT },
      category_code: { type: Sequelize.STRING },
      createdAt: {
        allowNull: false,
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
  async down(queryInterface, Sequelize) {//nếu promise là bảng không tạo thành công thì thực hiện drop cái Table đó đi
    await queryInterface.dropTable("Books");
  },
};
