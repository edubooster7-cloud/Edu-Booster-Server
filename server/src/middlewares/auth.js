const jwt = require("jsonwebtoken");
const HttpError = require("../models/error");

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new HttpError("Accès refusé, aucun token fourni", 401));
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return next(new HttpError("Token invalide ou expiré", 403));
    }
  } catch (error) {
    console.log(error);
    return next(new HttpError("Erreur d’authentification", 500));
  }
};

module.exports = auth;
