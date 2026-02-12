import React, { useState, useEffect, useRef } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { Send, PersonCircle, ArrowLeft, Search, ThreeDotsVertical } from "react-bootstrap-icons";
import axios from "axios";

export default function ChatWindow({ activeChat, onBack, socket }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const scrollRef = useRef();

  // Retrieve identity from sessionStorage for tab-specific messaging
  const myId = sessionStorage.getItem("userId");
  const BASE_URL = "http://localhost:3001";

  // 1. Fetch Chat History and Conversation ID
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChat?.id) return;
      
      try {
        const token = sessionStorage.getItem("token");
        
        // Identify or create the conversation
        const convRes = await axios.post(
          `${BASE_URL}/api/messages/conversation`,
          { receiverId: activeChat.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const convId = convRes.data._id;
        setConversationId(convId);

        // Fetch message history
        const msgRes = await axios.get(
          `${BASE_URL}/api/messages/${convId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const history = msgRes.data.map((m) => ({
          id: m._id,
          sender: m.isMe ? "Me" : activeChat.name,
          text: m.text,
          time: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isMe: m.isMe, // Boolean determined by backend comparison
        }));

        setMessages(history);
      } catch (err) {
        console.error("Error loading chat history:", err);
      }
    };

    fetchMessages();
  }, [activeChat?.id, myId]);

  // 2. REAL-TIME LISTENER: Updates UI instantly when a socket event arrives
  useEffect(() => {
    if (socket.current) {
      const socketHandler = (data) => {
        // Only render if the incoming message is from the user currently open
        if (activeChat && String(data.senderId) === String(activeChat.id)) {
          const incomingMsg = {
            id: Date.now(), 
            sender: activeChat.name,
            text: data.text,
            time: data.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: false, // Received messages are always aligned left
          };
          
          // Use functional update to maintain state integrity
          setMessages((prev) => [...prev, incomingMsg]);
        }
      };

      socket.current.on("getMessage", socketHandler);
      return () => socket.current?.off("getMessage", socketHandler);
    }
  }, [socket, activeChat]);

  // 3. Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4. Send Message Logic
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !socket.current || !activeChat || !conversationId) return;

    const token = sessionStorage.getItem("token");
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    try {
      const msgRes = await axios.post(
        `${BASE_URL}/api/messages`,
        { conversationId, text: message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Emit event to Socket Server for instant delivery to recipient
      socket.current.emit("sendMessage", {
        senderId: myId,
        receiverId: activeChat.id,
        text: message,
      });

      // Update local UI immediately for the sender
      setMessages((prev) => [
        ...prev,
        {
          id: msgRes.data._id,
          sender: "Me",
          text: message,
          time: time,
          isMe: true,
        },
      ]);
      setMessage("");
    } catch (err) {
      console.error("Failed to send:", err);
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
      {/* WhatsApp Style Header */}
      <div 
        className="px-3 border-bottom bg-white d-flex align-items-center sticky-top" 
        style={{ height: "72px" }}
      >
        <Button 
          variant="light" 
          className="d-md-none rounded-circle p-2 me-2 border-0 shadow-none" 
          onClick={onBack}
        >
          <ArrowLeft size={22} className="text-dark" />
        </Button>

        <div className="position-relative me-3">
          {activeChat.profilePic ? (
            <img 
              src={`${BASE_URL}${activeChat.profilePic}`} 
              className="rounded-circle" 
              style={{ width: "45px", height: "45px", objectFit: "cover" }} 
              alt="" 
            />
          ) : (
            <PersonCircle size={45} className="text-secondary" />
          )}
          
          {/* Green dot for Online status indicator */}
          {activeChat.status === "Online" && (
            <span 
              className="position-absolute bottom-0 end-0 border border-white border-2 rounded-circle bg-success"
              style={{ width: "12px", height: "12px" }}
            ></span>
          )}
        </div>

        <div className="d-flex flex-column">
          <h6 className="mb-0 fw-bold text-dark">{activeChat.name}</h6>
          <small 
            className={`fw-medium ${activeChat.status === "Online" ? "text-success" : "text-muted"}`} 
            style={{ fontSize: "0.75rem" }}
          >
            {activeChat.status === "Online" ? "online" : activeChat.status}
          </small>
        </div>

        <div className="ms-auto d-flex gap-3 text-muted pe-2">
          <Search size={18} className="cursor-pointer d-none d-sm-block" />
          <ThreeDotsVertical size={18} className="cursor-pointer" />
        </div>
      </div>

      {/* Messages Area - WhatsApp Background */}
      <div className="flex-grow-1 p-4 overflow-auto d-flex flex-column gap-2" style={{ background: "#e5ddd5" }}>
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`d-flex ${msg.isMe ? "justify-content-end" : "justify-content-start"}`}
          >
            <div 
              className={`p-2 px-3 shadow-sm ${
                msg.isMe 
                  ? "bg-success text-white rounded-start-4 rounded-bottom-4" 
                  : "bg-white text-dark rounded-end-4 rounded-bottom-4"
              }`} 
              style={{ 
                maxWidth: "75%", 
                borderRadius: msg.isMe ? "15px 15px 0 15px" : "15px 15px 15px 0" 
              }}
            >
              <div>{msg.text}</div>
              <div 
                className={`text-end extra-small mt-1 ${msg.isMe ? "text-white-50" : "text-muted"}`} 
                style={{ fontSize: "0.65rem" }}
              >
                {msg.time}
              </div>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Message Input Area */}
      <div className="p-3 bg-light border-top">
        <Form onSubmit={handleSendMessage}>
          <InputGroup className="bg-white rounded-pill border px-2 shadow-sm">
            <Form.Control 
              placeholder="Type a message..." 
              className="border-0 shadow-none py-2" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
            />
            <Button type="submit" variant="link" className="text-primary pe-3">
              <Send size={22} />
            </Button>
          </InputGroup>
        </Form>
      </div>
    </div>
  );
}