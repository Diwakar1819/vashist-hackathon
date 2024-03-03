import Sentiment from "../models/sentiment.model.js";

export const getSentimentScore = async (req, res) => {
  try {
    const { user_id } = req.params;

    const sentimentScores = await Sentiment.find({ user_id });

    res.status(200).json(sentimentScores);
  } catch (err) {
    console.error("Error in getSentimentScore:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
