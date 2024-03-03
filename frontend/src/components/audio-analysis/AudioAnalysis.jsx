import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_KEY_NLP = "AIzaSyBMX_ZaUPUUE5wqUDZ-UId0PSsnw94aoHU";
const API_KEY_ASSEMBLYAI = "2a91e62981a84432be2b19486ee4bdf9";
const AudioAnalysis = () => {
  const [transcript, setTranscript] = useState("");
  const [chivalryScore, setChivalryScore] = useState(0);
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");
  const [prediction, setPrediction] = useState("");
  const [probability, setProbability] = useState(null);
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  const fileValidation = () => {
    const fileInput = document.getElementById("file");
    const { name: fileName, size } = fileInput.files[0];
    const fileSize = (size / 1000).toFixed(2);
    const fileNameAndSize = `${fileName} - ${fileSize}KB`;
    document.querySelector(".file-name").textContent = fileNameAndSize;
    document.querySelector(".file-name").style.display = "block";
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      fetch("https://api.assemblyai.com/v2/upload", {
        method: "POST",
        headers: {
          authorization: API_KEY_ASSEMBLYAI,
          "content-type": "application/json",
          "transfer-encoding": "chunked",
        },
        body: text,
      })
        .then((res) => res.json())
        .then((data) => {
          Transcribe(data.upload_url);
        });
    };
    reader.readAsArrayBuffer(fileInput.files[0]);
  };

  const Transcribe = (audioURL) => {
    let soundData = {
      audio_url: audioURL,
    };
    document.getElementById("TranscriptLoading").style.display = "block";

    fetch("https://api.assemblyai.com/v2/transcript", {
      method: "POST",
      headers: {
        authorization: API_KEY_ASSEMBLYAI,
        "content-type": "application/json",
      },
      body: JSON.stringify(soundData),
    })
      .then((res) => res.json())
      .then((data) => {
        const interval = setInterval(() => {
          if (typeof data.id !== "undefined") {
            AwaitStatus(data.id);
          } else {
            clearInterval(interval);
          }
        }, 2000);
      });
  };

  const AwaitStatus = (id) => {
    fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
      method: "GET",
      headers: {
        authorization: API_KEY_ASSEMBLYAI,
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "completed" || data.status === "error") {
          if (data.status === "error") {
            document.getElementById("transcript").value =
              "Error Generating Transcript. Ensure link is valid";
          } else {
            document.getElementById("transcript").value = data.text;
          }
          document.getElementById("TranscriptLoading").style.display = "none";
        }
      });
  };
  const getEmoji = () => {
    if (chivalryScore > 0.25) {
      return "😊"; // Positive emoji
    } else if (chivalryScore < -0.25) {
      return "😔"; // Negative emoji
    } else {
      return "😐"; // Neutral emoji
    }
  };

  const AnalyzeSentiment = () => {
    let textToProcess = document.getElementById("transcript").value;
    const data = {
      document: {
        type: "PLAIN_TEXT",
        content: textToProcess,
      },
      encodingType: "UTF8",
    };

    fetch(
      `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${API_KEY_NLP}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    )
      .then((res) => res.json())
      .then((response) => {
        const sentiment = response.documentSentiment;
        if (sentiment) {
          const score = sentiment.score;
          // Determine sentiment based on score
          let sentimentLabel;
          if (score > 0.25) {
            sentimentLabel = "Positive";
          } else if (score < -0.25) {
            sentimentLabel = "Negative";
          } else {
            sentimentLabel = "Neutral";
          }
          // Update state with sentiment result
          setMessage(`Sentiment: ${sentimentLabel}`);
          setChivalryScore(score);
          setMessageColor("text-green-700"); // Assuming positive sentiment color
        }
      })
      .catch((error) => {
        console.error("Error analyzing sentiment:", error);
        setMessage("Error occurred");
        setChivalryScore(0);
        setMessageColor("text-red-700");
      });
  };

  return (
    <div className="flex flex-col">
      <div className="">
        <button
          className="bg-black w-25 mb-10 text-white  p-2 rounded-xl"
          onClick={handleGoBack}
        >
          Go Back
        </button>
      </div>
      <div>
        <h1 className="underline uppercase font-bold text-3xl">
          Audio Sentiment Analysis
        </h1>
      </div>

      <div className="max-w-2xl mx-auto mt-8 p-6 bg-gray-100 rounded-lg shadow-lg">
        <input
          type="file"
          id="file"
          className="mb-4"
          onChange={fileValidation}
        />
        <div className="file-name hidden"></div>
        <div id="TranscriptLoading" className="hidden"></div>
        <div id="main-sentiment-output" className="mb-4">
          Politeness meter: {chivalryScore}
        </div>
        <div id="ChivalryMessage" className={`mb-4 ${messageColor}`}>
          {message} {getEmoji()} {/* Render emoji based on sentiment */}
        </div>
        <textarea
          id="transcript"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          className="w-full h-32 mb-4 p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
        ></textarea>
        <button
          onClick={AnalyzeSentiment}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Analyze Sentiment
        </button>
      </div>
    </div>
  );
};

export default AudioAnalysis;
