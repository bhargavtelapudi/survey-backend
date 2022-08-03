const db = require("../models");
const config = require("../config/auth_config");
const User = db.user;
const survey = db.survey
const email_service = require("../services/email")
const services = require("../services/survey")
const question = db.question
const option = db.option
const response = db.surveyresponse
const participant = db.participant
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
  

  exports.survey_list =async (req, res) => {
    if(req.query.user){
      //get user
      let user = await User.findOne({
        where:{id:req.query.user}
      })
      if(user){
        let survey_list = await survey.findAll({
          where:{userId:user.id}
        })
        return res.status(200).send({
          survey_list:survey_list,
          user:{  
            username:user.user_name,
            organization:user.organization
          }
        })
      }else{
        return res.status(404).send("user not found")
      }
    }else{
    //find all surveys
  survey.findAll({
      where: { userId: req.userId }
    })

    .then((survey) => {
      
      res.status(200).send(survey);

    })
    .catch((err) => {
      console.log("error");
      res.status(500).send({ message: err.message });
    });
  }
  };
  
  exports.delete_survey = (req, res) => {
    const id = req.params.surveyId;
    survey.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          //delete question
          question.destroy({
            where:{surveyId:id}
          })
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

  exports.send_surveylink_email = async (req, res) => {
    if (!req.body.survey_link || !req.body.user_email) {
      return res.status(400).send({
        message: "survey link and user email are required"
      })
    }
    let email_sent = await email_service.send_email(req.body.survey_link, req.body.user_email)
    if (email_sent) {
      return res.status(200).send("email sent succesfully")
    } else {
      return res.status(200).send("email not sent")
    }
  }



  exports.view_survey = (req,res)=>{
      
    if (req.query.responses = true) {
      console.log("inn")
      survey.findOne({
        where: { id: req.params.surveyId },
        include: [
          {
            model: db.question, as: 'questions',
            include: [
              {
                model: db.option, as: "options",
              },
              {
                model: db.surveyresponse, as: "surveyresponse",
                include: [{
                  model: db.participant, as: "participant"
                }]
              }
            ]
          }
        ]
      }).then((survey) => {
           //calcuate answers
    for (let i = 0; i < survey.dataValues.questions.length; i++) {
      if (survey.dataValues.questions[i].type == "multiple-choice") {
        for (
          let j = 0;
          j < survey.dataValues.questions[i].options.length;
          j++
        ) {
          for (
            let k = 0;
            k < survey.dataValues.questions[i].responses.length;
            k++
          ) {
            if (
              survey.dataValues.questions[i].options[j].options ==
              survey.dataValues.questions[i].responses[k].response
            ) {             
              if (
                survey.dataValues.questions[i].options[j].dataValues
                  .count
              ) {
                survey.dataValues.questions[i].options[j].dataValues
                  .count++;
              } else {

                survey.dataValues.questions[i].options[
                  j
                ].dataValues.count = 1;
              }
            }
          }
        }
      }
    }
        res.status(200).send(survey);
      })
        .catch((err) => {
          console.log("error");
          res.status(500).send({ message: err.message });
        });
    } else {
      survey.findOne({
        where: { id: req.params.surveyId },
        include: [
          {
            model: db.question, as: 'questions',
            include: [{
              model: db.option, as: "options"
            }]
          }
        ]
      }).then((survey) => {
  
        res.status(200).send(survey);
      })
        .catch((err) => {
          console.log("error");
          res.status(500).send({ message: err.message });
        });
    }
  }

  exports.publish_survey = async(req, res) => {
    //find all users
    if(req.query.isPublished === "false"){
    let update = await  survey.update(
      {survey_isPublished:false},
     { where: { id: req.params.surveyId }}
    )
    if(update == 0){
      return res.status(200).send({
        message:"Error occured.Please check surveyId and published values"
      })
    }
    return res.status(200).send({
      message:"unpublish successfull"
    })
     }
     if(req.query.isPublished === "true"){
    let update =  await  survey.update(
       {survey_isPublished:true},
      { where: { id: req.params.surveyId }}
     )
     console.log("update",update)
     if(update == 0){
      return res.status(200).send({
        message:"Error occured.Please check surveyId and published values"
      })
    }
     return res.status(200).send({
      message:"publish successfull"
    })
      }
      else{
        await survey.findOne({
          where: { id: req.params.surveyId },
          include: [
            {
              model: db.question,
              as: "questions",
              include: [
                {
                  model: db.option,
                  as: "options",
                },
              ],
            },
          ],
        }).then(async (survey) => {
          survey.survey_title = req.body.title;
          survey.survey_description = req.body.description;
          survey.survey_isPublished = req.body.isPublished;
          let questions_added = [];
          if (survey.dataValues.questions.length == 0) {
            for (let i = 0; i < req.body.questions.length; i++) {
              if (questions_added.length == 0) {
                questions_added.push(req.body.questions[i]);
              } else {
                for (let k = 0; k < questions_added.length; k++) {
                  if (questions_added[k].title !== req.body.questions[i].title) {
                    questions_added.push(req.body.questions[i]);
                  }
                }
              }
            }
          } else {
            for (let i = 0; i < survey.dataValues.questions.length; i++) {
              var question_found = false;
              for (j = 0; j < req.body.questions.length; j++) {
                if (req.body.questions[j].id == undefined) {
                  question_found = true
                  if (questions_added.length == 0) {
                    questions_added.push(req.body.questions[i]);
                  } else {
                    for (let k = 0; k < questions_added.length; k++) {
                      if (questions_added[k].title !== req.body.questions[j].title) {
                        questions_added.push(req.body.questions[i]);
                      }
                    }
                  }
                } else {
                  if (survey.dataValues.questions[i].id == req.body.questions[j].id) {
                    question_found = true;
                    let questionUpdate = await services.update_question(
                      req.body.questions[j],
                      survey.dataValues.questions[i]
                    );
                  }
                }
              }
              if (!question_found) {
                //delete question
                await question.destroy({
                  where: { id: survey.dataValues.questions[i].id },
                });
              }
            }
          }
      
          for (let n = 0; n < questions_added.length; n++) {
            await services.create_question(questions_added[n], survey.dataValues.id);
          }
          survey.save();
          return res.status(200).send({
            message: "survey updated successfully",
          });
        });

      }

    }

    exports.survey_questions = async (req, res) => {

      survey.findOne({
        where: { id: req.params.surveyId },
        include: [
          {
            model: db.question, as: 'questions',
            include: [{
              model: db.option, as: "options"
            }]
          }
        ]
      }).then((survey) => {
        if (!survey || !survey.dataValues.survey_isPublished) {
          return res.status(400).json({
            message: "Survey not found"
          })
        }
        res.status(200).send(survey);
      })
        .catch((err) => {
          console.log("error");
          res.status(500).send({ message: err.message });
        });
    }

    //delete user
exports.delete_user = async (req, res) => {
  const id = req.params.userId;
  User.destroy({
    where: { id: id, user_type: "user" }
  })
    .then(async num => {
      if (num == 1) {
        //delete question
        let delete_user_surveys = await survey.destroy({
          where: { userId: null }
        })
        let delete_survey_questions = await question.destroy({
          where: { surveyId: null }
        })
        let delete_questions_options = await option.destroy({
          where: {
            questionId: null
          }
        })
        let delete_participant_details = await participant.destroy({
          where: { surveyId: null }
        })
        let delete_response_details = await response.destroy({
          where: { questionId: null }
        })
        res.status(200).send({
          message: "user was deleted successfully!"
        });
      } else {
        res.sattus(404).send({
          message: `Cannot delete user  with id=${id}. Maybe User was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete survey with id=" + id
      });
    });
};


exports.surveyReport = async (req, res) => {
  let reports = []
  console.log("here")
  let survey_responses = await response.findAll({
    where: { surveyId: req.query.surveyId },
    include: ["question", "participant"],
  })
  console.log("sur",survey_responses)
  for (let i = 0; i < survey_responses.length; i++) {
    if (reports.length == 0) {
      let object ={
        'user email':survey_responses[i].participant.email_id,
        'user name':survey_responses[i].participant.participant_name
      }
      reports.push( object )
    } else {
      email_found = false
      for (let j = 0; j < reports.length; j++) {
        if (survey_responses[i].participant.email_id == reports[j]['user email']) {
          email_found = true
        }
      }
      if (!email_found) {
        let object ={
          'user email':survey_responses[i].participant.email_id,
          'user name':survey_responses[i].participant.participant_name
        }
        reports.push(object)
      }
    }
  }
  console.log("survey",survey_responses.dataValues)
  for (let i = 0; i < survey_responses.length; i++) {
    console.log("in")
    console.log("survey",survey_responses[i].dataValues)

    for (let j = 0; j < reports.length; j++) {
      console.log(survey_responses[i].participant.email_id,reports[j]["user email"])
      if (survey_responses[i].participant.email_id == reports[j]["user email"]) {
        let question = survey_responses[i].question.title
        reports[j][question] = survey_responses[i].response
      }
    }
  }
  return res.status(200).send(reports);
}