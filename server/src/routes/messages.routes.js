const express = require("express");
const {
  getAllContacts,
  getContactsByRole,
  getMessageByUserId,
  sendMessage,
  getChatPartners,
} = require("../controllers/message.controller");
const auth = require("../middlewares/auth");
const protection = require("../middlewares/arcjet");

const router = express.Router();

router.use(auth);

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/contacts/:role", getContactsByRole);
router.get("/:id", getMessageByUserId);
router.post("/send/:id", sendMessage);

module.exports = router;
