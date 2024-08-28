const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config();

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_MAIL, // generated ethereal user
    pass: process.env.SMTP_PASSWORD, // generated ethereal password
  },
});

const sendEmail = expressAsyncHandler(async (req, res) => {
  const { name, email, msg } = req.body;
  console.log(name, email, msg);

  const subject = `Contact Form Submission from ${name}`;
  const message = `You have received a new message from your portfolio website.\n\nName: ${name}\nEmail: ${email}\nMessage: ${msg}`;

  var mailOptions = {
    from: process.env.SMTP_MAIL,
    to: process.env.SMTP_MAIL,
    subject: subject,
    text: message,
    html: `
      <h3>Email From Sadid Portfolio</h3>
      <ul>
        <li><p>Name: ${name}</p></li>
        <li><p>Email: ${email}</p></li>
        <li><p>Message: ${msg}</p></li>
      </ul>
    `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Email not sent, server error." });
    } else {
      console.log("Email sent successfully!");
      return res
        .status(200)
        .json({ success: true, message: "Email sent successfully!" });
    }
  });
});

module.exports = { sendEmail };
