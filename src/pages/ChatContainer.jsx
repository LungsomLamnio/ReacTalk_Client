import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom"; 
import { io } from "socket.io-client";
import axios from "axios";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";


export default function ChatContainer() {
  const location = useLocation(); 
  const navigate = useNavigate(); 
  
  const [recentChats, setRecentChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();

  useEffect(() => {
    const fetchRecentChats = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("https://reactalk-server.onrender.com/api/messages/recent", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecentChats(res.data);
      } catch (err) {
        console.error("Error fetching recent chats:", err);
      } finally {
        setLoadingChats(false);
      }
    };
    fetchRecentChats();
  }, []);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (!userId || userId === "undefined") {
      navigate("/login");
      return;
    }

    socket.current = io("https://reactalk-server.onrender.com", {
      transports: ["websocket", "polling"],
      withCredentials: true
    });
    socket.current.emit("addUser", String(userId));

    socket.current.on("getOnlineUsers", (users) => setOnlineUsers(users));

    socket.current.on("getMessage", (data) => {
      setRecentChats((prev) => {
        const existingChat = prev.find((c) => String(c.id) === String(data.senderId));
        const filtered = prev.filter((c) => String(c.id) !== String(data.senderId));

        const updatedChat = existingChat 
          ? { ...existingChat, lastMsg: data.text }
          : { id: data.senderId, name: "New User", lastMsg: data.text };

        return [updatedChat, ...filtered];
      });
    });

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, [navigate]);

  useEffect(() => {
    if (!socket.current) return;
  
    const handleIncomingMessage = (data) => {
      setRecentChats((prev) => {
        const filtered = prev.filter((c) => String(c.id) !== String(data.senderId));
        const existingChat = prev.find((c) => String(c.id) === String(data.senderId));
        
        const updatedChat = existingChat 
          ? { ...existingChat, lastMsg: data.text, time: data.time }
          : { id: data.senderId, name: "New Message", lastMsg: data.text, time: data.time };
  
        return [updatedChat, ...filtered];
      });
    };
  
    socket.current.on("getMessage", handleIncomingMessage);
    return () => socket.current?.off("getMessage", handleIncomingMessage);
  }, [recentChats]);

  const handleMessageSent = (text) => {
    if (!activeChat) return;

    setRecentChats((prev) => {
      const filtered = prev.filter((c) => String(c.id) !== String(activeChat.id));
      
      const updatedChat = { 
        ...activeChat, 
        lastMsg: text, 
        id: activeChat.id 
      };
      
      return [updatedChat, ...filtered];
    });
  };

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
  };

  return (
    <Container fluid className="vh-100 p-0 overflow-hidden" style={{ backgroundColor: "#fafaf9" }}>
      <Row className="h-100 g-0">
        <Col xs={12} md={4} lg={3} className="border-end h-100">
          {loadingChats ? (
            <div className="d-flex h-100 align-items-center justify-content-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <ChatSidebar 
              contacts={recentChats} 
              activeChat={activeChat} 
              setActiveChat={handleSelectChat} 
              onlineUsers={onlineUsers}
              socket={socket} 
            />
          )}
        </Col>
        
        <Col xs={12} md={8} lg={9} className="h-100">
        <ChatWindow
          activeChat={
            activeChat 
              ? { 
                  ...activeChat, 
                  status: onlineUsers.some(id => String(id) === String(activeChat.id || activeChat._id)) 
                    ? "Online" 
                    : "Offline" 
                } 
              : null
          }
          socket={socket}
          onMessageSent={handleMessageSent}
        />
</Col>
      </Row>
    </Container>
  );
}