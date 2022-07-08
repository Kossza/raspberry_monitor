var nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'emea-relay.global.local',
    port: 25,
    secure: false
});

// send email
var mailOptions = {
    from: 'nodetest@essentra.com',
    to: 'balazskosa@essentra.com',
    subject: 'Test Email Subject',
    html: '<h1>Example HTML Message Body</h1>'
};

function test(){
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      })
};
console.log('Hello fakk!')