// client/src/pages/EmailEntry.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:3000/api/v1/auth/check-email";

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

    try {
      // Save email for autofill
      sessionStorage.setItem("entryEmail", email.trim());

      // Check if email exists in DB
      const res = await axios.post(API, { email: email.trim() });

      if (res.data.exists === true) {
        // user already registered → go to login with query param
        navigate(`/login?email=${encodeURIComponent(email.trim())}`);
      } else {
        // new user → go to signup with query param
        navigate(`/signup?email=${encodeURIComponent(email.trim())}`);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
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
            Email
            <input
              type="email"
              className="auth-input"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <button className="auth-button" type="submit">
            Continue
          </button>

          <p className="auth-small">
            By clicking continue, you agree to our Terms and Privacy Policy.
          </p>
        </form>
      </div>

      {/* Desktop image */}
      <div className="auth-image">
        <img
          src="https://placehold.co/600x800"
          className="auth-illustration"
          alt="auth-visual"
        />
      </div>
    </div>
  );
}
