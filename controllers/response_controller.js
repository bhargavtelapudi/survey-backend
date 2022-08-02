const db = require("../models");
const survey = db.survey
const services = require("../services/survey")
const response = db.surveyresponse
exports.submit_survey = async (req, res) => {
  try {
    //check survey publish status
    let get_survey_info = await survey.findOne({
      where: { id: req.query.surveyId }
    })
    console.log("survey", get_survey_info)
    if (!get_survey_info || !get_survey_info.dataValues.survey_isPublished) {
      return res.status(400).json({
        message: "Survey not found"
      })
    }
    //check email
    if (!req.body.email || !req.body.name) {
      return res.status(400).json({
        message: "email and name are mandatory to record response"
      })
    }
    console.log("req", req.body.email)
    //check duplicate response
    let checkParticipant = await services.response_exists(req.body.email, req.query.surveyId)
    //if response already exists with mail id
    console.log("checkParticipant", checkParticipant)
    if (checkParticipant) {
      return res.status(400).send({
        message: "Response Already Exists with Same Email!"
      });
    }
    //save email,usernamein response table
    let Participant = await services.save_participant(req.body.email, req.body.name, req.query.surveyId)
    for (let i = 0; i < req.body.responses.length; i++) {
      await response.create({
        response: req.body.responses[i].response,
        participantId: Participant.dataValues.id,
        questionId: req.body.responses[i].id,
        surveyId:req.query.surveyId      })
    }

    return res.status(200).send({
      message: "response saved successfully"
    })
  } catch (err) {
    res.status(500).send(err)
  }
};
