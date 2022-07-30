
const db = require("../models");
const survey = db.survey;
const question = db.question
const option = db.option
exports.create_survey = async (survey_title,survey_description,survey_isPublished,userId) => {
  try {
    //create survey
    let survey_details = await survey.create({
      survey_title: survey_title,
      survey_description: survey_description,
      survey_isPublished:survey_isPublished,
      userId: userId,
    })
    console.log("surve",survey_details)
    return survey_details
  } catch (err) {
    return err
  }
};

exports.create_question = async (question_info,surveyId) => {
    try {
        console.log("question",question_info,surveyId)
      //create
      let question_details = await question.create({
        title: question_info.title,
        required: question_info.required,
        question_type:question_info.question_type,
        surveyId: surveyId,
      })
      console.log("question details",question_details)
if(question_info.question_type === "multiple-choice"){
    for(let i=0;i<question_info.options.length;i++){
    let option = await create_option(question_info.options[i].option,question_details.id)
    }
}
return question_details
    } catch (err) {
      return err
    }
  };

  const create_option =async(option_info,questionId)=>{
   let optionn = await option.create({
        option:option_info,
        questionId:questionId
    })
    return optionn;
  }


//check endUserDetails
exports.response_exists = async (participant_email, survey_id) => {
  // Email
  let exists = await participant.findOne({
    where: {
      email_id: participant_email, surveyId: survey_id
    }
  })
  console.log(exists)
  if (exists !== null) {
    return true
  }
  return false
};

exports.save_participant = async (participant_email, participant_name, survey_id) => {
  try {
    let Participant = await participant.create({
      participant_name: participant_name,
      email_id: participant_email,
      surveyId: survey_id
    })
    return Participant
  } catch (err) {
    return err
  }
};