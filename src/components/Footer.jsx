// components/Footer.jsx
import React from "react";
import { Container, Row, Col, Nav, Button } from "react-bootstrap";

export const Footer = () => {
  return (
    <footer className="bg-white pt-5 pb-4 border-top">
      <Container>
        <Row className="g-4">
          <Col lg={4} md={6}>
            <h4 className="fw-bold mb-3">ReacTalk</h4>
            <p className="text-muted small w-75">
              A project by Lungsom Lamnio. Technical Lead at GDG AdtU and CTO at
              Vernovate.
            </p>
          </Col>
          <Col lg={2} md={3} xs={6}>
            <h6 className="fw-bold mb-3 text-uppercase small">Product</h6>
            <Nav className="flex-column small gap-2">
              <Nav.Link className="p-0 text-muted">Features</Nav.Link>
              <Nav.Link className="p-0 text-muted">API</Nav.Link>
              <Nav.Link className="p-0 text-muted">Security</Nav.Link>
            </Nav>
          </Col>
          <Col lg={2} md={3} xs={6}>
            <h6 className="fw-bold mb-3 text-uppercase small">Company</h6>
            <Nav className="flex-column small gap-2">
              <Nav.Link className="p-0 text-muted">About Us</Nav.Link>
              <Nav.Link className="p-0 text-muted">Careers</Nav.Link>
              <Nav.Link className="p-0 text-muted">Blog</Nav.Link>
            </Nav>
          </Col>
          <Col lg={4} md={12}>
            <h6 className="fw-bold mb-3 text-uppercase small">Stay Updated</h6>
            <div className="d-flex gap-2">
              <input
                type="email"
                className="form-control rounded-3"
                placeholder="Enter your email"
              />
              <Button variant="dark" className="rounded-3 px-3">
                Join
              </Button>
            </div>
          </Col>
        </Row>
        <hr className="my-4 text-muted opacity-25" />
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
          <p className="text-muted small mb-0">
            © 2026 ReacTalk. Designed by Lungsom Lamnio.
          </p>
          <div className="d-flex gap-4 small text-muted">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
