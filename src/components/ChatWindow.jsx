import React, { useState, useEffect, useRef } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { Send, PersonCircle, ArrowLeft, ChatDots, Telephone, CameraVideo, ThreeDotsVertical, Check, CheckAll } from "react-bootstrap-icons";
import axios from "axios";
import "../style/ChatWindow.css"; 

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function ChatWindow({ activeChat, onBack, socket, onMessageSent }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const scrollRef = useRef();
  const myId = sessionStorage.getItem("userId");

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChat?.id) return;
      try {
        const token = sessionStorage.getItem("token");
        const convRes = await axios.post(`${BASE_URL}/api/messages/conversation`, { receiverId: activeChat.id }, { headers: { Authorization: `Bearer ${token}` } });
        const cid = convRes.data._id;
        setConversationId(cid);
        const msgRes = await axios.get(`${BASE_URL}/api/messages/${cid}`, { headers: { Authorization: `Bearer ${token}` } });
        setMessages(msgRes.data.map((m) => ({ 
          id: m._id, 
          text: m.text, 
          time: formatTime(m.createdAt), 
          isMe: String(m.senderId || m.sender) === String(myId),
          status: m.status || "sent" 
        })));
        socket.current?.emit("markAsSeen", { conversationId: cid, seenBy: myId, senderId: activeChat.id });
      } catch (err) { console.error("Error fetching messages:", err); }
    };
    fetchMessages();
  }, [activeChat?.id, myId]);

  useEffect(() => {
    if (!socket.current) return;
    const handleNewMessage = (data) => {
      if (activeChat && String(data.senderId) === String(activeChat.id)) {
        setMessages((prev) => [...prev, { id: data.messageId || Date.now(), text: data.text, time: formatTime(data.createdAt || new Date()), isMe: false, status: "seen" }]);
        socket.current.emit("markAsSeen", { conversationId, seenBy: myId, senderId: activeChat.id });
      }
    };
    const handleStatusUpdate = ({ messageId, status }) => setMessages((prev) => prev.map(m => m.id === messageId ? { ...m, status } : m));
    const handleMessagesSeen = ({ seenBy }) => { if (activeChat && String(seenBy) === String(activeChat.id)) setMessages((prev) => prev.map(m => m.isMe ? { ...m, status: "seen" } : m)); };
    socket.current.on("getMessage", handleNewMessage);
    socket.current.on("messageStatusUpdate", handleStatusUpdate);
    socket.current.on("messagesSeen", handleMessagesSeen);
    return () => {
      socket.current?.off("getMessage", handleNewMessage);
      socket.current?.off("messageStatusUpdate", handleStatusUpdate);
      socket.current?.off("messagesSeen", handleMessagesSeen);
    };
  }, [socket, activeChat, conversationId, myId]);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !socket.current || !activeChat || !conversationId) return;
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(`${BASE_URL}/api/messages`, { conversationId, text: message }, { headers: { Authorization: `Bearer ${token}` } });
      const savedMsg = res.data;
      socket.current.emit("sendMessage", { senderId: myId, receiverId: activeChat.id, text: message, messageId: savedMsg._id, createdAt: savedMsg.createdAt });
      setMessages((prev) => [...prev, { id: savedMsg._id, text: message, time: formatTime(savedMsg.createdAt), isMe: true, status: "sent" }]);
      if (onMessageSent) onMessageSent(message);
      setMessage("");
    } catch (err) { console.error("Error sending message:", err); }
  };

  const renderTicks = (status) => {
    if (status === "seen") return <CheckAll className="text-info" style={{ color: "#34b7f1" }} size={18} />; 
    if (status === "received") return <CheckAll className="text-white-50" size={18} />; 
    return <Check className="text-white-50" size={18} />; 
  };

  if (!activeChat) {
    return (
      <div className="h-100 d-flex flex-column align-items-center justify-content-center bg-white">
        <div className="text-center opacity-25"><ChatDots size={80} className="mb-3 text-primary" /><h5 className="fw-bold">Your Conversations</h5><p className="small">Select a contact to start chatting</p></div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column h-100 bg-white shadow-none chat-window-container">
      <div className="px-4 py-2 border-bottom bg-white d-flex align-items-center sticky-top" style={{ height: "72px", zIndex: 10 }}>
        <Button variant="light" className="d-md-none rounded-circle p-2 me-2 border-0 shadow-none" onClick={() => onBack()}><ArrowLeft size={20} /></Button>
        <div className="position-relative me-3 py-1">
          {activeChat.profilePic ? <img src={activeChat.profilePic.startsWith("http") ? activeChat.profilePic : `${BASE_URL}${activeChat.profilePic}`} className="rounded-circle shadow-sm" style={{ width: "45px", height: "45px", objectFit: "cover", border: "1px solid #eee" }} alt="" /> : <PersonCircle size={45} className="text-secondary opacity-25" />}
          {activeChat.status === "Online" && <span className="position-absolute bottom-0 end-0 border border-white border-2 rounded-circle bg-success" style={{ width: "12px", height: "12px", marginBottom: "2px" }}></span>}
        </div>
        <div className="d-flex flex-column justify-content-center py-1">
          <h6 className="mb-0 fw-bold text-dark" style={{ letterSpacing: "-0.5px" }}>{activeChat.name}</h6>
          <small className={activeChat.status === "Online" ? "text-success fw-bold" : "text-muted"} style={{ fontSize: "0.7rem" }}>{activeChat.status === "Online" ? "Active Now" : "Offline"}</small>
        </div>
        <div className="ms-auto d-flex gap-4 text-muted align-items-center pe-2"><Telephone size={18} className="cursor-pointer hover-text-primary transition-all" /><CameraVideo size={20} className="cursor-pointer hover-text-primary transition-all" /><ThreeDotsVertical size={20} className="cursor-pointer hover-text-primary transition-all" /></div>
      </div>

      <div className="flex-grow-1 p-4 overflow-auto d-flex flex-column gap-3 custom-scrollbar" style={{ background: "#f8f9fa", backgroundImage: "radial-gradient(#d1d1d1 0.5px, transparent 0.5px)", backgroundSize: "20px 20px" }}>
        {messages.map((msg) => (
          <div key={msg.id} className={`d-flex ${msg.isMe ? "justify-content-end" : "justify-content-start"}`}>
            <div className={`p-2 px-3 shadow-sm message-bubble ${msg.isMe ? "bg-primary text-white" : "bg-white text-dark border"}`} style={{ borderRadius: msg.isMe ? "18px 18px 0px 18px" : "18px 18px 18px 0px" }}>
              <div style={{ fontSize: "0.95rem", lineHeight: "1.4" }}>{msg.text}</div>
              <div className={`d-flex align-items-center justify-content-end mt-1 ${msg.isMe ? "text-white-50" : "text-muted"}`} style={{ fontSize: "0.6rem" }}>
                {msg.time}{msg.isMe && <span className="ms-1">{renderTicks(msg.status)}</span>}
              </div>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <div className="p-3 bg-white border-top">
        <Form onSubmit={handleSendMessage}>
          <InputGroup className="bg-light rounded-pill border-0 px-2 py-1 shadow-sm">
            <Form.Control placeholder="Type your message..." className="bg-transparent border-0 shadow-none py-2 px-3" value={message} onChange={(e) => setMessage(e.target.value)} />
            <Button type="submit" variant="primary" className="rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm" style={{ width: "40px", height: "40px" }}><Send size={18} /></Button>
          </InputGroup>
        </Form>
      </div>
    </div>
  );
}