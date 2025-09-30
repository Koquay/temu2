const nodemailer = require("nodemailer");

async function sendEmail(mailOptions) {
  // Create a transporter
  let transporter = nodemailer.createTransport({
    service: "gmail", // you can also use "Outlook", "Yahoo", etc.
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Send email
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
}

module.exports = { sendEmail };
