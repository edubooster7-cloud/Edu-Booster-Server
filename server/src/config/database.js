const mongoose = require("mongoose");
const env = require("./env");

const database = async () => {
  try {
    const conn = await mongoose.connect(env.mongo_uri);
    console.log("La base de donnée est connecté: ", conn.connection.host);
  } catch (error) {
    console.error("Erreur de connection a la base de données: ", error);
    process.exit(1);
  }
};

module.exports = database;
