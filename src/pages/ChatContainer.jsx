import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom"; 
import { io } from "socket.io-client";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";

export default function ChatContainer() {
  const location = useLocation(); 
  const [contacts] = useState([
    {
      id: 0,
      name: "Nitesh Sharma",
      status: "Online",
      lastMsg: "Happy Birthday Lungsom!",
    },
    {
      id: 1,
      name: "GDG AdtU Team",
      status: "Active Now",
      lastMsg: "Workshop starts at 5.",
    },
    {
      id: 2,
      name: "Vernovate R&D",
      status: "Offline",
      lastMsg: "API docs are ready.",
    },
  ]);

  const [activeChat, setActiveChat] = useState(null);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();

  // 1. Socket Connection & Identity Handshake
  useEffect(() => {
    socket.current = io("http://localhost:3001");
    const userId = sessionStorage.getItem("userId");

    // CRITICAL: Ensure we tell the server who we are as soon as we connect
    if (userId) {
      socket.current.emit("addUser", String(userId)); // Force string for backend Map
    }

    socket.current.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, []);

  // 2. Persistent Identity Check (Useful for multiple tabs/browsers)
  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (socket.current && userId) {
      socket.current.emit("addUser", String(userId));
    }
  }, [activeChat]); // Re-verify identity when switching chats to ensure socket is alive

  // 3. Listen for navigation from ExternalUserProfile
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
    <Container
      fluid
      className="vh-100 p-0 overflow-hidden"
      style={{ backgroundColor: "#fafaf9" }}
    >
      <Row className="h-100 g-0">
        <Col
          xs={12}
          md={4}
          lg={3}
          className={`border-end h-100 ${isMobileChatOpen ? "d-none d-md-block" : "d-block"}`}
        >
          <ChatSidebar
            contacts={contacts}
            activeChat={activeChat}
            setActiveChat={handleSelectChat}
            onlineUsers={onlineUsers}
          />
        </Col>

        <Col
          xs={12}
          md={8}
          lg={9}
          className={`h-100 ${isMobileChatOpen ? "d-block" : "d-none d-md-block"}`}
        >
          <ChatWindow
            activeChat={activeChat}
            socket={socket} // Passing the socket reference to handle real-time UI updates
            onBack={() => setIsMobileChatOpen(false)}
          />
        </Col>
      </Row>
    </Container>
  );
}