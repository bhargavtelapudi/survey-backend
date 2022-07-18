module.exports = (sequelize, Sequelize) => {
    const Question = sequelize.define("questions", {
      title: {
        type: Sequelize.STRING
      },
      required: {
        type: Sequelize.BOOLEAN
      },
      question_type: {
        type: Sequelize.ENUM("text-field", "multiple-choice", "rating","paragraph")
      }
    });
    return Question;
  };