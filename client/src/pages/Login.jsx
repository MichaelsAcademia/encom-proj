import { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

const API = "http://localhost:3000/api/v1";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const emailFromQuery = params.get("email");
    if (emailFromQuery) {
      setForm((prev) => ({ ...prev, email: emailFromQuery }));
    }
  }, [params]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API}/auth/login`, form);
      login(res.data.user, res.data.token);
      navigate("/profile");
    } catch {
      setError("Incorrect email or password.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Log In</h1>
        <p className="auth-subtitle">Welcome back! Enter your password.</p>

        {error && <p className="auth-error">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label">Email</label>
          <input
        name="email"
        type="email"
        className="auth-input"
        value={form.email}
        onChange={handleChange}
        disabled={!!params.get("email")}   // only disable when email exists in query
        placeholder="email@example.com"
        />


          <label className="auth-label">Password</label>
          <input
            name="password"
            type="password"
            className="auth-input"
            value={form.password}
            onChange={handleChange}
          />

          <button className="auth-button">Log In</button>
        </form>
      </div>

      <div className="auth-image">
        <img src="https://placehold.co/1200x1800?text=Encom" />
      </div>
    </div>
  );
}
