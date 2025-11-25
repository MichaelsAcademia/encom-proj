import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const API_BASE_URL = "http://localhost:3000/api/v1";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("entryEmail");
    if (savedEmail) setForm((prev) => ({ ...prev, email: savedEmail }));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, form);
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError("Incorrect email or password.");
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-panel">
        <h1>Log In</h1>

        {error && <p className="auth-error">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
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

          <button className="auth-button">Log In</button>
        </form>
      </div>

      <div className="auth-image">
        <img src="https://placehold.co/600x800" className="auth-illustration" />
      </div>
    </div>
  );
}
