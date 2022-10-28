'use strict';
const {
  Model
} = require('sequelize');
// const user = require('./user');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Role.init({ //tạo đối tượng user có 3 properties gồm cả id, code và value
    code: DataTypes.STRING,
    value: DataTypes.STRING

  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};