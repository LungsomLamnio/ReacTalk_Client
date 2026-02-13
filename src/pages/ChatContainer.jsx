import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom"; 
import { io } from "socket.io-client";
import axios from "axios";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function ChatContainer() {
  const location = useLocation(); 
  const navigate = useNavigate(); 
  
  const [recentChats, setRecentChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();

  const formatSidebarTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const activeChatRef = useRef(activeChat);
  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  useEffect(() => {
    const fetchRecentChats = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${BASE_URL}/api/messages/recent`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const formattedChats = res.data.map(chat => ({
          ...chat,
          time: formatSidebarTime(chat.createdAt || chat.time)
        }));
        
        setRecentChats(formattedChats);
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

    socket.current = io(BASE_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true
    });
    
    socket.current.emit("addUser", String(userId));
    socket.current.on("getOnlineUsers", (users) => setOnlineUsers(users));

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, [navigate]);

  useEffect(() => {
    if (!socket.current) return;
  
    const handleGlobalMessage = (data) => {
      setRecentChats((prev) => {
        const senderId = String(data.senderId);
        const isNotActive = !activeChatRef.current || String(activeChatRef.current.id || activeChatRef.current._id) !== senderId;

        const otherChats = prev.filter((c) => String(c.id || c._id) !== senderId);
        const existingChat = prev.find((c) => String(c.id || c._id) === senderId);
        
        const messageTime = formatSidebarTime(data.createdAt || new Date());

        const updatedChat = existingChat 
          ? { 
              ...existingChat, 
              lastMsg: data.text,
              time: messageTime,
              unreadCount: isNotActive ? (existingChat.unreadCount || 0) + 1 : 0 
            }
          : { 
              id: senderId, 
              name: data.senderName || "New Message", 
              lastMsg: data.text, 
              time: messageTime,
              unreadCount: isNotActive ? 1 : 0 
            };
  
        return [updatedChat, ...otherChats];
      });
    };
  
    socket.current.on("getMessage", handleGlobalMessage);
    return () => socket.current.off("getMessage", handleGlobalMessage);
  }, [socket.current]);

  const handleMessageSent = (text) => {
    if (!activeChat) return;

    setRecentChats((prev) => {
      const chatId = String(activeChat.id || activeChat._id);
      const filtered = prev.filter((c) => String(c.id || c._id) !== chatId);
      
      const updatedChat = { 
        ...activeChat, 
        lastMsg: text, 
        id: chatId,
        time: formatSidebarTime(new Date()), 
        unreadCount: 0
      };
      
      return [updatedChat, ...filtered];
    });
  };

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    setRecentChats((prev) => 
      prev.map((c) => 
        String(c.id || c._id) === String(chat.id || chat._id) 
          ? { ...c, unreadCount: 0 } 
          : c
      )
    );
  };

  const handleBack = () => {
    setActiveChat(null);
  };

  return (
    <Container fluid className="vh-100 p-0 overflow-hidden" style={{ backgroundColor: "#fafaf9" }}>
      <Row className="h-100 g-0">
        <Col 
          xs={12} md={4} lg={3} 
          className={`border-end h-100 ${activeChat ? 'd-none d-md-block' : 'd-block'}`}
        >
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
        
        <Col 
          xs={12} md={8} lg={9} 
          className={`h-100 ${!activeChat ? 'd-none d-md-block' : 'd-block'}`}
        >
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
            onBack={handleBack}
            socket={socket}
            onMessageSent={handleMessageSent}
          />
        </Col>
      </Row>
    </Container>
  );
}