import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { CheckCircleFill, ExclamationCircleFill } from "react-bootstrap-icons";

export default function Login() {
  const [loginDetails, setLoginDetails] = useState({ username: "", password: "" });
  const [status, setStatus] = useState({ loading: false, success: false, error: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: "" });

    try {
      const response = await axios.post("https://reactalk-server.onrender.com/api/auth/login", loginDetails);

      if (response.status === 200) {
        const { token, user } = response.data;
        const actualUserId = user?._id || user?.id;

        if (actualUserId) {
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("userId", String(actualUserId));
          sessionStorage.setItem("username", user.username);
          
          setStatus({ loading: false, success: true, error: "" });
          
          setTimeout(() => navigate("/"), 2000);
        }
      }
    } catch (err) {
      setStatus({ 
        loading: false, 
        success: false, 
        error: err.response?.data?.message || "Invalid credentials" 
      });
    }
  };

  return (
    <div className="auth-page-wrapper min-vh-100 d-flex align-items-center py-5" style={{ backgroundColor: "#fafaf9", position: "relative" }}>
      
      {status.success && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(8px)",
          zIndex: 1050, display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.5s ease"
        }}>
          <div className="text-center p-5 rounded-5 shadow-lg bg-white border" style={{ maxWidth: "350px", animation: "zoomIn 0.3s ease-out" }}>
            <CheckCircleFill size={60} className="text-success mb-3" />
            <h3 className="fw-bold text-dark">Welcome back!</h3>
            <p className="text-muted mb-0">Login successful. Taking you to your chats...</p>
            <style>{`
              @keyframes zoomIn {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
              }
            `}</style>
          </div>
        </div>
      )}

      <Container>
        <Row className="justify-content-center w-100 m-0">
          <Col xs={12} sm={10} md={7} lg={5} xl={4}>
            <Card className="shadow-sm border-0 rounded-5 overflow-hidden">
              <Card.Body className="p-4 p-md-5 bg-white">
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-1" style={{ letterSpacing: "-1px" }}>Welcome Back</h2>
                  <p className="text-muted small">Sign in to continue to ReacTalk</p>
                </div>

                {status.error && (
                  <div className="alert alert-danger border-0 small d-flex align-items-center gap-2 rounded-3 mb-4">
                    <ExclamationCircleFill /> {status.error}
                  </div>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-dark">Username</Form.Label>
                    <Form.Control
                      name="username"
                      value={loginDetails.username}
                      onChange={handleChange}
                      className="py-3 bg-light border-0 rounded-3 shadow-none"
                      placeholder="Enter your username"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="small fw-bold text-dark">Password</Form.Label>
                    <Form.Control
                      name="password"
                      type="password"
                      value={loginDetails.password}
                      onChange={handleChange}
                      className="py-3 bg-light border-0 rounded-3 shadow-none"
                      placeholder="Enter your password"
                      required
                    />
                  </Form.Group>

                  <Button
                    variant="dark"
                    type="submit"
                    className="w-100 py-3 rounded-pill fw-bold mb-3 shadow-sm border-0"
                    disabled={status.loading || status.success}
                  >
                    {status.loading ? "Checking..." : "Sign In"}
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <p className="small text-muted mb-0">
                    Don't have an account? <Link to="/signup" className="text-decoration-none fw-bold text-dark">Sign Up</Link>
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