const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  resources: [
    {
      type: {
        type: String,
        enum: ["video", "pdf", "link", "image"],
      },
      url: { type: String },
      description: { type: String },
    },
  ],
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Maths",
        "Sciences",
        "Langues",
        "Histoire",
        "Informatique",
        "Autre",
      ],
      default: "Autre",
    },
    level: {
      type: String,
      enum: ["Primaire", "Secondaire", "Université", "Autre"],
      default: "Autre",
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    chapters: [chapterSchema],
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
