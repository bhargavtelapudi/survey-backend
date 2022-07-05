const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user_model")(sequelize, Sequelize);
db.survey = require("../models/survey_model")(sequelize,Sequelize)

db.user.hasMany(db.survey, {
  as: 'survey'
});
db.survey.belongsTo(db.user, {
  foreignKey: 'userId', as: 'user',
});
module.exports = db;
