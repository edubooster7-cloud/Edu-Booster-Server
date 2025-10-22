const School = require("../models/school");
const User = require("../models/user.model");

const createSchool = async (req, res) => {
  try {
    const { name, chef, address, province, ville, commune } = req.body;

    const chefExists = await User.findById(chef);
    if (!chefExists) {
      return res.status(404).json({ message: "Chef introuvable" });
    }

    const school = new School({
      name,
      chef,
      address,
      province,
      ville,
      commune,
    });

    await school.save();
    res.status(201).json(school);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création de l'école",
      error: error.message,
    });
  }
};

const getSchools = async (req, res) => {
  try {
    const schools = await School.find()
      .populate("chef", "firstName lastName email")
      .populate("students", "firstName lastName email");

    res.status(200).json(schools);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des écoles",
      error: error.message,
    });
  }
};

const getSchoolById = async (req, res) => {
  try {
    const school = await School.findById(req.params.id)
      .populate("chef", "firstName lastName email")
      .populate("students", "firstName lastName email");

    if (!school) {
      return res.status(404).json({ message: "École introuvable" });
    }

    res.status(200).json(school);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de l'école",
      error: error.message,
    });
  }
};

const updateSchool = async (req, res) => {
  try {
    const { name, chef, address, province, ville, commune } = req.body;

    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({ message: "École introuvable" });
    }

    if (chef) {
      const chefExists = await User.findById(chef);
      if (!chefExists) {
        return res.status(404).json({ message: "Chef introuvable" });
      }
      school.chef = chef;
    }

    school.name = name || school.name;
    school.address = address || school.address;
    school.province = province || school.province;
    school.ville = ville || school.ville;
    school.commune = commune || school.commune;

    await school.save();
    res.status(200).json(school);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de l'école",
      error: error.message,
    });
  }
};

const deleteSchool = async (req, res) => {
  try {
    const school = await School.findByIdAndDelete(req.params.id);

    if (!school) {
      return res.status(404).json({ message: "École introuvable" });
    }

    res.status(200).json({ message: "École supprimée avec succès" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de l'école",
      error: error.message,
    });
  }
};

const addStudentToSchool = async (req, res) => {
  try {
    const { studentId } = req.body;
    const school = await School.findById(req.params.id);

    if (!school) {
      return res.status(404).json({ message: "École introuvable" });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Étudiant introuvable" });
    }

    if (!school.students.includes(studentId)) {
      school.students.push(studentId);
      await school.save();
    }

    student.isApprouved = true;
    await student.save();

    res.status(200).json({
      message: "Étudiant ajouté et approuvé avec succès",
      school,
      student,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'ajout et l'approbation de l'étudiant",
      error: error.message,
    });
  }
};

const removeStudentFromSchool = async (req, res) => {
  try {
    const { studentId } = req.body;
    const school = await School.findById(req.params.id);

    const student = await User.findById(studentId);

    if (!school) {
      return res.status(404).json({ message: "École introuvable" });
    }

    school.students = school.students.filter(
      (id) => id.toString() !== studentId
    );
    await school.save();

    student.isApprouved = false;
    await student.save();

    res.status(200).json(school);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de l'étudiant",
      error: error.message,
    });
  }
};

module.exports = {
  createSchool,
  getSchools,
  getSchoolById,
  updateSchool,
  deleteSchool,
  addStudentToSchool,
  removeStudentFromSchool,
};
