const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  refreshToken: { type: String },
  avatar: {
    type: String,
    default:
      "https://res.cloudinary.com/dp9aciyww/image/upload/v1758661246/default-avatar_nh1rxy.jpg",
  },
  emailVerificationCode: { type: String },
  emailVerificationCodeExpires: { type: Date },
  isVerified: { type: Boolean, default: false },

  phoneVerificationCode: { type: String },
  phoneVerificationCodeExpires: { type: Date },
  isPhoneVerified: { type: Boolean, default: false },
  provider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },
  isApprouved: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ["admin", "prefect", "teacher", "student", "parent"],
    required: true,
    default: "student",
  },
  schoolInfo: {
    school: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
    classe: { type: String },
    option: { type: String },
  },
  tuteurInfo: {
    tuteur: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lien_de_parente: {
      type: String,
      enum: [
        "père",
        "mère",
        "membre_famille",
        "oncle",
        "tante",
        "grand-père",
        "grand-mère",
        "frère",
        "soeur",
      ],
    },
  },

  objectifs: {
    selectedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    examScore: { type: String },
    joursDisponible: [
      {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
    ],
    dureeParSession: { type: Number, default: 60 },
  },

  examInfo: {
    dateEstimeExamen: { type: Date },
    rappelEtude: {
      type: String,
      enum: [
        "revision_quotidienne",
        "revision_reguliere_3_4_fois_par_semaine",
        "revision_hebdomadaire",
        "revision_mensuelle",
      ],
    },
    modeOffline: {
      type: String,
      enum: ["offline", "online", "hybride"],
      default: "online",
    },
  },

  resetCode: { type: String },
  resetCodeExpires: { type: Date },

  notifications: {
    rapportEtude: { type: Boolean, default: true },
    nouveauxCours: { type: Boolean, default: true },
    recompenses: { type: Boolean, default: true },
    alerteExamenBlanc: { type: Boolean, default: false },
    rappelQuotidien: { type: Boolean, default: true },
    sonActive: { type: Boolean, default: true },
  },

  app: {
    darkMode: { type: Boolean, default: false },
    autoReconnect: { type: Boolean, default: true },
    syncOffline: { type: Boolean, default: true },
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
