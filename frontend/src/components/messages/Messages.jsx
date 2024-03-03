import React, { useState, useRef, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";
import { useSentimentContext } from "../../context/SentimentContext";

const Messages = () => {
  const { messages, loading } = useGetMessages();
  useListenMessages();
  const lastMessageRef = useRef();
  const { sentiment } = useSentimentContext();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [summary, setSummary] = useState("");

  const getSummary = async (messageText) => {
    const options = {
      method: "POST",
      url: "https://gpt-summarization.p.rapidapi.com/summarize",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "b65354c2edmsh784f0298ff419c3p113eebjsncdfd0326168d",
        "X-RapidAPI-Host": "gpt-summarization.p.rapidapi.com",
      },
      data: {
        text: messageText,
        num_sentences: 3, // Adjust as needed
      },
    };

    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleGetSummary = async (messageText) => {
    const summary = await getSummary(messageText);
    setSummary(summary);
    setModalIsOpen(true);
  };

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  return (
    <div className="px-4 flex-1 overflow-auto">
      {!loading &&
        messages.length > 0 &&
        messages.map((message, i) => {
          let senti = sentiment?.find((ele) => parseInt(ele.id) === i + 1);
          return (
            <div key={message._id} ref={lastMessageRef}>
              <Message message={message} sentiment={senti} />
              {message.text && message.text.length > 20 && (
                <button onClick={() => handleGetSummary(message.text)}>
                  Get Summary
                </button>
              )}
            </div>
          );
        })}

      {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
      {!loading && messages.length === 0 && (
        <p className="text-center">Send a message to start the conversation</p>
      )}

      {/* Modal to display summary */}
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <h2>Message Summary</h2>
        <p>{summary}</p>
      </Modal>
    </div>
  );
};

export default Messages;
