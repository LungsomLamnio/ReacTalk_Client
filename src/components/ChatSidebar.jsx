import React, { useState, useEffect } from "react";
import { ListGroup, InputGroup, Form, Nav, Dropdown } from "react-bootstrap";
import { PersonCircle, Search, ThreeDotsVertical, ChatDots, Telephone, Gear, BoxArrowRight } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ChatSidebar({ contacts, activeChat, setActiveChat, socket, onlineUsers }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // 1. Search Logic: Finds new users to start chats with
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get(`http://localhost:3001/api/user/search?query=${searchTerm}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSearchResults(res.data);
      } catch (err) {
        console.error("Search error", err);
      }
    };
    const delayDebounceFn = setTimeout(() => searchUsers(), 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // 2. WhatsApp Logout Fix: Disconnects socket to clear "Online" status
  const handleLogout = () => {
    if (socket && socket.current) {
      socket.current.disconnect(); 
    }
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="h-100 d-flex bg-white border-end">
      {/* Navigation Rail Layer */}
      <div className="d-flex flex-column align-items-center py-3 border-end bg-light-subtle" style={{ width: "65px" }}>
        <Nav className="flex-column gap-4 align-items-center flex-grow-1">
          <ChatDots size={22} className="text-primary cursor-pointer" />
          <Telephone size={22} className="text-muted cursor-pointer" />
          <Gear size={22} className="text-muted cursor-pointer" />
        </Nav>
        <Dropdown drop="up" align="end">
          <Dropdown.Toggle as="div" className="no-caret cursor-pointer p-0 border-0">
            <PersonCircle size={28} />
          </Dropdown.Toggle>
          <Dropdown.Menu className="rounded-4 shadow border-0 mb-3">
            <Dropdown.Item onClick={() => navigate("/profile")}>My Account</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout} className="text-danger d-flex align-items-center gap-2">
              <BoxArrowRight /> Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Chat List Layer */}
      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: "0" }}>
        <div className="px-3 border-bottom d-flex justify-content-between align-items-center" style={{ height: "72px" }}>
          <h4 className="fw-bold mb-0 text-dark">Chats</h4>
          <ThreeDotsVertical className="text-muted cursor-pointer" />
        </div>
        
        <div className="p-3 bg-light">
          <InputGroup className="bg-white rounded-pill border">
            <InputGroup.Text className="bg-white border-0 ps-3">
              <Search className="text-muted" />
            </InputGroup.Text>
            <Form.Control 
              placeholder="Search users..." 
              className="border-0 shadow-none" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </InputGroup>
        </div>

        <ListGroup variant="flush" className="flex-grow-1 overflow-auto">
          {/* Logic: Display Search Results or Recent Chat History */}
          {(searchTerm ? searchResults : contacts).map((user) => {
            const userId = user._id || user.id;
            // Check if this contact is currently online
            const isOnline = onlineUsers.includes(String(userId));

            return (
              <ListGroup.Item
                key={userId}
                onClick={() => {
                  setActiveChat({
                    id: userId,
                    name: user.username || user.name,
                    profilePic: user.profilePic,
                    status: isOnline ? "Online" : "Offline",
                  });
                  setSearchTerm("");
                }}
                className={`p-3 border-0 border-bottom cursor-pointer ${activeChat?.id === userId ? "bg-light" : ""}`}
              >
                <div className="d-flex align-items-center">
                  <div className="position-relative me-3">
                    {user.profilePic ? (
                      <img 
                        src={`http://localhost:3001${user.profilePic}`} 
                        className="rounded-circle" 
                        style={{ width: "45px", height: "45px", objectFit: "cover" }} 
                        alt="" 
                      />
                    ) : (
                      <PersonCircle size={45} className="text-secondary" />
                    )}
                    {/* WhatsApp style online indicator dot in sidebar */}
                    {isOnline && (
                      <span 
                        className="position-absolute bottom-0 end-0 border border-white border-2 rounded-circle bg-success"
                        style={{ width: "12px", height: "12px" }}
                      ></span>
                    )}
                  </div>
                  <div className="overflow-hidden flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0 fw-bold text-dark text-truncate">
                        {user.username || user.name}
                      </h6>
                    </div>
                    <small className="text-muted text-truncate d-block">
                      {searchTerm ? (user.bio || "Click to message") : user.lastMsg}
                    </small>
                  </div>
                </div>
              </ListGroup.Item>
            );
          })}
          
          {searchTerm && searchResults.length === 0 && (
            <div className="text-center p-4 text-muted small">No users found.</div>
          )}
        </ListGroup>
      </div>
    </div>
  );
}