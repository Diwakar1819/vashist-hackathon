import mongoose from "mongoose";

const sentimentSchema = new mongoose.Schema(
  {
    score: {
      type: Number,
      required: true,
    },
    msg_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Sentiment = mongoose.model("Sentiment", sentimentSchema);

export default Sentiment;