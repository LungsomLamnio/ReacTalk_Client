import React, { useState, useEffect } from "react";
import { ListGroup, InputGroup, Form, Nav, Dropdown } from "react-bootstrap";
import { PersonCircle, Search, ThreeDotsVertical, ChatDots, Telephone, Gear, BoxArrowRight } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ChatSidebar({ contacts, activeChat, setActiveChat, socket, onlineUsers }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get(`https://reactalk-server.onrender.com/api/user/search?query=${searchTerm}`, {
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

  const handleLogout = () => {
    if (socket && socket.current) socket.current.disconnect(); 
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="h-100 d-flex bg-white">
      <div className="d-flex flex-column align-items-center border-end bg-light" style={{ width: "70px", paddingTop: "12px", paddingBottom: "12px" }}>
        <Nav className="flex-column gap-4 align-items-center flex-grow-1">
          <ChatDots size={24} className="text-primary cursor-pointer" />
          <Telephone size={24} className="text-muted cursor-pointer hover-text-dark" />
          <Gear size={24} className="text-muted cursor-pointer hover-text-dark" />
        </Nav>

        <Dropdown drop="up" align="end">
          <Dropdown.Toggle as="div" className="cursor-pointer p-0 border-0 shadow-none">
            <PersonCircle size={32} className="text-dark opacity-75" />
          </Dropdown.Toggle>
          <Dropdown.Menu className="rounded-4 shadow-lg border-0 mb-3">
            <Dropdown.Item onClick={() => navigate("/profile")} className="py-2">My Account</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout} className="text-danger py-2 d-flex align-items-center gap-2">
              <BoxArrowRight /> Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: "0" }}>
        <div className="px-3 border-bottom d-flex justify-content-between align-items-center bg-white" style={{ height: "72px" }}>
          <h5 className="fw-bold mb-0 text-dark" style={{ letterSpacing: "-0.5px" }}>Chats</h5>
          <div className="d-flex align-items-center pe-1">
             <ThreeDotsVertical size={24} className="text-dark cursor-pointer p-1 rounded-circle hover-bg-light" style={{ opacity: 1 }} />
          </div>
        </div>
        
        <div className="p-3">
          <InputGroup className="bg-light rounded-pill border-0 px-2 overflow-hidden shadow-none">
            <InputGroup.Text className="bg-transparent border-0 ps-3">
              <Search className="text-muted" size={14} />
            </InputGroup.Text>
            <Form.Control 
              placeholder="Search conversations..." 
              className="bg-transparent border-0 shadow-none py-2 small" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </InputGroup>
        </div>

        <ListGroup variant="flush" className="flex-grow-1 overflow-auto custom-scrollbar">
          {(searchTerm ? searchResults : contacts).map((user) => {
            const userId = user._id || user.id;
            
            const isOnline = onlineUsers.some(onlineId => String(onlineId) === String(userId));
            const isActive = String(activeChat?.id || activeChat?._id) === String(userId);

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
                className={`p-3 border-0 transition-all cursor-pointer mx-2 my-1 rounded-4 ${isActive ? "bg-primary-subtle" : "hover-bg-light"}`}
              >
                <div className="d-flex align-items-center">
                  <div className="position-relative me-3">
                    {user.profilePic ? (
                      <img 
                        src={user.profilePic?.startsWith("http") ? user.profilePic : `https://reactalk-server.onrender.com${user.profilePic}`} 
                        className="rounded-circle shadow-sm" 
                        style={{ width: "50px", height: "50px", objectFit: "cover", border: "2px solid white" }} 
                        alt="" 
                      />
                    ) : (
                      <div className="bg-secondary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px" }}>
                        <PersonCircle size={32} className="text-secondary opacity-50" />
                      </div>
                    )}
                    {isOnline && (
                      <span className="position-absolute bottom-0 end-0 border border-white border-2 rounded-circle bg-success shadow-sm" style={{ width: "14px", height: "14px" }}></span>
                    )}
                  </div>
                  <div className="overflow-hidden flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className={`mb-0 fw-bold text-truncate ${isActive ? "text-primary" : "text-dark"}`}>{user.username || user.name}</h6>
                      <small className="text-muted extra-small">
                        {user.time || "12:45 PM"}
                      </small>
                    </div>
                    <small className="text-muted text-truncate d-block mt-1" style={{ fontSize: "0.85rem" }}>
                      {searchTerm ? (user.bio || "Available") : user.lastMsg}
                    </small>
                  </div>
                </div>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </div>
    </div>
  );
}