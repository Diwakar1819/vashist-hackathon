import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import axios from "axios";
import crypto from "crypto";
// Define your secret key and encryption parameters
const SECRET_KEY = "thanush"; // Replace with your secret key
const KEY_LENGTH_BYTES = 32; // 256 bits

// Derive the encryption key using PBKDF2
const key = crypto.pbkdf2Sync(
  SECRET_KEY,
  "salt",
  100,
  KEY_LENGTH_BYTES,
  "sha256"
);

// Encryption function using AES algorithm
function encryptMessage(message, secretKey) {
  const iv = crypto.randomBytes(16); // Generate a random initialization vector
  const cipher = crypto.createCipheriv("aes-256-cbc", secretKey, iv);
  let encryptedMessage = cipher.update(message, "utf-8", "hex");
  encryptedMessage += cipher.final("hex");
  return {
    iv: iv.toString("hex"),
    encryptedMessage,
  };
}

// Decryption function
function decryptMessage(encryptedMessage, secretKey, iv) {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    secretKey,
    Buffer.from(iv, "hex")
  );
  let decryptedMessage = decipher.update(encryptedMessage, "hex", "utf-8");
  decryptedMessage += decipher.final("utf-8");
  return decryptedMessage;
}

// Controller to send a message
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Check if conversation exists, if not, create a new one
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Encrypt the message
    const { iv, encryptedMessage } = encryptMessage(message, key);

    // Create and save the new message
    const newMessage = new Message({
      senderId,
      receiverId,
      iv,
      encryptedMessage,
    });

    await newMessage.save(); // Save message first

    // Update conversation with the new message
    conversation.messages.push(newMessage._id);
    await conversation.save(); // Save conversation with updated messages array

    // Emit the new message to the receiver if online
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage); // Return the new message
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller to get messages
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    // Find conversation between sender and receiver
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Decrypt messages
    const messages = conversation.messages.map((msg) => ({
      ...msg.toJSON(),
      message: decryptMessage(msg.encryptedMessage, key, msg.iv),
    }));

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
// analyse single message and return positivity in them
export const msg_sentiment = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    const messages = conversation.messages.map((message) => message.message);

    const options = {
      method: "POST",
      url: "https://sentiment-analysis9.p.rapidapi.com/sentiment",
      headers: {
        "content-type": "application/json",
        Accept: "application/json",
        "X-RapidAPI-Key": "b65354c2edmsh784f0298ff419c3p113eebjsncdfd0326168d",
        "X-RapidAPI-Host": "sentiment-analysis9.p.rapidapi.com",
      },
      data: messages.map((message, index) => ({
        id: index + 1,
        language: "en",
        text: message,
      })),
    };

    const response = await axios.request(options);
    console.log(response.data);

    res.status(200).json(response.data);
  } catch (err) {
    console.log("Error in getMessages controller: ", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
