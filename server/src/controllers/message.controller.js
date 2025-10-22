const HttpError = require("../models/error");
const Message = require("../models/message");
const User = require("../models/user.model");
const cloudinary = require("cloudinary").v2;
const env = require("../config/env");

cloudinary.config({
  cloud_name: env.cloudinary_cloud,
  api_key: env.cloudinary_api_key,
  api_secret: env.cloudinary_api_secret,
});

const getAllContacts = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const users = await User.find({ _id: { $ne: userId } }).select("-password");

    res.status(200).json({
      success: true,
      contacts: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

const getContactsByRole = async (req, res, next) => {
  try {
    const role = req.params;

    const filter = role ? { role } : {};

    const users = await User.find(filter).select("-password");

    res.status(200).json({
      success: true,
      contacts: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

const getMessageByUserId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: id },
        { sender: id, receiver: userId },
      ],
    });

    if (!messages) {
      return next(new HttpError("No messages found", 404));
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const { text, image } = req.body;
    const { id: receiver } = req.params;
    const { sender } = req.user.id;

    let imageUrl;
    if (image) {
      const response = await cloudinary.uploader.upload(image);
      imageUrl = response.secure_url;
    }

    const message = new Message({
      sender,
      receiver,
      text,
      image: imageUrl,
    });

    await message.save();

    // to do: socket io setup for realtime notification

    res.status(201).json({
      success: true,
      resonse: message,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

const getChatPartners = async (req, res, next) => {
  try {
    const loggedInUser = req.user.id;

    const messages = await Message.find({
      $or: [{ sender: loggedInUser }, { receiver: loggedInUser }],
    });

    const partnersId = [
      ...new Set(
        messages.map((msg) =>
          msg.sender.toString() === loggedInUser.toString()
            ? msg.receiver.toString()
            : msg.sender.toString()
        )
      ),
    ];

    const partners = await User.find({ _id: { $in: partnersId } }).select(
      "-password"
    );

    res.status(200).json({
      success: true,
      response: partners,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = {
  getAllContacts,
  getContactsByRole,
  getMessageByUserId,
  sendMessage,
  getChatPartners,
};
