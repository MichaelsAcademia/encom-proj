// client/src/pages/Register.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const API = "http://localhost:3000/api/v1/auth";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [query] = useSearchParams();

  const emailParam = query.get("email");

  /* --------------------------------------------------
     STEP 1 — Autofill email from query param
  --------------------------------------------------- */
  useEffect(() => {
    if (emailParam) {
      setForm((prev) => ({ ...prev, email: emailParam }));
    }
  }, [emailParam]);

  /* --------------------------------------------------
     STEP 2 — Handle input changes
  --------------------------------------------------- */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* --------------------------------------------------
     STEP 3 — Submit signup
  --------------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await axios.post(`${API}/register`, {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      navigate(`/login?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      console.error(err);
      setError("Registration failed. Email may already be registered.");
    }
  };

  /* --------------------------------------------------
     STEP 4 — Render UI
  --------------------------------------------------- */
  return (
    <div className="auth-layout">
      <div className="auth-panel">
        <h1>Sign Up</h1>

        {error && <p className="auth-error">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label">
            Username
            <input
              name="name"
              type="text"
              className="auth-input"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label className="auth-label">
            Email
            <input
              name="email"
              type="email"
              className="auth-input"
              value={form.email}
              onChange={handleChange}
              readOnly={!!emailParam}
              required
            />
          </label>

          <label className="auth-label">
            Password
            <input
              name="password"
              type="password"
              className="auth-input"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          <label className="auth-label">
            Confirm Password
            <input
              name="confirmPassword"
              type="password"
              className="auth-input"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </label>

          <button className="auth-button" type="submit">
            Sign Up
          </button>
        </form>
      </div>

      <div className="auth-image">
        <img src="https://placehold.co/600x800" className="auth-illustration" />
      </div>
    </div>
  );
}
