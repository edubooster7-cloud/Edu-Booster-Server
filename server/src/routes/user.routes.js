const express = require("express");
const multer = require("multer");

const auth = require("../middlewares/auth");
const adminAuth = require("../middlewares/adminAuth");
const protection = require("../middlewares/arcjet");

const {
  getMe,
  updateProfile,
  uploadAvatar,
  updateSchoolInfo,
  deleteAccount,
  getAllUsers,
  getUserById,
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
} = require("../controllers/user.controller");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ================= APPLY RATE LIMITER TO ALL ROUTES =================
// router.use(protection({ max: 2, interval: 60 }));

// ================= USER ROUTES =================
router.get("/me", auth, getMe);
router.put("/me", auth, updateProfile);
router.put("/me/avatar", auth, upload.single("avatar"), uploadAvatar);
router.put("/me/school-info/:userId", updateSchoolInfo);
router.delete("/me", auth, deleteAccount);

router.get("/", auth, getAllUsers);

router.post("/me/phone-number", auth, sendPhoneVerificationCode);
router.post("/me/verify-phone", auth, verifyPhone);
router.post("/me/new-phone-code", auth, newPhoneVerificationCode);
router.put("/me/:userId/phone", auth, updatePhoneNumber);

router.post("/me/tuteur/:userId", addOrUpdateTuteur);
router.post("/me/objects/:userId", addOrUpdateObjectifs);
router.get("/me/:userId/objectifs", getObjectifs);
router.delete("/me/:userId/objectifs", deleteObjectifs);

router.post("/me/exam-info/:userId", addOrUpdateExamInfo);
router.get("/me/:userId/exam-info", auth, getExamInfo);
router.delete("/me/:userId/exam-info", auth, deleteExamInfo);

// ================= ADMIN ROUTES =================
router.get("/:id", auth, adminAuth, getUserById);
router.delete("/:id", auth, adminAuth, adminDeleteUser);
router.put("/:id/role", auth, adminAuth, updateUserRole);
router.put("/:id/toggle-status", auth, adminAuth, toggleUserStatus);
router.put("/:id/reset-password", auth, adminAuth, adminResetPassword);

router.get("/search", auth, adminAuth, searchUsers);

module.exports = router;
