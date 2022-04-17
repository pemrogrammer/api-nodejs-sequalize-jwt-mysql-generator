const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const sendEmail = async (email, subject, payload, template) => {
  try {
    // create reusable smtpTransport object using the default SMTP transport
    const smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.NODE_MAIL,
            pass: process.env.NODE_MAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const source = fs.readFileSync(path.join(__dirname, template), "utf8");
    const compiledTemplate = handlebars.compile(source);

    const mailOptions = {
        from: process.env.NODE_MAIL,
        to: email,
        subject: subject,
        // text: 'hai send from me',
        html: await compiledTemplate(payload),
    };

    // Send email
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
        }
        else {
            console.log("mail sent");
        }
    });

  } catch (error) {
    console.log('sent mail catch error : ', $error)
    return error;
  }
};

module.exports = sendEmail;