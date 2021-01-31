import Sequelize from 'sequelize';

const sequelize = new Sequelize(
  `${process.env.DB}`,
  `${process.env.DB_USER}`,
  `${process.env.DB_PASSWD}`,
  {
    dialect: 'postgres',
  }
);

const models = {
  User: sequelize.import('./user'),
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

export default models;
