import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./EmailEntry.css";

const API = "http://localhost:3000/api/v1";

export default function EmailEntry() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    setError("");

    try {
      const res = await axios.post(`${API}/auth/check-email`, { email });

      if (res.data.exists) {
        navigate(`/login?email=${encodeURIComponent(email)}`);
      } else {
        navigate(`/signup?email=${encodeURIComponent(email)}`);
      }
    } catch {
      setError("Something went wrong.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Welcome to ENCOM</h1>
        <p className="auth-subtitle">Please enter your email to log in or sign up.</p>

        {error && <p className="auth-error">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label">Email Address</label>
          <input
            type="email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
          />

          <button className="auth-button">Continue</button>
        </form>
      </div>

      <div className="auth-image">
        <img src="https://placehold.co/1200x1800?text=Encom" />
      </div>
    </div>
  );
}
