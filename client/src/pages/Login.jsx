// client/src/pages/Login.jsx
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const API = "http://localhost:3000/api/v1/auth";

export default function Login() {
  const [emailOnly, setEmailOnly] = useState(""); // first screen
  const [form, setForm] = useState({ email: "", password: "" }); // password screen
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [query] = useSearchParams();

  const emailParam = query.get("email");

  /* -----------------------------------------
     STEP 1: If user comes with ?email=...
     show password login screen
  ------------------------------------------ */
  useEffect(() => {
    if (emailParam) {
      setForm((prev) => ({ ...prev, email: emailParam }));
    }
  }, [emailParam]);

  /* -----------------------------------------
     STEP 2: Email-only form submit
  ------------------------------------------ */
  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!emailOnly.trim()) {
      setError("Please enter your email.");
      return;
    }

    try {
      const res = await axios.post(`${API}/check-email`, {
        email: emailOnly.trim(),
      });

      sessionStorage.setItem("entryEmail", emailOnly.trim());

      if (res.data.exists) {
        navigate(`/login?email=${encodeURIComponent(emailOnly.trim())}`);
      } else {
        navigate(`/signup?email=${encodeURIComponent(emailOnly.trim())}`);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    }
  };

  /* -----------------------------------------
     STEP 3: Password login form submit
  ------------------------------------------ */
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API}/login`, {
        email: form.email,
        password: form.password,
      });

      login(res.data.user, res.data.token);
      navigate("/profile");
    } catch (err) {
      setError("Incorrect email or password.");
    }
  };

  /* -----------------------------------------
     Render FIRST SCREEN (email only)
  ------------------------------------------ */
  if (!emailParam) {
    return (
      <div className="auth-layout">
        <div className="auth-panel">
          <h1>Welcome to Encom</h1>
          <p>Please enter your email to log in or sign up.</p>

          {error && <p className="auth-error">{error}</p>}

          <form className="auth-form" onSubmit={handleEmailSubmit}>
            <label className="auth-label">
              Email
              <input
                type="email"
                className="auth-input"
                value={emailOnly}
                onChange={(e) => setEmailOnly(e.target.value)}
                placeholder="email@example.com"
                required
              />
            </label>

            <button className="auth-button">Continue</button>

            <p className="auth-small">
              By clicking continue, you agree to our Terms and Privacy Policy.
            </p>
          </form>
        </div>

        <div className="auth-image">
          <img src="https://placehold.co/600x800" className="auth-illustration" />
        </div>
      </div>
    );
  }

  /* -----------------------------------------
     Render SECOND SCREEN (password login)
  ------------------------------------------ */
  return (
    <div className="auth-layout">
      <div className="auth-panel">
        <h1>Log In</h1>

        {error && <p className="auth-error">{error}</p>}

        <form className="auth-form" onSubmit={handlePasswordSubmit}>
          <label className="auth-label">
            Email
            <input
              name="email"
              type="email"
              className="auth-input"
              value={form.email}
              readOnly
            />
          </label>

          <label className="auth-label">
            Password
            <input
              name="password"
              type="password"
              className="auth-input"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
              required
            />
          </label>

          <button className="auth-button">Log In</button>
        </form>
      </div>

      <div className="auth-image">
        <img src="https://placehold.co/600x800" className="auth-illustration" />
      </div>
    </div>
  );
}
