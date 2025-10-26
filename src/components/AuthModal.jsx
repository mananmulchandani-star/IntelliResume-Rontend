import React, { useState } from "react";

function AuthModal({ onClose, onAuthSuccess }) {
  const [mode, setMode] = useState("login"); // "login" or "signup"
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(20,22,35,0.65)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "var(--card-bg)",
        borderRadius: "2rem",
        padding: "3rem 2.5rem",
        maxWidth: "420px",
        margin: "auto",
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        boxShadow: "0 8px 32px rgba(50,50,90,0.18)",
        zIndex: 1000,
        color: "var(--text-light)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <button style={{ background: "none", border: "none", position: "absolute", right: 40, top: 35, fontSize: 22, color: "#888", cursor: "pointer" }} onClick={onClose}>×</button>
        <div style={{ display: "flex", marginBottom: "2.2rem", gap: "8px" }}>
          <button style={{
            flex: 1, padding: "0.6rem 0", borderRadius: "0.6rem",
            background: mode === "login" ? "var(--primary-accent)" : "#23283b",
            color: mode === "login" ? "var(--text-light)" : "var(--text-dark)",
            border: "none", cursor: "pointer", fontWeight: 600
          }} onClick={() => setMode("login")}>Login</button>
          <button style={{
            flex: 1, padding: "0.6rem 0", borderRadius: "0.6rem",
            background: mode !== "login" ? "var(--primary-accent)" : "#23283b",
            color: mode !== "login" ? "var(--text-light)" : "var(--text-dark)",
            border: "none", cursor: "pointer", fontWeight: 600
          }} onClick={() => setMode("signup")}>Sign Up</button>
        </div>
        {/* Actual form fields go here, simplified below */}
        {/* Replace below with your Form components or styles */}
        {mode === "signup" ? (
          <>
            <input style={inputStyle} placeholder="Full Name" />
            <input style={inputStyle} placeholder="Email" />
            <input style={inputStyle} placeholder="Password" type="password" />
            <button style={submitStyle}>Create Account</button>
          </>
        ) : (
          <>
            <input style={inputStyle} placeholder="Email" />
            <input style={inputStyle} placeholder="Password" type="password" />
            <button style={submitStyle}>Sign In</button>
          </>
        )}
        <div style={{ marginTop: 22 }}>
          <button style={{
            background: "none", border: "none",
            color: "var(--primary-accent)", fontSize: "1rem", cursor: "pointer"
          }} onClick={onClose}>← Back to Home</button>
        </div>
      </div>
    </div>
  );
}
const inputStyle = {
  width: "100%", marginBottom: "1.3rem", padding: "0.9rem", fontSize: "1.09rem",
  borderRadius: "0.5rem", border: "1.5px solid var(--border-subtle)", background: "#1a1f33", color: "#f7f8fa"
};
const submitStyle = {
  width: "100%", padding: "1rem 0", fontSize: "1.08rem", fontWeight: 700, background: "var(--primary-accent)",
  color: "#f7f8fa", border: "none", borderRadius: "0.7rem", boxShadow: "var(--shadow)", cursor: "pointer"
};
export default AuthModal;
