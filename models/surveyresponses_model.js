module.exports = (sequelize, Sequelize) => {
    const survey_response = sequelize.define("surveyresponses", {
      response: {
        type: Sequelize.STRING
      }
    });
    return survey_response;
  };
  