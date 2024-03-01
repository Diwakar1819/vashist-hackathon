import { createContext, useContext, useEffect, useState } from "react";

export const SentimentContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSentimentContext = () => {
  return useContext(SentimentContext);
};

export const SentimentContextProvider = ({ children }) => {
  const [sentiment, setSentiment] = useState(
    JSON.parse(localStorage.getItem("sentiment")) || null
  );
  console.log(sentiment);

  useEffect(() => {
    const value = JSON.stringify(sentiment);
    localStorage.setItem("sentiment", value);

    return () => localStorage.removeItem("sentiment");
  }, [sentiment]);

  return (
    <SentimentContext.Provider value={{ sentiment, setSentiment }}>
      {children}
    </SentimentContext.Provider>
  );
};