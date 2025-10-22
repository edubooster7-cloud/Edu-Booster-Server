require("dotenv").config();

const env = {
  port: process.env.PORT,
  mongo_uri: process.env.MONGO_URI,
  arcjet_key: process.env.ARCJET_KEY,
  arcjet_env: process.env.ARCJET_ENV,
  user_email: process.env.USER_EMAIL,
  user_password: process.env.USER_PASS,
  infobip_url: process.env.INFOBIP_BASE_URL,
  infobip_key: process.env.INFOBIP_API_KEY,
  jwt_secret: process.env.JWT_SECRET,
  cloudinary_cloud: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  client_url: process.env.FRONTEND_URL,
};

module.exports = env;
