const express = require("express");
const cors = require("cors");
const { notFound, errorHandler } = require("./middlewares/error");
const database = require("./config/database");
require("dotenv").config();
const authRoutes = require("./routes/auth.routes");
const usersRoutes = require("./routes/user.routes");
const schoolRoutes = require("./routes/school.routes");
const messageRoutes = require("./routes/messages.routes");
const coursRoutes = require("./routes/cours.routes");
const env = require("./config/env");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");
const session = require("express-session");

const app = express();

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "the_edu_booster_backend_app",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", (req, res) => {
  res.send("Api is working")
})

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/courses", coursRoutes);


// error handling
app.use(notFound);
app.use(errorHandler);

app.listen(env.port, () => {
  database();
  console.log(`Server running on port: ${env.port}`);
});
