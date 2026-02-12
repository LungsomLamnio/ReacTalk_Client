import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom"; 
import { io } from "socket.io-client";
import axios from "axios";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";

/**
 * ChatContainer: The central hub for ReacTalk.
 * Manages dynamic recent chats, socket connections, and online status.
 */
export default function ChatContainer() {
  const location = useLocation(); 
  const navigate = useNavigate(); 
  
  const [recentChats, setRecentChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();

  // 1. Initial Fetch of Recent Conversations (WhatsApp Style)
  useEffect(() => {
    const fetchRecentChats = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        // Fetches from the corrected 'getRecentChats' backend controller
        const res = await axios.get("http://localhost:3001/api/messages/recent", {
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

  // 2. Socket Lifecycle & Real-time Sidebar Re-ordering
  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (!userId || userId === "undefined") {
      navigate("/login");
      return;
    }

    // Connect to Socket server
    socket.current = io("http://localhost:3001");
    socket.current.emit("addUser", String(userId));

    // Monitor global online users list
    socket.current.on("getOnlineUsers", (users) => setOnlineUsers(users));

    // WHATSAPP BEHAVIOR: Move incoming message chat to the top
    socket.current.on("getMessage", (data) => {
      setRecentChats((prev) => {
        // Find existing chat in sidebar list
        const existingChat = prev.find((c) => String(c.id) === String(data.senderId));
        // Remove it from current position
        const filtered = prev.filter((c) => String(c.id) !== String(data.senderId));

        const updatedChat = existingChat 
          ? { ...existingChat, lastMsg: data.text }
          : { id: data.senderId, name: "New User", lastMsg: data.text };

        // Return new array with the updated chat at index 0
        return [updatedChat, ...filtered];
      });
    });

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, [navigate]);

  // 3. Sync sidebar when YOU send a message
  const handleMessageSent = (text) => {
    if (!activeChat) return;

    setRecentChats((prev) => {
      // 1. Remove the user from their current position
      const filtered = prev.filter((c) => String(c.id) !== String(activeChat.id));
      
      // 2. Prepend them to the top with the new message
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
                    // Dynamically map online status from socket array
                    status: onlineUsers.includes(String(activeChat.id)) ? "Online" : "Offline" 
                  } 
                : null
            }
            socket={socket}
            onMessageSent={handleMessageSent} // Callback to refresh sidebar order
          />
        </Col>
      </Row>
    </Container>
  );
}