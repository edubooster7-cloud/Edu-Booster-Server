const HttpError = require("../models/error");
const User = require("../models/user.model");
const sendOtp = require("../services/sendSMS");
const cloudinary = require("cloudinary").v2;
const env = require("../config/env");

cloudinary.config({
  cloud_name: env.cloudinary_cloud,
  api_key: env.cloudinary_api_key,
  api_secret: env.cloudinary_api_secret,
});

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return next(new HttpError("Utilisateur non trouvé", 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(error.message || "Une erreur s’est produite", 500)
    );
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new HttpError("Utilisateur non trouvé", 404));
    }

    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        user[key] = updates[key];
      }
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profil mis à jour avec succès",
      user,
    });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(error.message || "Une erreur s’est produite", 500)
    );
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(error.message || "Une erreur s’est produite", 500)
    );
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return next(new HttpError("Utilisateur non trouvé", 404));
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(error.message || "Une erreur s’est produite", 500)
    );
  }
};

const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new HttpError("Aucun fichier fourni", 400));
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "avatars",
      width: 300,
      height: 300,
      crop: "fill",
    });

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new HttpError("Utilisateur non trouvé", 404));
    }

    user.avatar = result.secure_url;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Avatar mis à jour avec succès",
      avatar: user.avatar,
    });
  } catch (error) {
    console.error(error);
    return next(
      new HttpError(
        error.message || "Erreur lors du téléchargement de l'avatar",
        500
      )
    );
  }
};

const updateSchoolInfo = async (req, res, next) => {
  try {
    const { school, classe, option } = req.body;
    const { userId } = req.params;

    if (!school && !classe && !option) {
      return next(
        new HttpError("Veuillez fournir au moins un champ à mettre à jour", 400)
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new HttpError("Utilisateur non trouvé", 404));
    }

    user.schoolInfo = {
      school: school || user.schoolInfo.school,
      classe: classe || user.schoolInfo.classe,
      option: option || user.schoolInfo.option,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Informations scolaires mises à jour avec succès",
      schoolInfo: user.schoolInfo,
    });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(error.message || "Une erreur s’est produite", 500)
    );
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new HttpError("Utilisateur non trouvé", 404));
    }

    if (user.role === "prefect" || user.role === "admin") {
      await School.updateMany({ chef: user._id }, { $unset: { chef: "" } });
    }

    await School.updateMany(
      { students: user._id },
      { $pull: { students: user._id } }
    );

    await user.remove();

    res.status(200).json({
      success: true,
      message: "Votre compte a été supprimé avec succès",
    });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(error.message || "Une erreur s’est produite", 500)
    );
  }
};

const adminDeleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new HttpError("Utilisateur non trouvé", 404));
    }

    if (user.role === "prefect" || user.role === "admin") {
      await School.updateMany({ chef: user._id }, { $unset: { chef: "" } });
    }

    await School.updateMany(
      { students: user._id },
      { $pull: { students: user._id } }
    );

    await user.remove();

    res.status(200).json({
      success: true,
      message: "Utilisateur supprimé avec succès",
    });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(error.message || "Une erreur s’est produite", 500)
    );
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const allowedRoles = ["admin", "prefect", "teacher", "student", "parent"];

    if (!role || !allowedRoles.includes(role)) {
      return next(new HttpError("Rôle invalide", 400));
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new HttpError("Utilisateur non trouvé", 404));
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Rôle de l'utilisateur mis à jour avec succès",
      user,
    });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(error.message || "Une erreur s’est produite", 500)
    );
  }
};

const sendPhoneVerificationCode = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new HttpError("Utilisateur non trouvé", 404));
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiration = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.phoneVerificationCode = code;
    user.phoneVerificationCodeExpires = expiration;
    await user.save();

    await sendOtp(user.phone, user.phone);

    res.status(200).json({
      success: true,
      message: `Un code de vérification a été envoyé sur le numéro ${user.phone}`,
    });
  } catch (error) {
    console.error(error);
    return next(
      new HttpError(error.message || "Une erreur s’est produite", 500)
    );
  }
};

const verifyPhone = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) {
      return next(
        new HttpError("Veuillez fournir le code de vérification", 400)
      );
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new HttpError("Utilisateur non trouvé", 404));
    }

    if (user.isPhoneVerified) {
      return next(
        new HttpError("Le numéro de téléphone est déjà vérifié", 400)
      );
    }

    if (user.phoneVerificationCode !== code) {
      return next(new HttpError("Code de vérification invalide", 400));
    }

    if (user.phoneVerificationCodeExpires < new Date()) {
      return next(
        new HttpError("Le code a expiré, veuillez en demander un nouveau", 400)
      );
    }

    user.isPhoneVerified = true;
    user.phoneVerificationCode = undefined;
    user.phoneVerificationCodeExpires = undefined;

    await user.save();

    await sendOtp(user.phone, user.phone);

    res.status(200).json({
      success: true,
      message: "Numéro de téléphone vérifié avec succès",
    });
  } catch (error) {
    console.error(error);
    return next(
      new HttpError(error.message || "Une erreur s’est produite", 500)
    );
  }
};

const newPhoneVerificationCode = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new HttpError("Utilisateur non trouvé", 404));
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiration = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.phoneVerificationCode = code;
    user.phoneVerificationCodeExpires = expiration;
    await user.save();

    // TODO: send SMS via your SMS provider
    console.log(`SMS to ${user.phone}: Your new verification code is ${code}`);

    res.status(200).json({
      success: true,
      message: `Un nouveau code de vérification a été envoyé sur le numéro ${user.phone}`,
    });
  } catch (error) {
    console.error(error);
    return next(
      new HttpError(error.message || "Une erreur s’est produite", 500)
    );
  }
};

const updatePhoneNumber = async (req, res) => {
  const { userId } = req.params;
  const { phone } = req.body;

  if (!phone) {
    return res
      .status(400)
      .json({ message: "Le numéro de téléphone est requis." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    user.phone = phone;
    user.isPhoneVerified = false;

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.phoneVerificationCode = code;
    user.phoneVerificationCodeExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    try {
      await sendOtp(phone, code);
    } catch (err) {
      console.error("Erreur lors de l'envoi du SMS:", err);
    }

    return res.json({
      message:
        "Numéro de téléphone mis à jour. Un code de vérification a été envoyé.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new HttpError("Utilisateur non trouvé", 404));
    }

    user.isVerified = !user.isVerified; // toggle active status
    await user.save();

    res.status(200).json({
      success: true,
      message: `Statut de l'utilisateur mis à jour: ${
        user.isVerified ? "Activé" : "Désactivé"
      }`,
      user,
    });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(error.message || "Une erreur s’est produite", 500)
    );
  }
};

const adminResetPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) {
      return next(
        new HttpError("Veuillez fournir un nouveau mot de passe", 400)
      );
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new HttpError("Utilisateur non trouvé", 404));
    }

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Mot de passe de l'utilisateur réinitialisé avec succès",
    });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(error.message || "Une erreur s’est produite", 500)
    );
  }
};

const searchUsers = async (req, res, next) => {
  try {
    const { role, school, classe, option, name } = req.query;

    let filters = {};

    if (role) filters.role = role;
    if (school) filters["schoolInfo.school"] = school;
    if (classe) filters["schoolInfo.classe"] = classe;
    if (option) filters["schoolInfo.option"] = option;
    if (name)
      filters.$or = [
        { firstName: { $regex: name, $options: "i" } },
        { lastName: { $regex: name, $options: "i" } },
      ];

    const users = await User.find(filters).select("-password");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(error.message || "Une erreur s’est produite", 500)
    );
  }
};

const addOrUpdateTuteur = async (req, res) => {
  try {
    const { userId } = req.params;
    const { tuteurId, lien_de_parente } = req.body;

    if (!userId || !tuteurId || !lien_de_parente) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    const validLiens = [
      "père",
      "mère",
      "membre_famille",
      "oncle",
      "tante",
      "grand-père",
      "grand-mère",
      "frère",
      "soeur",
    ];

    if (!validLiens.includes(lien_de_parente)) {
      return res.status(400).json({ message: "Lien de parenté invalide." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    const tuteur = await User.findById(tuteurId);
    if (!tuteur) {
      return res.status(404).json({ message: "Tuteur introuvable." });
    }

    user.tuteurInfo = {
      tuteur: tuteur._id,
      lien_de_parente,
    };

    await user.save();

    const updatedUser = await User.findById(userId).populate(
      "tuteurInfo.tuteur",
      "firstName lastName email phone"
    );

    res.status(200).json({
      message: "Tuteur ajouté/mis à jour avec succès.",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

const addOrUpdateObjectifs = async (req, res) => {
  try {
    const { userId } = req.params;
    const { selectedCourses, examScore, joursDisponible, dureeParSession } =
      req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    const validDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    if (
      joursDisponible &&
      !joursDisponible.every((day) => validDays.includes(day))
    ) {
      return res
        .status(400)
        .json({ message: "Certains jours disponibles sont invalides." });
    }

    user.objectifs = {
      selectedCourses: selectedCourses || user.objectifs.selectedCourses,
      examScore: examScore !== undefined ? examScore : user.objectifs.examScore,
      joursDisponible: joursDisponible || user.objectifs.joursDisponible,
      dureeParSession: dureeParSession || user.objectifs.dureeParSession,
    };

    await user.save();

    const updatedUser = await User.findById(userId).populate(
      "objectifs.selectedCourses",
      "name classe option"
    );

    res.status(200).json({
      message: "Objectifs ajoutés/mis à jour avec succès.",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

const getObjectifs = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate(
      "objectifs.selectedCourses",
      "name classe option"
    );
    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable." });

    res.status(200).json({ objectifs: user.objectifs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

const deleteObjectifs = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable." });

    user.objectifs = {
      selectedCourses: [],
      examScore: "",
      joursDisponible: [],
      dureeParSession: 0,
    };

    await user.save();
    res.status(200).json({ message: "Objectifs supprimés avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

const addOrUpdateExamInfo = async (req, res) => {
  try {
    const userId = req.params;
    const {
      dateEstimeExamen,
      rappelEtude,
      modeOffline,
      dureeRevisionParJour,
      notesSupplementaires,
    } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable." });

    const validRappels = [
      "revision_quotidienne",
      "revision_reguliere_3_4_fois_par_semaine",
      "revision_hebdomadaire",
      "revision_mensuelle",
    ];
    const validModes = ["offline", "online", "hybride"];

    if (rappelEtude && !validRappels.includes(rappelEtude)) {
      return res
        .status(400)
        .json({ message: "Type de rappel d'étude invalide." });
    }
    if (modeOffline && !validModes.includes(modeOffline)) {
      return res.status(400).json({ message: "Mode d'étude invalide." });
    }

    user.examInfo = {
      dateEstimeExamen: dateEstimeExamen || user.examInfo.dateEstimeExamen,
      rappelEtude: rappelEtude || user.examInfo.rappelEtude,
      modeOffline: modeOffline || user.examInfo.modeOffline,
      dureeRevisionParJour:
        dureeRevisionParJour || user.examInfo.dureeRevisionParJour,
      notesSupplementaires:
        notesSupplementaires || user.examInfo.notesSupplementaires,
    };

    await user.save();

    res.status(200).json({
      message: "Informations d'examen ajoutées/mises à jour avec succès.",
      examInfo: user.examInfo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

const getExamInfo = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable." });

    res.status(200).json({ examInfo: user.examInfo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

const deleteExamInfo = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable." });

    user.examInfo = {
      dateEstimeExamen: null,
      rappelEtude: null,
      modeOffline: "online",
      dureeRevisionParJour: 60,
      notesSupplementaires: "",
    };

    await user.save();

    res
      .status(200)
      .json({ message: "Informations d'examen supprimées avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable" });

    res.json({
      profile: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        schoolInfo: user.schoolInfo,
        tuteurInfo: user.tuteurInfo,
      },
      notifications: user.notifications,
      objectifs: user.objectifs,
      examInfo: user.examInfo,
      app: user.app,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const updateNotifications = async (req, res) => {
  try {
    const { notifications } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { notifications } },
      { new: true }
    );
    res.json({ message: "Notifications mises à jour", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour des notifications" });
  }
};

const updateStudy = async (req, res) => {
  try {
    const { objectifs, examInfo } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { objectifs, examInfo } },
      { new: true }
    );
    res.json({ message: "Préférences d’étude mises à jour", user });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour des préférences d’étude",
    });
  }
};

const updateApp = async (req, res) => {
  try {
    const { app } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { app } },
      { new: true }
    );
    res.json({ message: "Paramètres de l'application mis à jour", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de l'application" });
  }
};

const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;

    const validRoles = ["admin", "prefect", "teacher", "student", "parent"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Rôle invalide." });
    }

    const users = await User.find({ role }).select("-password -refreshToken");

    if (!users.length) {
      return res.status(404).json({ message: `Aucun utilisateur trouvé pour le rôle ${role}.` });
    }

    res.status(200).json({
      message: `Liste des utilisateurs avec le rôle ${role}.`,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    res.status(500).json({
      message: "Erreur du serveur lors de la récupération des utilisateurs.",
    });
  }
};

module.exports = {
  getMe,
  updateProfile,
  getAllUsers,
  getUserById,
  uploadAvatar,
  updateSchoolInfo,
  getUsersByRole,
  deleteAccount,
  adminDeleteUser,
  updateUserRole,
  toggleUserStatus,
  adminResetPassword,
  searchUsers,
  sendPhoneVerificationCode,
  verifyPhone,
  newPhoneVerificationCode,
  updatePhoneNumber,
  addOrUpdateTuteur,
  addOrUpdateObjectifs,
  getObjectifs,
  deleteObjectifs,
  addOrUpdateExamInfo,
  getExamInfo,
  deleteExamInfo,
  updateNotifications,
  updateStudy,
  updateApp,
  getSettings,
};
