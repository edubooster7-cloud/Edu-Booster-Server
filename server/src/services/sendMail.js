const env = require("../config/env");
const { transporter } = require("../config/mails");
const {
  otp_template,
  login_template,
  forgot_password,
  reset_password,
} = require("../utils/email.template");

const sendOtpEmail = async ({ to, firstName, lastName, otp }) => {
  try {
    const date = new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    let htmlContent = otp_template
      .replace("{{firstName}}", firstName)
      .replace("{{lastName}}", lastName)
      .replace("{{otp}}", otp)
      .replace("{{date}}", date);

    // Send the email
    const info = await transporter.sendMail({
      from: `"Edu Booster" <${env.user_email}>`,
      to,
      subject: "Votre code OTP - Edu Booster",
      html: htmlContent,
    });

    console.log("✅ Email envoyé:", info.messageId);
  } catch (error) {
    console.error("❌ Erreur d'envoi d'email:", error);
  }
};

const sendLoginEmail = async ({
  to,
  EMAIL_UTILISATEUR,
  HEURE_CONNEXION,
  LIEU_CONNEXION,
  LIEN_SECURITE,
}) => {
  try {
    const date = new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    let htmlContent = login_template
      .replace("{{EMAIL_UTILISATEUR}}", EMAIL_UTILISATEUR)
      .replace("{{HEURE_CONNEXION}}", HEURE_CONNEXION)
      .replace("{{LIEU_CONNEXION}}", LIEU_CONNEXION)
      .replace("{{LIEN_SECURITE}}", LIEN_SECURITE);

    // Send the email
    const info = await transporter.sendMail({
      from: `"Edu Booster" <${env.user_email}>`,
      to,
      subject: "EduBooster – Nouvelle connexion",
      html: htmlContent,
    });

    console.log("✅ Email envoyé:", info.messageId);
  } catch (error) {
    console.error("❌ Erreur d'envoi d'email:", error);
  }
};

const sendForgotPassword = async ({ to, firstName, lastName, otp }) => {
  try {
    const date = new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    let htmlContent = forgot_password
      .replace("{{firstName}}", firstName)
      .replace("{{lastName}}", lastName)
      .replace("{{otp}}", otp)
      .replace("{{date}}", date);

    // Send the email
    const info = await transporter.sendMail({
      from: `"Edu Booster" <${env.user_email}>`,
      to,
      subject: "Réinitialisation du mot de passe - Edu Booster",
      html: htmlContent,
    });

    console.log("✅ Email envoyé:", info.messageId);
  } catch (error) {
    console.error("❌ Erreur d'envoi d'email:", error);
  }
};

const sendResetPassword = async ({ to, firstName, lastName }) => {
  try {
    const date = new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    let htmlContent = reset_password
      .replace("{{firstName}}", firstName)
      .replace("{{lastName}}", lastName)
      .replace("{{date}}", date);

    // Send the email
    const info = await transporter.sendMail({
      from: `"Edu Booster" <${env.user_email}>`,
      to,
      subject: "Réinitialisation du mot de passe - Edu Booster",
      html: htmlContent,
    });

    console.log("✅ Email envoyé:", info.messageId);
  } catch (error) {
    console.error("❌ Erreur d'envoi d'email:", error);
  }
};

module.exports = {
  sendOtpEmail,
  sendLoginEmail,
  sendForgotPassword,
  sendResetPassword,
};
