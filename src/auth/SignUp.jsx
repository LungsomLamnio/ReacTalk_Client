import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { CheckCircleFill, ExclamationCircleFill } from "react-bootstrap-icons";

export default function SignUp() {
  const [formDetails, setFormDetails] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  
  const [status, setStatus] = useState({ loading: false, success: false, error: "" });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormDetails((prevDetails) => ({
      ...prevDetails,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: "" });

    if (formDetails.password !== formDetails.confirmPassword) {
      setStatus({ loading: false, success: false, error: "Passwords do not match" });
      return;
    }

    try {
      const response = await axios.post(
        "https://reactalk-server.onrender.com/api/auth/signup",
        {
          username: formDetails.username,
          password: formDetails.password,
        },
      );

      if (response.status === 201) {
        const { token, user } = response.data;

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("userId", String(user?._id || user?.id));
        sessionStorage.setItem("username", user.username);

        setStatus({ loading: false, success: true, error: "" });
        
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err) {
      setStatus({ 
        loading: false, 
        success: false, 
        error: err.response?.data?.message || "An error occurred during signup" 
      });
    }
  };

  return (
    <div
      className="auth-page-wrapper min-vh-100 d-flex align-items-center py-5"
      style={{ backgroundColor: "#fafaf9", position: "relative" }}
    >
      {status.success && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(8px)",
          zIndex: 1050, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div className="text-center p-5 rounded-5 shadow-lg bg-white border animate-zoom" style={{ maxWidth: "380px" }}>
            <CheckCircleFill size={65} className="text-success mb-3" />
            <h3 className="fw-bold text-dark">Welcome to ReacTalk!</h3>
            <p className="text-muted mb-0">Your account has been created successfully. Getting things ready for you...</p>
          </div>
        </div>
      )}

      <Container>
        <Row className="justify-content-center w-100 m-0">
          <Col xs={12} sm={10} md={7} lg={5} xl={4}>
            <Card className="shadow-sm border-0 rounded-5 overflow-hidden">
              <Card.Body className="p-4 p-md-5 bg-white">
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-1" style={{ letterSpacing: "-1px" }}>Join ReacTalk</h2>
                  <p className="text-muted small">Connect with friends in real-time</p>
                </div>

                {/* Inline Error Message */}
                {status.error && (
                  <Alert variant="danger" className="py-2 small text-center rounded-3 border-0 d-flex align-items-center justify-content-center gap-2">
                    <ExclamationCircleFill /> {status.error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-dark">Username</Form.Label>
                    <Form.Control
                      name="username"
                      value={formDetails.username}
                      onChange={handleChange}
                      className="py-3 bg-light border-0 rounded-3 shadow-none"
                      type="text"
                      placeholder="Choose a unique username"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-dark">Password</Form.Label>
                    <Form.Control
                      name="password"
                      value={formDetails.password}
                      onChange={handleChange}
                      className="py-3 bg-light border-0 rounded-3 shadow-none"
                      type="password"
                      placeholder="Create a strong password"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="small fw-bold text-dark">Confirm Password</Form.Label>
                    <Form.Control
                      name="confirmPassword"
                      value={formDetails.confirmPassword}
                      onChange={handleChange}
                      className="py-3 bg-light border-0 rounded-3 shadow-none"
                      type="password"
                      placeholder="Repeat your password"
                      required
                    />
                  </Form.Group>

                  <Button
                    variant="dark"
                    type="submit"
                    className="w-100 py-3 rounded-pill fw-bold mb-3 shadow-sm border-0"
                    disabled={status.loading || status.success}
                  >
                    {status.loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <p className="small text-muted mb-0">
                    Already have an account?{" "}
                    <Link to="/login" className="text-decoration-none fw-bold text-dark">Sign In</Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      
      <style>{`
        .animate-zoom {
          animation: zoomIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}