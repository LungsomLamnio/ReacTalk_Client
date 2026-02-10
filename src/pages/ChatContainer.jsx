import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";

export default function ChatContainer() {
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

  const [activeChat, setActiveChat] = useState(null); // Default to null for mobile view
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    setIsMobileChatOpen(true); // Switch to ChatWindow on mobile
  };

  return (
    <Container
      fluid
      className="vh-100 p-0 overflow-hidden"
      style={{ backgroundColor: "#fafaf9" }}
    >
      <Row className="h-100 g-0">
        {/* Sidebar: Hidden on mobile if a chat is open */}
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
          />
        </Col>

        {/* Chat Window: Hidden on mobile if no chat is open */}
        <Col
          xs={12}
          md={8}
          lg={9}
          className={`h-100 ${isMobileChatOpen ? "d-block" : "d-none d-md-block"}`}
        >
          <ChatWindow
            activeChat={activeChat}
            onBack={() => setIsMobileChatOpen(false)} // Pass back function
          />
        </Col>
      </Row>
    </Container>
  );
}
