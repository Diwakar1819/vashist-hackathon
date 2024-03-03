import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";
import axios from "axios";
import Modal from "react-modal";

// Set the app element for react-modal
Modal.setAppElement("#root");

const Message = ({ message, sentiment }) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();
  const [summary, setSummary] = useState(null); // State to store the summary
  const [loading, setLoading] = useState(false); // State for loading state
  const [translation, setTranslation] = useState(null); // State for translated message
  const fromMe = message.senderId === authUser._id;
  const formattedTime = extractTime(message.createdAt);
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const profilePic = fromMe
    ? authUser.profilePic
    : selectedConversation?.profilePic;
  const bubbleBgColor = fromMe ? "bg-blue-500" : "";

  const shakeClass = message.shouldShake ? "shake" : "";
  const prediction = sentiment?.predictions[0]?.prediction;
  let borderColor;
  if (prediction === "positive") {
    borderColor = "green";
  } else if (prediction === "negative") {
    borderColor = "red";
  } else {
    borderColor = "yellow";
  }
  const border = `border-2 border-${borderColor}-500`;

  const handleSummarize = async () => {
    // Check if the message word count is more than 30
    if (message.message.split(" ").length > 30) {
      setLoading(true); // Set loading state to true
      try {
        const response = await axios.request({
          method: "POST",
          url: "https://gpt-summarization.p.rapidapi.com/summarize",
          headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key":
              "b65354c2edmsh784f0298ff419c3p113eebjsncdfd0326168d",
            "X-RapidAPI-Host": "gpt-summarization.p.rapidapi.com",
          },
          data: {
            text: message.message,
            num_sentences: 3,
          },
        });
        setSummary(response.data); // Set the summary in the state
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Reset loading state
      }
    }
  };

  const translateMessage = async (textToTranslate) => {
    try {
      const encodedParams = new URLSearchParams();
      encodedParams.set("source_language", "en");
      encodedParams.set("target_language", "id");
      encodedParams.set("text", textToTranslate);

      const options = {
        method: "POST",
        url: "https://text-translator2.p.rapidapi.com/translate",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "X-RapidAPI-Key":
            "b65354c2edmsh784f0298ff419c3p113eebjsncdfd0326168d",
          "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
        },
        data: encodedParams,
      };

      const response = await axios.request(options);
      return response.data.text;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleClickTranslate = async () => {
    setLoading(true);
    const translatedMessage = await translateMessage(message.message);
    setTranslation(translatedMessage);
    setLoading(false);
  };

  useEffect(() => {
    // Reset summary state when message changes
    setSummary(null);
  }, [message]);

  return (
    <div className={`chat ${chatClassName}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="Profile" src={profilePic} />
        </div>
      </div>
      {border && (
        <div
          className={`chat-bubble text-white  ${shakeClass} pb-2`}
          style={{ backgroundColor: `${borderColor}` }}
        >
          <div>{translation ? translation : message.message}</div>
          {message.message.split(" ").length > 30 && !summary && (
            <button
              className="m-2 bg-white text-black rounded-xl font-bold p-2"
              onClick={handleSummarize}
              disabled={loading} // Disable button while loading
            >
              {loading ? "Loading..." : "Get Summary"}
            </button>
          )}
          {/* <button
            className="m-2 bg-white text-black rounded-xl font-bold p-2"
            onClick={handleClickTranslate}
            disabled={loading || translation} // Disable button if already translated or loading
          >
            {/* {loading ? "Translating..." : "Translate"} */}
          {/* </button> */}
        </div>
      )}

      <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
        {formattedTime}
      </div>
      <Modal
        isOpen={summary !== null}
        onRequestClose={() => setSummary(null)}
        style={{
          content: {
            width: "50%",
            height: "50%",
            margin: "auto",
            fontWeight: "bold",
            backgroundColor: "black",
            color: "white",
          },
        }}
      >
        <button onClick={() => setSummary(null)}>&times;</button>
        <p>{summary?.summary}</p>
      </Modal>
    </div>
  );
};

export default Message;
