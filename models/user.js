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
      User.hasMany(models.board, {
        foreignKey: 'userId',
        as: 'boards',
      });

      User.hasMany(models.note, {
        foreignKey: 'userId',
        as: 'notes',
      });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlphanumeric: true,
          notNull: true,
          len: {
            args: [4, 15],
            msg: 'Username must be between 4 and 15 characters',
          },
        },
        unique: {
          args: 'username',
          msg: 'Username is already taken',
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
        unique: {
          args: 'email',
          msg: 'Email is already taken',
        },
      },
    },
    {
      sequelize,
      modelName: 'user',
    }
  );
  User.addHook('beforeCreate', async (user, options) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  });
  return User;
};
