const db = require("../models");
const config = require("../config/auth_config");
const User = db.user;
const survey = db.survey

const services = require("../services/survey")
const question = db.question
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


  exports.view_survey = (req,res)=>{
      
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
    }) .then((survey) => {
      
      res.status(200).send(survey);
    })
    .catch((err) => {
      console.log("error");
      res.status(500).send({ message: err.message });
    });
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

    }