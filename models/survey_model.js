module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
      survey_title: {
        type: Sequelize.STRING
      },
      survey_: {
        type: Sequelize.STRING
      },
      survey_: {
        type: Sequelize.STRING
      }
    });
  
    return User;
  };
  