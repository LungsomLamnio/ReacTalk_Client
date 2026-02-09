import React, { useState, useEffect } from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PersonCircle, BoxArrowRight } from "react-bootstrap-icons";
import axios from "axios";

export const Navigation = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState("");

  const BASE_URL = "http://localhost:3001";

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("username");

      if (token) {
        try {
          // Fetch the full user object to get the profile picture path
          const response = await axios.get(`${BASE_URL}/api/user/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setUser(response.data.username);
          if (response.data.profilePic) {
            setProfilePic(`${BASE_URL}${response.data.profilePic}`);
          }
        } catch (err) {
          console.error("Error fetching navbar user data", err);
          // If token is invalid, clear user state
          setUser(null);
        }
      } else if (storedUser) {
        // Fallback to localStorage if no network/token yet
        setUser(storedUser);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
    setProfilePic("");
    navigate("/");
  };

  return (
    <Navbar
      bg="white"
      expand="lg"
      className="py-4 border-bottom border-light-subtle sticky-top shadow-sm"
      style={{ zIndex: 1000 }}
    >
      <Container>
        <Navbar.Brand href="#" className="fw-bold fs-3">
          ReacTalk
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto gap-lg-4">
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="#community">Community</Nav.Link>
            <Nav.Link href="#faq">FAQ</Nav.Link>
          </Nav>

          <div className="d-flex gap-3 align-items-center">
            {/* Conditional Rendering for Profile Icon */}
            <div
              className="rounded-circle bg-light d-flex align-items-center justify-content-center overflow-hidden border"
              style={{ width: "35px", height: "35px", cursor: "pointer" }}
              onClick={() => user && navigate("/profile")}
            >
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-100 h-100 object-fit-cover"
                />
              ) : (
                <PersonCircle size={28} className="text-dark opacity-75" />
              )}
            </div>

            {user ? (
              <div className="d-flex align-items-center gap-3">
                <span className="fw-bold text-dark">{user}</span>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="rounded-pill px-3 border-0"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <BoxArrowRight size={20} />
                </Button>
              </div>
            ) : (
              <div className="d-flex gap-3 align-items-center">
                <Nav.Link
                  onClick={() => navigate("/login")}
                  className="fw-bold text-dark"
                >
                  Log in
                </Nav.Link>
                <Button
                  variant="dark"
                  className="rounded-pill px-4 py-2 fw-bold"
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
