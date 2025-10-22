const Course = require("../models/cours");
const User = require("../models/user.model");

const createCourse = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    if (user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Seuls les enseignants peuvent créer des cours" });
    }

    const { title, description, category, level } = req.body;

    const course = new Course({
      title,
      description,
      category,
      level,
      teacher: user._id,
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCoursesForUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("schoolInfo.school");
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    let courses;
    if (user.role === "teacher") {
      courses = await Course.find({ teacher: user._id });
    } else if (user.role === "student") {
      courses = await Course.find({
        _id: { $in: user.objectifs.selectedCourses },
      });
    } else if (user.role === "parent") {
      const children = await User.find({ "tuteurInfo.tuteur": user._id });
      const selectedCourses = children.flatMap(
        (child) => child.objectifs.selectedCourses
      );
      courses = await Course.find({ _id: { $in: selectedCourses } });
    } else {
      courses = await Course.find();
    }

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addStudentToCourse = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== "teacher") {
      return res.status(403).json({
        message: "Seuls les enseignants peuvent ajouter des étudiants",
      });
    }

    const { courseId, studentId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Cours non trouvé" });

    const student = await User.findById(studentId);
    if (!student)
      return res.status(404).json({ message: "Étudiant non trouvé" });

    if (!course.students.includes(studentId)) {
      course.students.push(studentId);
      await course.save();
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeStudentFromCourse = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== "teacher") {
      return res.status(403).json({
        message: "Seuls les enseignants peuvent retirer des étudiants",
      });
    }

    const { courseId, studentId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Cours non trouvé" });

    course.students = course.students.filter(
      (id) => id.toString() !== studentId
    );
    await course.save();

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addChapter = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== "teacher") {
      return res.status(403).json({
        message: "Seuls les enseignants peuvent ajouter des chapitres",
      });
    }

    const { courseId, title, content, resources } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Cours non trouvé" });

    course.chapters.push({ title, content, resources });
    await course.save();

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeChapter = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== "teacher") {
      return res.status(403).json({
        message: "Seuls les enseignants peuvent supprimer des chapitres",
      });
    }

    const { courseId, chapterId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Cours non trouvé" });

    course.chapters = course.chapters.filter(
      (c) => c._id.toString() !== chapterId
    );
    await course.save();

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCourse,
  getCoursesForUser,
  addStudentToCourse,
  removeStudentFromCourse,
  addChapter,
  removeChapter,
};
