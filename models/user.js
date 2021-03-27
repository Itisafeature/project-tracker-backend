'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');
const passwordRegex = require('../utils/passwordRegex');

// Password R

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
        unique: {
          args: 'email',
          msg: 'Email is already taken',
        },
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
        },
      },
    },
    {
      sequelize,
      modelName: 'user',
    }
  );

  User.addScope('defaultScope', {
    attributes: ['id', 'username', 'email', 'password'],
  });

  User.addHook('beforeValidate', async (user, options) => {
    if (!user.password.match(passwordRegex)) {
      return Promise.reject(
        new Error(
          'Password must be minimum eight characters, maximum 32 characters,  at least one uppercase letter, one lowercase letter, one number and one special character (@$!%*?&)'
        )
      );
    }
  });

  User.addHook('beforeCreate', async (user, options) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  });
  return User;
};
