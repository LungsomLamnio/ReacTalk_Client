import React, { useState, useEffect } from "react";
import { ListGroup, InputGroup, Form, Nav, Dropdown } from "react-bootstrap";
import { PersonCircle, Search, ThreeDotsVertical, ChatDots, Telephone, Gear, Person, BoxArrowRight, QuestionCircle } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Added 'socket' to props
export default function ChatSidebar({ contacts, activeChat, setActiveChat, socket }) {
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

  // Inside ChatSidebar.jsx
const handleLogout = () => {
  // 1. Force the socket to disconnect before clearing storage
  if (socket && socket.current) {
    socket.current.disconnect(); 
  }

  // 2. Clear tab session
  sessionStorage.clear();

  // 3. Redirect
  navigate("/login");
};

  return (
    <div className="h-100 d-flex bg-white border-end">
      {/* Navigation Rail */}
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

      {/* Chat List */}
      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: "0" }}>
        <div className="px-3 border-bottom d-flex justify-content-between align-items-center" style={{ height: "72px" }}>
          <h4 className="fw-bold mb-0 text-dark">Chats</h4>
          <ThreeDotsVertical className="text-muted cursor-pointer" />
        </div>
        
        <div className="p-3 bg-light">
          <InputGroup className="bg-white rounded-pill border">
            <InputGroup.Text className="bg-white border-0 ps-3"><Search className="text-muted" /></InputGroup.Text>
            <Form.Control 
              placeholder="Search users..." 
              className="border-0 shadow-none" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </InputGroup>
        </div>

        <ListGroup variant="flush" className="flex-grow-1 overflow-auto">
          {(searchTerm ? searchResults : contacts).map((user) => (
            <ListGroup.Item
              key={user._id || user.id}
              onClick={() => {
                setActiveChat({
                  id: user._id || user.id,
                  name: user.username || user.name,
                  profilePic: user.profilePic,
                  status: "Online",
                });
                setSearchTerm("");
              }}
              className={`p-3 border-0 border-bottom cursor-pointer ${activeChat?.id === (user._id || user.id) ? "bg-light" : ""}`}
            >
              <div className="d-flex align-items-center">
                {user.profilePic ? (
                  <img src={`http://localhost:3001${user.profilePic}`} className="rounded-circle me-3" style={{ width: "40px", height: "40px", objectFit: "cover" }} alt="" />
                ) : (
                  <PersonCircle size={40} className="text-secondary me-3" />
                )}
                <div className="overflow-hidden">
                  <h6 className="mb-0 fw-bold text-dark">{user.username || user.name}</h6>
                  <small className="text-muted text-truncate d-block">{searchTerm ? user.bio : user.lastMsg}</small>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
  );
}