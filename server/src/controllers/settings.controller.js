const User = require("../models/user.model");

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
    res
      .status(500)
      .json({
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

module.exports = {
  getSettings,
  updateNotifications,
  updateStudy,
  updateApp,
};
