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
db.survey = require("./survey_model")(sequelize,Sequelize)
db.question = require("./question_model")(sequelize,Sequelize)
db.option = require("./option_model")(sequelize,Sequelize)

//relatin between user and survey tables
db.user.hasMany(db.survey, {
  as: 'surveys'
});
db.survey.belongsTo(db.user, {
  foreignKey: 'userId', as: 'user',
});

//relatin between survey and question
db.survey.hasMany(db.question, {
  as: 'questions'
});
db.question.belongsTo(db.survey, {
  foreignKey: 'surveyId', as: 'survey',
});

//relation between question and option
db.question.hasMany(db.option, {
  as: 'options'
});
db.option.belongsTo(db.question, {
  foreignKey: 'questionId', as: 'question',
});

module.exports = db;
