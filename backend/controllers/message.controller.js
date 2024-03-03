import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import axios from "axios";
import Sentiment from "../models/sentiment.model.js";
import Keyword from "../models/keyword.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    // SOCKET IO FUNCTIONALITY WILL GO HERE
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;

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
        "X-RapidAPI-Key": "85db4b9ba3msh71e28a9c6d70ec5p11c017jsn5eac953573d7",
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

    let avgSum = 0;
    for (let i = 0; i < response.data.length; i++) {
      let SentimentScore = response.data[i].predictions[0].probability;
      avgSum += SentimentScore;
    }
    // avgSentimentScore = avgSentimentScore / response.data.length - 1;
    let arrlength = response.data.length - 1;
    let avgSentimentScore = avgSum / arrlength;

    const isExist = await Sentiment.findOne({
      user_id: senderId,
    });
    let sentimentResponse;
    if (isExist) {
      sentimentResponse = await Sentiment.updateOne(
        {
          user_id: senderId,
        },
        {
          score: avgSentimentScore,
        }
      );
    } else {
      sentimentResponse = await Sentiment.create({
        score: avgSentimentScore,
        msg_id: userToChatId,
        user_id: senderId,
      });
    }
    console.log(sentimentResponse);

    res.status(200).json(response.data);
  } catch (err) {
    console.log("Error in getMessages controller: ", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

///
