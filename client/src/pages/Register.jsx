// client/src/pages/Register.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:3000"; // adjust if needed

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  // Update field values
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Submit registration form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      setSuccess("");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register`, {
        name: form.name,
        email: form.email,
        password: form.password
      });

      // You can log res.data to inspect the response shape
      console.log("Register response:", res.data);

      setError("");
      setSuccess("Registration successful! Redirecting to login...");

      // Redirect to login after short delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error(err);
      setSuccess("");
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="auth-container">
      <h2>Create an Account</h2>

      {error && <p style={{ color: "red", marginBottom: "0.5rem" }}>{error}</p>}
      {success && (
        <p style={{ color: "green", marginBottom: "0.5rem" }}>{success}</p>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Name</label>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </div>

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
            placeholder="Enter a password"
            required
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
          />
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
