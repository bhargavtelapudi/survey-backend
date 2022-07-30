module.exports = (sequelize, Sequelize) => {
    const Participant = sequelize.define("participants", {
      participant_name: {
        type: Sequelize.STRING
      },
      email_id: {
        type: Sequelize.STRING
      }
    });
    return Participant;
  };
  