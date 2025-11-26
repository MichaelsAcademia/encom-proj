// client/src/pages/Register.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Register.css";

const API = "http://localhost:3000/api/v1";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [params] = useSearchParams();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const emailFromQuery = params.get("email");
    if (emailFromQuery) {
      setForm((prev) => ({ ...prev, email: emailFromQuery }));
    }
  }, [params]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await axios.post(`${API}/auth/register`, {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      navigate(`/login?email=${form.email}`);
    } catch {
      setError("Registration failed.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Sign Up</h1>
        <p className="auth-subtitle">Create your ENCOM account.</p>

        {error && <p className="auth-error">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label">Username</label>
          <input
            name="name"
            type="text"
            className="auth-input"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label className="auth-label">Email</label>
          <input
            name="email"
            type="email"
            className="auth-input"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label className="auth-label">Password</label>
          <input
            name="password"
            type="password"
            className="auth-input"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label className="auth-label">Confirm Password</label>
          <input
            name="confirmPassword"
            type="password"
            className="auth-input"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <button className="auth-button">Sign Up</button>
        </form>
      </div>

      <div className="auth-image">
        <img src="https://placehold.co/800x1200?text=ENCOM+SignUp" />
      </div>
    </div>
  );
}
