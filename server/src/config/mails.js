const nodemailer = require("nodemailer");
const env = require("./env");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.user_email,
    pass: env.user_password,
  },
});

module.exports = { transporter };
