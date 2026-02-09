import React, { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { Send, PersonCircle } from "react-bootstrap-icons";

export default function ChatWindow({ activeChat }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Nitesh Sharma",
      text: "Happy Birthday Lungsom! 🎂",
      time: "10:00 AM",
      isMe: false,
    },
    {
      id: 2,
      sender: "Me",
      text: "Thank you so much, Nitesh!",
      time: "10:05 AM",
      isMe: true,
    },
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMsg = {
      id: messages.length + 1,
      sender: "Me",
      text: message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
    };

    setMessages([...messages, newMsg]);
    setMessage("");
  };

  if (!activeChat) {
    return (
      <div className="h-100 d-flex align-items-center justify-content-center bg-light">
        <p className="text-muted">Select a contact to start chatting</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column h-100">
      {/* Chat Header - Height fixed to 72px to match Sidebar */}
      <div
        className="px-3 border-bottom bg-white d-flex align-items-center sticky-top"
        style={{ height: "72px" }}
      >
        <PersonCircle size={35} className="text-secondary me-3" />
        <div>
          <h6 className="mb-0 fw-bold">{activeChat.name}</h6>
          <small className="text-success small" style={{ fontSize: "0.8rem" }}>
            {activeChat.status}
          </small>
        </div>
      </div>

      {/* Messages Area */}
      <div
        className="flex-grow-1 p-4 overflow-auto d-flex flex-column gap-3"
        style={{ background: "#f0f2f5" }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`d-flex ${msg.isMe ? "justify-content-end" : "justify-content-start"}`}
          >
            <div
              className={`p-3 rounded-4 shadow-sm ${msg.isMe ? "bg-dark text-white rounded-bottom-right-0" : "bg-white text-dark rounded-bottom-left-0"}`}
              style={{ maxWidth: "70%" }}
            >
              <div className="small mb-1 opacity-75">{msg.sender}</div>
              <div>{msg.text}</div>
              <div
                className={`text-end extra-small mt-1 ${msg.isMe ? "opacity-50" : "text-muted"}`}
                style={{ fontSize: "0.7rem" }}
              >
                {msg.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input (Aligned with the bottom) */}
      <div className="p-3 bg-white border-top">
        <Form onSubmit={handleSendMessage}>
          <InputGroup className="bg-light rounded-pill overflow-hidden border-0 px-2">
            <Form.Control
              placeholder="Type a message..."
              className="bg-light border-0 shadow-none py-3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button type="submit" variant="link" className="text-dark pe-3">
              <Send size={24} />
            </Button>
          </InputGroup>
        </Form>
      </div>
    </div>
  );
}
