import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom"; 
import { io } from "socket.io-client";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";

export default function ChatContainer() {
  const location = useLocation(); 
  const navigate = useNavigate(); 
  
  const [contacts] = useState([
    { id: 0, name: "Nitesh Sharma", status: "Online", lastMsg: "Happy Birthday Lungsom!" },
    { id: 1, name: "GDG AdtU Team", status: "Active Now", lastMsg: "Workshop starts at 5." },
    { id: 2, name: "Vernovate R&D", status: "Offline", lastMsg: "API docs are ready." },
  ]);

  const [activeChat, setActiveChat] = useState(null);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();

  // 1. Initial Socket Connection & Tab Identity Handshake
  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    
    // If no session exists, stop connection and redirect to login
    if (!userId || userId === "undefined") {
      console.error("No userId found in sessionStorage! Redirecting...");
      navigate("/login");
      return;
    }

    // Initialize socket connection
    socket.current = io("http://localhost:3001");
    
    // Explicitly identify this tab to the server as a string
    socket.current.emit("addUser", String(userId));

    socket.current.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.current?.disconnect();
    };
  }, [navigate]);

  // 2. Persistent Identity Verification (Handles re-syncing on chat switches)
  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (socket.current && userId && userId !== "undefined") {
      socket.current.emit("addUser", String(userId));
    }
  }, [activeChat]);

  // 3. Navigation Listener for Profile-to-Chat redirection
  useEffect(() => {
    if (location.state?.selectedUser) {
      setActiveChat(location.state.selectedUser);
      setIsMobileChatOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    setIsMobileChatOpen(true);
  };

  return (
    <Container fluid className="vh-100 p-0 overflow-hidden" style={{ backgroundColor: "#fafaf9" }}>
      <Row className="h-100 g-0">
        <Col xs={12} md={4} lg={3} className={`border-end h-100 ${isMobileChatOpen ? "d-none d-md-block" : "d-block"}`}>
          <ChatSidebar contacts={contacts} activeChat={activeChat} setActiveChat={handleSelectChat} onlineUsers={onlineUsers} />
        </Col>
        <Col xs={12} md={8} lg={9} className={`h-100 ${isMobileChatOpen ? "d-block" : "d-none d-md-block"}`}>
        // Inside ChatContainer.jsx render
<ChatWindow
  activeChat={
    activeChat 
      ? { 
          ...activeChat, 
          // Check if the current ID exists in the live array from the server
          status: onlineUsers.includes(String(activeChat.id)) ? "Online" : "Offline" 
        } 
      : null
  }
  socket={socket}
  onBack={() => setIsMobileChatOpen(false)}
/>
        </Col>
      </Row>
    </Container>
  );
}