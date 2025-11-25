import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:3000/api/v1";

export default function EmailEntry() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API_BASE_URL}/api/v1/auth/check-email`, {
        email,
      });

      const exists = res.data.exists;

      // SAVE email temporarily for login/register screens
      sessionStorage.setItem("entryEmail", email);

      if (exists) {
        navigate("/login");
      } else {
        navigate("/register");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-panel">
        <h1>Welcome to Encom</h1>
        <p>Please enter your email to log in or sign up.</p>

        {error && <p className="auth-error">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label">
            Your Email
            <input
              type="email"
              className="auth-input"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <button className="auth-button" disabled={loading}>
            {loading ? "Checking..." : "Continue"}
          </button>
        </form>
      </div>

      <div className="auth-image">
        <img
          src="https://placehold.co/600x800"
          className="auth-illustration"
        />
      </div>
    </div>
  );
}
