import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function SignUp() {
  const [formDetails, setFormDetails] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formDetails.password !== formDetails.confirmPassword) {
      alert("Password does not match");
      return;
    }

    try {
      // Updated to Port 5001 to bypass macOS AirPlay conflict
      const response = await axios.post(
        "http://localhost:3001/api/auth/signup",
        {
          username: formDetails.username,
          password: formDetails.password,
        },
      );

      if (response.status === 201) {
        const { token, user } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("username", user.username);

        alert("Signup Successfully, Welcome to ReacTalk.");
        navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.message || "An error occurred during signup");
    }
  };

  const handleChange = (e) => {
    setFormDetails((prevDetails) => ({
      ...prevDetails,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    /* Changed background to match the landing page's #fafaf9 */
    <div
      className="auth-page-wrapper min-vh-100 d-flex align-items-center py-5"
      style={{ backgroundColor: "#fafaf9" }}
    >
      <Container>
        <Row className="justify-content-center w-100 m-0">
          <Col xs={12} sm={10} md={7} lg={5} xl={4}>
            {/* Using rounded-5 to match the soft corners of your QR cards */}
            <Card className="shadow-sm border-0 rounded-5 overflow-hidden">
              <Card.Body className="p-4 p-md-5 bg-white">
                <div className="text-center mb-4">
                  <h2
                    className="fw-bold mb-1"
                    style={{ letterSpacing: "-1px" }}
                  >
                    Join ReacTalk
                  </h2>
                  <p className="text-muted small">
                    Connect with friends in real-time
                  </p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label className="small fw-bold text-dark">
                      Username
                    </Form.Label>
                    <Form.Control
                      name="username"
                      value={formDetails.username}
                      onChange={handleChange}
                      className="py-3 bg-light border-0 rounded-3"
                      type="text"
                      placeholder="Choose a unique username"
                      autoComplete="username"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label className="small fw-bold text-dark">
                      Password
                    </Form.Label>
                    <Form.Control
                      name="password"
                      value={formDetails.password}
                      onChange={handleChange}
                      className="py-3 bg-light border-0 rounded-3"
                      type="password"
                      placeholder="Create a strong password"
                      autoComplete="new-password"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formConfirmPassword">
                    <Form.Label className="small fw-bold text-dark">
                      Confirm Password
                    </Form.Label>
                    <Form.Control
                      name="confirmPassword"
                      value={formDetails.confirmPassword}
                      onChange={handleChange}
                      className="py-3 bg-light border-0 rounded-3"
                      type="password"
                      placeholder="Repeat your password"
                      autoComplete="new-password"
                      required
                    />
                  </Form.Group>

                  {/* Dark pill-style button to match the landing page "Sign Up" button */}
                  <Button
                    variant="dark"
                    type="submit"
                    className="w-100 py-3 rounded-pill fw-bold mb-3 shadow-sm border-0"
                  >
                    Create Account
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <p className="small text-muted mb-0">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-decoration-none fw-bold text-dark"
                    >
                      Sign In
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
