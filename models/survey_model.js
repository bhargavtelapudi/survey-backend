module.exports = (sequelize, Sequelize) => {
    const Survey = sequelize.define("surveys", {
    survey_title: {
        type: Sequelize.STRING
      },
      survey_description: {
        type: Sequelize.STRING
      },
      survey_isPublished: {
        type: Sequelize.BOOLEAN
      },
      survey_url:{
        type: Sequelize.STRING
      }
    });
  
    return Survey;
  };
  