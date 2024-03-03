import { Link } from "react-router-dom";
import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";

const Home = () => {
  return (
    <div className="flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 shadow-md shadow-white">
      <button className="bg-gray-300 w-25 h-10 rounded-2xl text-black p-2">
        <Link to="/dashboard">Dashboard</Link>
      </button>

      <Sidebar />
      <MessageContainer />
    </div>
  );
};
export default Home;
