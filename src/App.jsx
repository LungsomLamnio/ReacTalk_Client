import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./auth/SignUp";
import Login from "./auth/Login";
import { Container } from "react-bootstrap";
import Chat from "./pages/ChatContainer";
import UserProfile from "./pages/UserProfile";
import ExternalUserProfile from "./pages/ExternalUserProfile";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Container fluid className="p-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/user/:id" element={<ExternalUserProfile />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
