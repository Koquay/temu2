const nodemailer = require("nodemailer");

async function sendEmail(mailOptions) {
  // Create a transporter
  let transporter = nodemailer.createTransport({
    service: "gmail", // you can also use "Outlook", "Yahoo", etc.
    auth: {
      user: "kkwilson852@gmail.com", // your email
      pass: "cgxj iqxz ddep raka ", // app password (NOT your Gmail password)
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
