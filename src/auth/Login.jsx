import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [loginDetails, setLoginDetails] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        loginDetails,
      );

      if (response.status === 200) {
        const { token, user } = response.data;

        // Verify the ID property name from the backend
        const actualUserId = user?._id || user?.id;

        if (actualUserId) {
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("userId", String(actualUserId)); // Save as string
          sessionStorage.setItem("username", user.username);
          
          console.log("Session saved for user:", actualUserId);
          alert("Login Successful");
          navigate("/");
        } else {
          console.error("User object received but ID is missing:", user);
          alert("Login error: User ID not found in server response.");
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "An error occurred during login");
    }
  };

  return (
    <div
      className="auth-page-wrapper min-vh-100 d-flex align-items-center py-5"
      style={{ backgroundColor: "#fafaf9" }}
    >
      <Container>
        <Row className="justify-content-center w-100 m-0">
          <Col xs={12} sm={10} md={7} lg={5} xl={4}>
            <Card className="shadow-sm border-0 rounded-5 overflow-hidden">
              <Card.Body className="p-4 p-md-5 bg-white">
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-1" style={{ letterSpacing: "-1px" }}>
                    Welcome Back
                  </h2>
                  <p className="text-muted small">Sign in to continue to ReacTalk</p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="loginUsername">
                    <Form.Label className="small fw-bold text-dark">Username</Form.Label>
                    <Form.Control
                      name="username"
                      value={loginDetails.username}
                      onChange={handleChange}
                      className="py-3 bg-light border-0 rounded-3"
                      type="text"
                      placeholder="Enter your username"
                      autoComplete="username"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="loginPassword">
                    <Form.Label className="small fw-bold text-dark">Password</Form.Label>
                    <Form.Control
                      name="password"
                      value={loginDetails.password}
                      onChange={handleChange}
                      className="py-3 bg-light border-0 rounded-3"
                      type="password"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                    />
                  </Form.Group>

                  <Button
                    variant="dark"
                    type="submit"
                    className="w-100 py-3 rounded-pill fw-bold mb-3 shadow-sm border-0"
                  >
                    Sign In
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <p className="small text-muted mb-0">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-decoration-none fw-bold text-dark">
                      Sign Up
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}