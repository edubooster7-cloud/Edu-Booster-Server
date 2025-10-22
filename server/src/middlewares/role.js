const User = require("../models/user.model");
const HttpError = require("../models/error");

const role = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return next(new HttpError("Utilisateur non authentifié", 401));
      }

      const user = await User.findById(req.user.id);
      if (!user) return next(new HttpError("Utilisateur non trouvé", 404));

      if (!allowedRoles.includes(user.role)) {
        return next(new HttpError("Accès refusé : rôle non autorisé", 403));
      }

      next();
    } catch (error) {
      console.log(error);
      return next(new HttpError("Erreur serveur", 500));
    }
  };
};

module.exports = role;
