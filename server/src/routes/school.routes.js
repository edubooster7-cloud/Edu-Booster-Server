const express = require("express");
const router = express.Router();
const {
  createSchool,
  getSchools,
  getSchoolById,
  updateSchool,
  deleteSchool,
  addStudentToSchool,
  removeStudentFromSchool,
} = require("../controllers/school.controller");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const protection = require("../middlewares/arcjet");

// ✅ Apply rate limit to all school routes (2 requests / 60s)
// router.use(protection({ max: 2, interval: 60 }));

router.post("/", auth, role("prefect"), createSchool);
router.get("/", getSchools);
router.get("/:id", getSchoolById);
router.put("/:id", updateSchool);
router.delete("/:id", deleteSchool);
router.post("/:id/students", addStudentToSchool);
router.delete("/:id/students", removeStudentFromSchool);

module.exports = router;
