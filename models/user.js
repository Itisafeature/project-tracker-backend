'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Board, {
        foreignKey: 'userId',
        as: 'boards',
      });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isAlphanumeric: true,
          notNull: true,
          len: {
            args: [4, 15],
            msg: 'Username must be between 4 and 15 characters',
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: true,
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          is: {
            args: /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{6,}$/g,
            msg:
              'Password must be at least at characters long and include 1 uppercase letter, 1 lowercase letter and 1 number',
          },
        },
      },
    },
    // {
    //   hooks: {
    //     beforeCreate: async (user, options) => {
    //       console.log('here');
    //       const hashedPassword = await bcrypt.hash(user.password, 10);
    //       user.password = hashedPassword;
    //     },
    //   },
    // },
    // {
    //   defaultScope: {
    //     attributes: { exclude: ['password'] },
    //   },
    //   scopes: {
    //     withPassord: {
    //       attributes: {},
    //     },
    //   },
    // },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
