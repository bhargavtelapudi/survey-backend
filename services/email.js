var nodemailer = require('nodemailer');

exports.send_email = async (survey_link, user_email) => {
  return await new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      name: "test",
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'surveyyproject@gmail.com',
        pass: 'survesh123',
        clientId: '451311372769-o7e1oglcrrdloobj8kilt3otn9o31r20.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken: '1//04_QA8kJv1lBWCgYIARAAGAQSNwF-L9IrkL0IbUV68PKTv7NlVBBqkTQUVvrK_m-hxk_Kk7xGET-AwFGQrSIfOmDcCvL8NlV7ahc'
      }
    });

    var mailOptions = {
      from: 'surveyyproject@gmail.com',
      to: user_email,
      subject: 'Take Survey',
      text: survey_link
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        resolve(false)
      } else {
        console.log("Message sent: %s", info);

        resolve(true)
      }
    });
  })
}

