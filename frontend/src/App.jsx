import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";
import Dashboard from "./components/dashboard/Dashboard";
import AudioAnalysis from "./components/audio-analysis/AudioAnalysis";
// import Audio from "./components/audio/Audio";

function App() {
  const { authUser } = useAuthContext();

  return (
    <div className="p-4 h-screen flex items-center justify-center">
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" /> : <SignUp />}
        />
        <Route
          path="/dashboard"
          element={authUser ? <Dashboard /> : <SignUp />}
        />
        <Route
          path="/audio-analysis"
          element={authUser ? <AudioAnalysis /> : <SignUp />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
