import React from "react";
import { useNavigate } from "react-router-dom";
export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: "95vh",
      background: "white",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <h1 style={{
        fontSize: "3.2rem",
        fontWeight: 900,
        textAlign: "center",
        background: "linear-gradient(90deg, #0015f6ff 60%, #9708f0ff 100%)",
        WebkitBackgroundClip: "text",
        color: "transparent"
      }}>
        Build Your Dream Resume<br />
        In Minutes, Not Hours
      </h1>
      <p style={{
        fontSize: "1.17rem",
        maxWidth: 600,
        color: "var(--text-dark)",
        textAlign: "center",
        margin: "1.2rem 0 2.5rem"
      }}>
        Create professional, ATS-friendly resumes with AI-powered content suggestions.<br />
        Stand out from the crowd with stunning templates and smart recommendations.
      </p>
      <button
        onClick={() => navigate('/auth')}
        style={{
          padding: "1rem 2.4rem",
          fontSize: "1.15rem",
          fontWeight: "bold",
          background: "var(--primary-accent)",
          color: "var(--text-light)",
          borderRadius: "0.75rem",
          border: "none",
          boxShadow: "0 0 30px #7357F5, 0 1px 3px rgba(30,30,50,0.28)",
          marginBottom: "1.3rem",
          cursor: "pointer"
        }}
      >
        Get Started Free
      </button>
      <button
        style={{
          background: "transparent",
          color: "var(--text-dark)",
          fontSize: "1.09rem",
          border: "1.5px solid var(--border-subtle)",
          borderRadius: "0.5rem",
          padding: "8px 24px",
          cursor: "pointer"
        }}
      >
        View Sample
      </button>
    </div>
  );
}
