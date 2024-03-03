import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { useSentimentContext } from "../context/SentimentContext";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();
	const {sentiment,setSentiment} = useSentimentContext();

	const sendMessage = async (message) => {
		setLoading(true);
		try {
			const res = await fetch(`/api/messages/send/${selectedConversation._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ message }),
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);

			setMessages([...messages, data]);
			   const res2 = await fetch(
         `/api/messages/msg_sentiment/${selectedConversation._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        }
      )
			const data2 = await res2.json();
			console.log(data2);
      if (data2.error) throw new Error(data2.error)
      // console.log()
			setSentiment(data2);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};
export default useSendMessage;
