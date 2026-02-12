import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Apple, Android2 } from "react-bootstrap-icons";
import { Counter } from "./Counter";

export const StatsSection = () => {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-5 mt-5 bg-white border-top border-bottom position-relative"
    >
      <Container>
        <Row className="g-5 align-items-center">
          <Col lg={6}>
            <h2 className="display-4 fw-bold mb-4">
              Real-time stats of <br /> our global community
            </h2>
            <p className="text-muted fs-5 mb-5">
              Download the app on your smartphone <br />
              and join the ReacTalk family.
            </p>

            <Row className="text-start">
              <Col xs={4}>
                <h3 className="fw-bold mb-0">
                  <Counter end={100} suffix="k+" startAnimate={isInView} />
                </h3>
                <small
                  className="text-muted text-uppercase fw-bold"
                  style={{ fontSize: "10px" }}
                >
                  active users
                </small>
              </Col>
              <Col xs={4}>
                <h3 className="fw-bold mb-0">
                  <Counter end={1200} startAnimate={isInView} />
                </h3>
                <small
                  className="text-muted text-uppercase fw-bold"
                  style={{ fontSize: "10px" }}
                >
                  communities
                </small>
              </Col>
              <Col xs={4}>
                <h3 className="fw-bold mb-0">
                  <Counter end={500} suffix="+" startAnimate={isInView} />
                </h3>
                <small
                  className="text-muted text-uppercase fw-bold"
                  style={{ fontSize: "10px" }}
                >
                  developers
                </small>
              </Col>
            </Row>
          </Col>

          <Col lg={6}>
            <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-lg-end">
              <div
                className="p-4 rounded-5 shadow-sm border-0 position-relative overflow-hidden"
                style={{
                  backgroundColor: "#f3f3f2",
                  width: "260px",
                  minHeight: "320px",
                }}
              >
                <h4 className="fw-bold mb-1 text-dark">For iOS</h4>
                <p className="text-muted small mb-4">iOS 13.0+</p>
                <Button
                  variant="white"
                  className="bg-white border-0 shadow-sm rounded-3 px-4 py-2 fw-bold mb-5 text-dark"
                >
                  Download
                </Button>
                <div className="d-flex justify-content-between align-items-end mt-4">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://apps.apple.com"
                    alt="iOS QR"
                    className="rounded-3 shadow-sm bg-white p-1"
                    style={{ width: "80px", height: "80px", zIndex: 2 }}
                  />
                  <Apple
                    size={100}
                    style={{
                      color: "#000000",
                      opacity: "0.1",
                      marginBottom: "-10px",
                      marginRight: "-10px",
                      zIndex: 1,
                    }}
                  />
                </div>
              </div>

              <div
                className="p-4 rounded-5 shadow-sm border-0 position-relative overflow-hidden"
                style={{
                  backgroundColor: "#f3f3f2",
                  width: "260px",
                  minHeight: "320px",
                }}
              >
                <h4 className="fw-bold mb-1 text-dark">For Android</h4>
                <p className="text-muted small mb-4">Android 8.0+</p>
                <Button
                  variant="white"
                  className="bg-white border-0 shadow-sm rounded-3 px-4 py-2 fw-bold mb-5 text-dark"
                >
                  Download
                </Button>
                <div className="d-flex justify-content-between align-items-end mt-4">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://play.google.com"
                    alt="Android QR"
                    className="rounded-3 shadow-sm bg-white p-1"
                    style={{ width: "80px", height: "80px", zIndex: 2 }}
                  />
                  <Android2
                    size={100}
                    style={{
                      color: "#3DDC84",
                      opacity: "0.15",
                      marginBottom: "-20px",
                      marginRight: "-15px",
                      transform: "rotate(-10deg)",
                      zIndex: 1,
                    }}
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
