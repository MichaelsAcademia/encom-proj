// client/src/pages/Login.jsx
import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const API_BASE_URL = "http://localhost:3000"; // adjust if needed

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Update field values
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Submit login form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: form.email,
        password: form.password
      });

      console.log("Login response:", res.data);

      // We assume res.data has: { user, token }
      const { user, token } = res.data;

      // Save to AuthContext (+ sessionStorage inside)
      login(user, token);

      setError("");

      // Redirect to home after login
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Invalid email or password."
      );
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>

      {error && <p style={{ color: "red", marginBottom: "0.5rem" }}>{error}</p>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
