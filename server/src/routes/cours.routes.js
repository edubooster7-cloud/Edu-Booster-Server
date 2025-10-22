const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const protection = require("../middlewares/arcjet");

const {
  createCourse,
  addStudentToCourse,
  removeStudentFromCourse,
  addChapter,
  removeChapter,
  getCoursesForUser,
} = require("../controllers/cours.controller");

router.use(auth);
// router.use(protection({ max: 2, interval: 60 }));

router.post("/", role("teacher"), createCourse);
router.post("/add-student", role("teacher"), addStudentToCourse);
router.post("/remove-student", role("teacher"), removeStudentFromCourse);
router.post("/add-chapter", role("teacher"), addChapter);
router.post("/remove-chapter", role("teacher"), removeChapter);
router.get("/my-courses", getCoursesForUser);

module.exports = router;
