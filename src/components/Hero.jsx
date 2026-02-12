import { Container, Row, Col, Button } from "react-bootstrap";
import { DeviceMockup } from "./DeviceMockup";

export const Hero = ({ navigate }) => (
  <section className="py-5 mt-lg-5 position-relative" style={{ zIndex: 1 }}>
    <Container>
      <Row className="align-items-center g-5">
        <Col lg={6}>
          <h1
            className="display-2 fw-bold mb-4"
            style={{ letterSpacing: "-2px", lineHeight: "1.1" }}
          >
            The chat app <br /> of your dreams
          </h1>
          <p className="fs-5 text-muted mb-5 w-75">
            More than 100,000 active users chatting daily. Connect with friends,
            share files, and build communities instantly.
          </p>
          <div className="d-flex gap-3">
            <Button
              variant="dark"
              size="lg"
              className="rounded-3 px-4 py-3 fw-bold shadow-sm"
              onClick={() => navigate("/chat")}
            >
              Get started →
            </Button>
            <Button
              variant="light"
              size="lg"
              className="rounded-3 px-4 py-3 fw-bold border"
              style={{ backgroundColor: "#ffffff" }}
            >
              More about app
            </Button>
          </div>
          <div className="mt-5 pt-4 d-flex gap-4 align-items-center opacity-50 grayscale">
            <span className="fw-bold fs-5 text-uppercase">GDG AdtU</span>
            <span className="fw-bold fs-5 text-uppercase">Vernovate</span>
            <span className="fw-bold fs-5 text-uppercase">Sunstone</span>
          </div>
        </Col>

        <Col lg={6} className="text-center d-flex justify-content-center">
          <DeviceMockup />
        </Col>
      </Row>
    </Container>
  </section>
);
