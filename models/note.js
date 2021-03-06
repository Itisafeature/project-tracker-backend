'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Note.belongsTo(models.item, {
        foreignKey: 'itemId',
        onDelete: 'CASCADE',
      });

      Note.belongsTo(models.user, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
    }
  }
  Note.init(
    {
      content: {
        type: DataTypes.STRING,
        validate: {
          notNull: true,
          len: [10, 500],
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        validate: {
          notNull: true,
        },
      },
      itemId: {
        type: DataTypes.INTEGER,
        validate: {
          notNull: true,
        },
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    },
    {
      sequelize,
      modelName: 'Note',
    }
  );
  return Note;
};
