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
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: true,
        },
      },
      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: true,
        },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'note',
    }
  );

  Note.addScope('defaultScope', {
    attributes: ['id', 'content', 'createdAt'],
  });

  Note.addHook('beforeValidate', async (note, options) => {
    const board = await options.parentRecord.getBoard({
      attributes: { include: ['userId'] },
    });
    note.userId = board.dataValues.userId;
  });

  Note.addHook('afterSave', async (note, options) => {
    if (note.content === '') await note.destroy();
  });
  return Note;
};
