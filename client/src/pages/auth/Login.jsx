import { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext, useAuth } from "../../context/AuthContext";
import "./Login.css";

import art from "../../assets/login.png";
import { set } from "mongoose";

export default function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // check if the user is signing up
  const location = useLocation().pathname.replace("/", "");
  const signup = location === "signup";

  const [ params ] = useSearchParams();
  const queryEmail = params.get("email");

  const [form, setForm] = useState(
    {
      username: "",
      email: queryEmail || "",
      password: ""
    }
  );
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);

  useEffect(() => {
    setError("");

    if (user && user.username) {
      navigate("/");
    }

    if (signup && !queryEmail) {
      navigate("/login");
    }

    if (queryEmail) {
      console.log("Query email detected: ", queryEmail);
      // check if email matches regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(queryEmail)) {
        navigate("/login");
      }
    }
  }, [queryEmail]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleContinue = async (e) => {
    if (form.email === "") {
      setError("Please enter an email.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email.");
      return;
    }

    try {
      const response = await axios.post(`/api/v1/auth/check`, { email: form.email });

      console.log(response.data);

      if (response.data.exists) {
        // email exists, navigate to login
        navigate(`/login?email=${form.email}`);
      } else {
        // email does not exist, navigate to signup
        navigate(`/signup?email=${form.email}`);
      }
    } catch (err) {
    }
  };

  const handleLogIn = async (e) => {
    e.preventDefault();

    console.log("Logging in: ", { email: form.email, password: form.password });

    try {
      const response = await axios.post(`/api/v1/auth/login`, {
        email: form.email,
        password: form.password
      });

      const { user, token } = response.data;

      login(user, token);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!form.username) {
      setError("Please enter a username.");
      return;
    }

    if (!form.password) {
      setError("Please enter a password.");
      return;
    }

    if (form.password !== e.target.form["confirm-password"].value) {
      setError("Passwords do not match.");
      return;
    }

    console.log("Signing up: ", { username: form.username, email: form.email, password: form.password });

    try {
      const response = await axios.post(`/api/v1/auth/register`, {
        username: form.username,
        email: form.email,
        password: form.password
      });

      console.log("Sign up response: ", response.data);

      const { user, token } = response.data;

      login(user, token);
      navigate("/");
    } catch (err) {
      setError("Error signing up. Please try again.");
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <div className="auth-header">
          {
            queryEmail ? (
              <h1 className="auth-title">{signup ? "Sign Up" : "Log In"}</h1>
            ) : (
              <h1 className="auth-welcome">Welcome to Encom</h1>
            )
          }
          {
            queryEmail ? (
              <p>Please enter your details to {signup ? "sign up" : "log in"}</p>
            ) : (
              <p>Please enter your email to continue</p>
            )
          }
        </div>


        <form className="auth-form">
          {
            signup && (
              <input
              name="username"
              type="username"
              className="auth-input"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              />
            )
          }
          <input
            name="email"
            type="email"
            className="auth-input"
            value={form.email}
            onChange={handleChange}
            disabled={params.get("email")}   // only disable when email exists in query
            placeholder="Your Email"
            pattern="/^[^\s@]+@[^\s@]+\.[^\s@]+$/"
            required
            />
          { queryEmail && (
            <input
            name="password"
            type="password"
            className="auth-input"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            autoFocus={!signup}
            />
          )}
          {
            signup && (
              <input
              name="confirm-password"
              type="password"
              className="auth-input"
              placeholder="Confirm Password"
              />
            )
          }
          {error && <p className="auth-error">{error}</p>}
          {
            queryEmail ? (signup ? (
              <button className="auth-button" onClick={handleSignUp}>Sign Up</button>
            ) : (
              <button className="auth-button" onClick={handleLogIn}>Log In</button>
            )) : (
              <>
                <button className="auth-button" onClick={handleContinue}>Continue</button>
                <p className="TOS">By clicking continue, you agree to our <a>Terms of Service</a></p>
              </>
            )
          }
        </form>
      </div>

      <div className="auth-image">
        <img src={art} />
      </div>
    </div>
  );
}
