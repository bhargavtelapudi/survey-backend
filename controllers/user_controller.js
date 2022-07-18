const db = require("../models");
const config = require("../config/auth_config");
const User = db.user;
const survey = db.survey
const services = require("../services/survey")
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

  exports.create_survey = async(req, res) => {
    try {
      //check title and description coming in body or not
      if (!req.body.title || !req.body.description) {
        return res.status(400).json({
          message: "title and description required to create survey"
        })
      }
      //save data in survey table
      let survey_details = await services.create_survey(req.body.title,req.body.description,req.body.isPublished,req.userId)
      //let survey_details = await surveyServices.create_survey(req.body.title, req.body.description, false, req.userId)
      for (let i = 0; i < req.body.questions.length; i++) {     
            await services.create_question(req.body.questions[i], survey_details.dataValues.id)
        }
      
      let survey_info = await survey.findOne({
        where: { id: survey_details.dataValues.id },
        include: [
          {
            model: db.question, as: 'questions',
            include: [{
              model: db.option, as: "options"
            }]
          }
        ]
      })
      res.status(200).send(survey_info)
    } catch (err) {
      res.status(500).send(err)
    }
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
  
  exports.delete_survey = (req, res) => {
    const id = req.params.surveyId;
    Survey.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Survey was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Survey  with id=${id}. Maybe Survey was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete survey with id=" + id
        });
      });
  };