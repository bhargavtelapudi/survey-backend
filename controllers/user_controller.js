const db = require("../models");
const config = require("../config/auth_config");
const User = db.user;
const Survey = db.survey
exports.users_list = (req, res) => {
    //find all users
    User.findAll({
      where: {
        user_type: "user"
      }
    }).then(userlist => {
      return res.status(200).send(userlist);
    })
  };

  exports.create_survey = (req, res) => {
    
    // Save survey to Database
    Survey.create({
      survey_title : req.body.title,
      survey_description: req.body.description,
      userId:req.userId
    })
      .then((survey) => {
        res.status(200).send(survey);
      })
      .catch((err) => {
        console.log("error");
        res.status(500).send({ message: err.message });
      });
  };
  

  exports.survey_list = (req, res) => {
    //find all users
   User.findOne({
      where: {
        id: req.userId
      },
      include: [
        { model: db.survey, as: 'survey' }]
    }).then(userlist => {
      return res.status(200).send(userlist);
    })
  };