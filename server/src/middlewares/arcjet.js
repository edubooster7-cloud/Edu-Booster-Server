// src/middlewares/arcjet.js
const HttpError = require("../models/error");
const buildArcjet = require("../config/arcjet");

function protection({ max, interval }) {
  let aj;
  let isSpoofedBot;

  (async () => {
    const inspect = await import("@arcjet/inspect");
    isSpoofedBot = inspect.isSpoofedBot;
    aj = await buildArcjet({ max, interval });
  })();

  return async (req, res, next) => {
    try {
      if (!aj || !isSpoofedBot) {
        return next();
      }

      const decision = await aj.protect(req);

      if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) {
          return next(
            new HttpError(
              "Limite de requêtes dépassée, veuillez réessayer plus tard.",
              429
            )
          );
        } else if (decision.reason.isBot()) {
          return next(new HttpError("Accès refusé aux bots.", 403));
        } else {
          return next(
            new HttpError("Accès refusé par la politique de sécurité.", 403)
          );
        }
      }

      if (decision.results.some(isSpoofedBot)) {
        return res.status(403).json({
          error: "Bot usurpé détecté",
          message: "Activité malveillante de bot détectée",
        });
      }

      next();
    } catch (error) {
      console.error("Erreur de protection Arcjet : ", error);
      next();
    }
  };
}

module.exports = protection;
