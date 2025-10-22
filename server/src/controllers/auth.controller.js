const env = require("../config/env");
const HttpError = require("../models/error");
const User = require("../models/user.model");
const {
  sendOtpEmail,
  sendLoginEmail,
  sendForgotPassword,
  sendResetPassword,
} = require("../services/sendMail");
const validatePassword = require("../utils/password.rejex");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, password2, role } =
      req.body;

    if (!firstName || !lastName || !email || !phone || !password || !role) {
      return next(new HttpError("Veuillez remplir tous les champs", 401));
    }

    const newEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return next(new HttpError("Cet email est déjà utilisé", 401));
    }

    if (password !== password2) {
      return next(new HttpError("Les mots de passe ne correspondent pas", 401));
    }

    try {
      validatePassword(password);
    } catch (err) {
      return next(new HttpError(err.message, 401));
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPass = await bcrypt.hash(password, salt);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiration = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const user = new User({
      firstName: firstName,
      lastName: lastName,
      email: newEmail,
      phone: phone,
      password: hashedPass,
      role: role,
      emailVerificationCode: code,
      emailVerificationCodeExpires: expiration,
    });

    await user.save();

    await sendOtpEmail({
      to: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      otp: code,
    });

    res.status(201).json({
      success: true,
      user,
      message: `Un code de vérification a été envoyé à ${user.email}.`,
    });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(error.message || "Une erreur est survenue.", 500)
    );
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) {
      return next(new HttpError("Veuillez entrer le code", 400));
    }

    const user = await User.findOne({ emailVerificationCode: code });
    if (!user) {
      return next(new HttpError("Code de vérification invalide", 404));
    }

    if (user.isVerified) {
      return next(new HttpError("Cet email a déjà été vérifié", 400));
    }

    const now = new Date();
    if (user.emailVerificationCodeExpires < now) {
      return res.status(400).json({
        error: "expired",
        email: user.email,
        message: "Le code a expiré, veuillez en demander un nouveau",
      });
    }

    user.isVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationCodeExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      user,
      message:
        "Votre email a été vérifié, vous pouvez maintenant vous connecter",
    });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(error.message || "Une erreur est survenue.", 500)
    );
  }
};

const newVerificationCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next(new HttpError("Veuillez fournir votre email", 400));
    }

    const newEmail = email.toLowerCase();
    const user = await User.findOne({ email: newEmail });
    if (!user) {
      return next(new HttpError("Utilisateur introuvable", 404));
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiration = new Date(Date.now() + 15 * 60 * 1000);

    user.emailVerificationCode = code;
    user.emailVerificationCodeExpires = expiration;

    await user.save();

    await sendOtpEmail({
      to: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      otp: code,
    });

    res.status(200).json({
      success: true,
      user,
      message: `Un nouveau code de vérification a été envoyé à ${user.email}`,
    });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(error.message || "Une erreur est survenue.", 500)
    );
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new HttpError("Veuillez remplir tous les champs", 400));
    }

    const newEmail = email.toLowerCase();
    const user = await User.findOne({ email: newEmail });
    if (!user) {
      return next(new HttpError("Utilisateur introuvable", 404));
    }

    if (!user.isVerified) {
      return res.status(403).json({
        error: "unverified",
        email: user.email,
        message:
          "Veuillez vérifier votre compte avant de vous connecter. Consultez vos boîtes mail pour le code de vérification.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new HttpError("Mot de passe incorrect", 401));
    }

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const HEURE_CONNEXION = new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const LIEU_CONNEXION =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "Inconnu";

    const LIEN_SECURITE = `${env.client_url}/security?email=${user.email}`;

    await sendLoginEmail({
      to: user.email,
      EMAIL_UTILISATEUR: user.email,
      HEURE_CONNEXION,
      LIEU_CONNEXION,
      LIEN_SECURITE,
    });

    res.status(200).json({
      success: true,
      user,
      accessToken,
      message: "Connexion réussie",
    });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(error.message || "Une erreur est survenue.", 500)
    );
  }
};

const refreshToken = async (req, res, next) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // issue new access token
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );
    res.json({ accessToken });
  } catch (err) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next(new HttpError("L'email est requis", 401));
    }

    const newEmail = email.toLowerCase();
    const user = await User.findOne({ email: newEmail });
    if (!user) {
      return next(new HttpError("Utilisateur introuvable", 402));
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiration = new Date(Date.now() + 15 * 60 * 1000);

    user.resetCode = code;
    user.resetCodeExpires = expiration;

    await user.save();

    await sendForgotPassword({
      to: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      otp: code,
    });

    res.status(200).json({
      success: true,
      user,
      message: `Un code de réinitialisation a été envoyé à ${user.email}.`,
    });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(error.message || "Une erreur est survenue.", 500)
    );
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { code, password, password2 } = req.body;

    if (!code || !password) {
      return next(
        new HttpError("Le code et le nouveau mot de passe sont requis.", 400)
      );
    }

    const user = await User.findOne({ resetCode: code });
    if (!user) {
      return next(
        new HttpError("Code invalide ou utilisateur introuvable.", 404)
      );
    }

    const now = new Date();
    if (user.resetCodeExpires < now) {
      return res.status(400).json({
        success: false,
        error: "expired",
        email: user.email,
        message: "Le code a expiré, veuillez en demander un nouveau.",
      });
    }

    if (password !== password2) {
      return next(new HttpError("Les mots de passe ne correspondent pas", 401));
    }

    try {
      validatePassword(password);
    } catch (err) {
      return next(new HttpError(err.message, 401));
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;

    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    user.refreshToken = undefined

    await user.save();

      await sendResetPassword({
        to: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });

    res.status(200).json({
      success: true,
      message: `Le mot de passe a été réinitialisé avec succès pour ${user.email}.`,
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return next(
      new HttpError(error.message || "Une erreur est survenue.", 500)
    );
  }
};

const newResetCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next(new HttpError("Veuillez fournir votre email", 400));
    }

    const newEmail = email.toLowerCase();
    const user = await User.findOne({ email: newEmail });
    if (!user) {
      return next(new HttpError("Utilisateur introuvable", 404));
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiration = new Date(Date.now() + 15 * 60 * 1000);

    user.resetCode = code;
    user.resetCodeExpires = expiration;

    await user.save();

    await sendForgotPassword({
      to: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      otp: code,
    });

    res.status(200).json({
      success: true,
      user,
      message: `Un nouveau code de réinitialisation a été envoyé à ${user.email}`,
    });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(error.message || "Une erreur est survenue.", 500)
    );
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, newPassword2 } = req.body;
    const { userId } = req.params;

    if (!oldPassword || !newPassword || !newPassword2) {
      return next(new HttpError("Veuillez remplir tous les champs", 400));
    }

    if (newPassword !== newPassword2) {
      return next(new HttpError("Les mots de passe ne correspondent pas", 400));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new HttpError("Utilisateur non trouvé", 404));
    }

    try {
      validatePassword(password);
    } catch (error) {
      return next(new HttpError(err.message, 401));
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return next(new HttpError("L’ancien mot de passe est incorrect", 401));
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPass = await bcrypt.hash(newPassword, salt);

    user.password = hashedPass;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Votre mot de passe a été modifié avec succès",
    });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(error.message || "Une erreur s’est produite", 500)
    );
  }
};

const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const user = await User.findOne({ refreshToken });
      if (user) {
        (user.refreshToken = null), await user.save();
      }
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({ message: "Déconnexion réussie" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  createUser,
  refreshToken,
  verifyEmail,
  newVerificationCode,
  loginUser,
  forgotPassword,
  resetPassword,
  newResetCode,
  changePassword,
  logout,
};
