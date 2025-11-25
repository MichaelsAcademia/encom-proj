import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:3000/api/v1";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("entryEmail");
    if (savedEmail) {
      setForm((prev) => ({ ...prev, email: savedEmail }));
    }
  }, []);

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
      await axios.post(`${API_BASE_URL}/auth/register`, {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      navigate("/login");
    } catch (err) {
      setError("Registration failed.");
    }
  };

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

          <button className="auth-button">Sign Up</button>
        </form>
      </div>

      <div className="auth-image">
        <img src="https://placehold.co/600x800" className="auth-illustration" />
      </div>
    </div>
  );
}
