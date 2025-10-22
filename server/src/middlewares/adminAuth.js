const HttpError = require("../models/error");
const User = require("../models/user.model");

const adminAuth = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return next(new HttpError("Authentification requise", 401));
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new HttpError("Utilisateur non trouvé", 404));
    }

    if (user.role !== "admin") {
      return next(
        new HttpError("Accès refusé : administrateur uniquement", 403)
      );
    }

    next();
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(error.message || "Une erreur s’est produite", 500)
    );
  }
};

module.exports = adminAuth;
