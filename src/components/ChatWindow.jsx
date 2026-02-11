import React, { useState, useEffect, useRef } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { Send, PersonCircle, ArrowLeft } from "react-bootstrap-icons";
import axios from "axios";

export default function ChatWindow({ activeChat, onBack, socket }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const scrollRef = useRef();

  const myId = sessionStorage.getItem("userId");

  // 1. Fetch Chat History
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChat?.id) return;
      
      try {
        const token = localStorage.getItem("token");
        const convRes = await axios.post(
          "http://localhost:3001/api/messages/conversation",
          { receiverId: activeChat.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const convId = convRes.data._id;
        setConversationId(convId);

        const msgRes = await axios.get(
          `http://localhost:3001/api/messages/${convId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const history = msgRes.data.map((m) => ({
          id: m._id,
          sender: m.isMe ? "Me" : activeChat.name,
          text: m.text,
          time: new Date(m.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isMe: m.isMe,
        }));

        setMessages(history);
      } catch (err) {
        console.error("Error loading chat history:", err);
      }
    };

    fetchMessages();
  }, [activeChat?.id, myId]);

  // 2. Real-time Socket Listener
  useEffect(() => {
    if (socket.current) {
      const socketHandler = (data) => {
        // Only add if message is from the user we are currently viewing
        if (activeChat && String(data.senderId) === String(activeChat.id)) {
          const newMessage = {
            id: Date.now(), // Unique key for rendering
            sender: activeChat.name,
            text: data.text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: false,
          };
          // Functional update ensures we don't miss messages
          setMessages((prev) => [...prev, newMessage]);
        }
      };

      socket.current.on("getMessage", socketHandler);
      return () => socket.current?.off("getMessage", socketHandler);
    }
  }, [socket, activeChat]);

  // 3. Auto-scroll to bottom - Triggered on every message change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !socket.current || !activeChat || !conversationId) return;

    const token = localStorage.getItem("token");
    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const currentText = message; // Store text to avoid clear race conditions
    setMessage(""); // Clear input immediately for better UX

    try {
      const msgRes = await axios.post(
        "http://localhost:3001/api/messages",
        { conversationId, text: currentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Emit to recipient
      socket.current.emit("sendMessage", {
        senderId: myId,
        receiverId: activeChat.id,
        text: currentText,
      });

      // Update local state instantly for the sender
      const localMsg = {
        id: msgRes.data._id,
        sender: "Me",
        text: currentText,
        time: currentTime,
        isMe: true,
      };

      setMessages((prev) => [...prev, localMsg]);
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Message failed to send.");
      setMessage(currentText); // Restore text if failed
    }
  };

  if (!activeChat) {
    return (
      <div className="h-100 d-flex align-items-center justify-content-center bg-light">
        <p className="text-muted">Select a contact to start chatting</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column h-100 bg-white">
      {/* Header */}
      <div className="px-3 border-bottom bg-white d-flex align-items-center sticky-top" style={{ height: "72px" }}>
        <Button variant="light" className="d-md-none rounded-circle p-2 me-2 border-0 shadow-none" onClick={onBack}>
          <ArrowLeft size={22} className="text-dark" />
        </Button>
        {activeChat.profilePic ? (
          <img src={`http://localhost:3001${activeChat.profilePic}`} className="rounded-circle me-3" style={{ width: "35px", height: "35px", objectFit: "cover" }} alt="" />
        ) : (
          <PersonCircle size={35} className="text-secondary me-3" />
        )}
        <div>
          <h6 className="mb-0 fw-bold">{activeChat.name}</h6>
          <small className="text-success small" style={{ fontSize: "0.8rem" }}>{activeChat.status}</small>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-grow-1 p-4 overflow-auto d-flex flex-column gap-2" style={{ background: "#e5ddd5" }}>
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`d-flex ${msg.isMe ? "justify-content-end" : "justify-content-start"}`}
          >
            <div
              className={`px-3 py-2 shadow-sm ${
                msg.isMe 
                  ? "bg-success text-white rounded-start-4 rounded-bottom-4" 
                  : "bg-white text-dark rounded-end-4 rounded-bottom-4"
              }`}
              style={{ 
                maxWidth: "75%", 
                borderRadius: msg.isMe ? "15px 15px 0 15px" : "15px 15px 15px 0" 
              }}
            >
              {!msg.isMe && (
                <div className="small fw-bold mb-1" style={{ fontSize: "0.75rem", opacity: 0.8 }}>
                  {msg.sender}
                </div>
              )}
              <div style={{ wordBreak: "break-word" }}>{msg.text}</div>
              <div 
                className={`text-end extra-small mt-1 ${msg.isMe ? "text-white-50" : "text-muted"}`} 
                style={{ fontSize: "0.65rem" }}
              >
                {msg.time}
              </div>
            </div>
          </div>
        ))}
        {/* Scroll anchor must be OUTSIDE the map but INSIDE the scroll container */}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-light border-top">
        <Form onSubmit={handleSendMessage}>
          <InputGroup className="bg-white rounded-pill overflow-hidden border px-2">
            <Form.Control
              placeholder="Type a message..."
              className="border-0 shadow-none py-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button type="submit" variant="link" className="text-primary pe-3 shadow-none">
              <Send size={22} />
            </Button>
          </InputGroup>
        </Form>
      </div>
    </div>
  );
}