import React, { useState, useEffect } from "react";
import { ListGroup, InputGroup, Form, Nav, Dropdown } from "react-bootstrap";
import {
  PersonCircle,
  Search,
  ThreeDotsVertical,
  ChatDots,
  Telephone,
  RecordCircle,
  Archive,
  Star,
  Gear,
  Person,
  BoxArrowRight,
  QuestionCircle,
} from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ChatSidebar({ contacts, activeChat, setActiveChat }) {
  const navigate = useNavigate();

  // New States for Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const searchUsers = async () => {
      // If search is empty, clear results and stop
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:3001/api/user/search?query=${searchTerm}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setSearchResults(res.data);
      } catch (err) {
        console.error("Search error", err);
      }
    };

    // Debounce: Wait 300ms after the user stops typing to call the API
    const delayDebounceFn = setTimeout(() => {
      searchUsers();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="h-100 d-flex bg-white">
      <style>
        {`
          .no-caret::after {
            display: none !important;
          }
          .custom-dropdown-item:hover {
            background-color: #f8f9fa;
          }
        `}
      </style>

      {/* --- Navigation Rail Layer (Left) --- */}
      <div
        className="d-flex flex-column align-items-center py-3 border-end bg-light-subtle"
        style={{ width: "65px" }}
      >
        <Nav className="flex-column gap-4 align-items-center flex-grow-1">
          <div className="position-relative cursor-pointer text-primary">
            <ChatDots size={22} />
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success border border-light"
              style={{ fontSize: "0.6rem" }}
            >
              92
            </span>
          </div>
          <Telephone size={22} className="text-muted cursor-pointer" />
          <RecordCircle size={22} className="text-muted cursor-pointer" />
          <Archive size={22} className="text-muted cursor-pointer" />
          <Star size={22} className="text-muted cursor-pointer" />
        </Nav>

        <div className="d-flex flex-column gap-4 align-items-center pb-2">
          <Dropdown drop="up" align="end">
            <Dropdown.Toggle
              as="div"
              id="settings-dropdown"
              className="no-caret cursor-pointer text-muted p-0 border-0 bg-transparent shadow-none"
              style={{ outline: "none" }}
            >
              <Gear size={22} className="hover-dark" title="Account Settings" />
            </Dropdown.Toggle>

            <Dropdown.Menu
              className="rounded-4 shadow border-0 mb-3 py-2"
              style={{ minWidth: "180px", fontSize: "0.9rem" }}
            >
              <Dropdown.Item
                onClick={() => navigate("/profile")}
                className="py-2 d-flex align-items-center gap-2 custom-dropdown-item"
              >
                <Person size={18} className="text-primary" />
                <span className="fw-medium text-dark">My Account</span>
              </Dropdown.Item>

              <Dropdown.Item className="py-2 d-flex align-items-center gap-2 custom-dropdown-item">
                <QuestionCircle size={18} className="text-muted" />
                <span>Help</span>
              </Dropdown.Item>

              <Dropdown.Divider className="mx-2 opacity-50" />

              <Dropdown.Item
                onClick={() => {
                  localStorage.clear();
                  navigate("/login");
                }}
                className="py-2 d-flex align-items-center gap-2 text-danger custom-dropdown-item"
              >
                <BoxArrowRight size={18} />
                <span>Logout</span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* --- Existing Chat List Layer (Right) --- */}
      <div className="flex-grow-1 d-flex flex-column">
        <div
          className="px-3 border-bottom d-flex justify-content-between align-items-center bg-white sticky-top"
          style={{ height: "72px" }}
        >
          <h4 className="fw-bold mb-0 text-dark">Chats</h4>
          <ThreeDotsVertical className="text-muted cursor-pointer" />
        </div>

        <div className="p-3 bg-light">
          <InputGroup className="bg-white rounded-pill overflow-hidden border">
            <InputGroup.Text className="bg-white border-0 ps-3">
              <Search className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search users by username..."
              className="border-0 shadow-none py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </div>

        <ListGroup variant="flush" className="flex-grow-1 overflow-auto">
          {/* Logic: Show searchResults if searching, otherwise show regular contacts */}
          {(searchTerm ? searchResults : contacts).map((user) => (
            <ListGroup.Item
              key={user._id || user.id}
              onClick={() => {
                if (searchTerm) {
                  // If we are searching, navigate to that person's public profile
                  navigate(`/user/${user._id}`);
                  setSearchTerm(""); // Clear search after navigating
                } else {
                  // If we are in the chat list, just open the chat
                  setActiveChat({
                    id: user._id || user.id,
                    name: user.username || user.name,
                    profilePic: user.profilePic,
                    status: "Online",
                  });
                }
              }}
              className={`p-3 border-0 border-bottom cursor-pointer ${
                activeChat?.id === (user._id || user.id) ? "bg-light" : ""
              }`}
            >
              <div className="d-flex align-items-center">
                {user.profilePic ? (
                  <img
                    src={`http://localhost:3001${user.profilePic}`}
                    className="rounded-circle me-3"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                    }}
                    alt=""
                  />
                ) : (
                  <PersonCircle size={40} className="text-secondary me-3" />
                )}
                <div className="overflow-hidden">
                  <h6 className="mb-0 fw-bold text-dark">
                    {user.username || user.name}
                  </h6>
                  <small className="text-muted text-truncate d-block">
                    {searchTerm ? user.bio : user.lastMsg}
                  </small>
                </div>
              </div>
            </ListGroup.Item>
          ))}

          {/* Empty state for search */}
          {searchTerm && searchResults.length === 0 && (
            <div className="text-center p-4 text-muted small">
              No users found matching "{searchTerm}"
            </div>
          )}
        </ListGroup>
      </div>
    </div>
  );
}
