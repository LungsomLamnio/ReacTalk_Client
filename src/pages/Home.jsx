import React from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { StatsSection } from "../components/StatsSection";
import { Footer } from "../components/Footer";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="landing-page position-relative overflow-hidden"
      style={{ backgroundColor: "#fafaf9", minHeight: "100vh" }}
    >
      <div
        className="position-absolute rounded-circle"
        style={{
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(13,110,253,0.07) 0%, rgba(250,250,249,0) 70%)",
          top: "-150px",
          left: "-150px",
          zIndex: 0,
        }}
      />
      <div
        className="position-absolute rounded-circle"
        style={{
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(25,135,84,0.05) 0%, rgba(250,250,249,0) 70%)",
          bottom: "10%",
          right: "-100px",
          zIndex: 0,
        }}
      />

      <Navigation />

      <Hero navigate={navigate} />

      <StatsSection />

      <Footer />
    </div>
  );
}
