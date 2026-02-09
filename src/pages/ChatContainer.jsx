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

  const [activeChat, setActiveChat] = useState(contacts[0]);

  return (
    <Container
      fluid
      className="vh-100 p-0 overflow-hidden"
      style={{ backgroundColor: "#fafaf9" }}
    >
      <Row className="h-100 g-0">
        <Col md={4} lg={3} className="border-end">
          <ChatSidebar
            contacts={contacts}
            activeChat={activeChat}
            setActiveChat={setActiveChat}
          />
        </Col>
        <Col md={8} lg={9}>
          <ChatWindow activeChat={activeChat} />
        </Col>
      </Row>
    </Container>
  );
}
