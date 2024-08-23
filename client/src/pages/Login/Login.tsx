import { useState } from "react";
import "./login.scss";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import config from "../config";

export default function Login() {
  const navigate = useNavigate();
  const { serverUrl } = config;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        setError("Invalid email format");
        return;
      }

      if (!password || password.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }
      const response = await axios.post(`${serverUrl}/api/auth/login`, {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("authToken", token);

      const decodedToken: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken?.exp < currentTime) {
        throw new Error("Token has expired");
      }
      navigate("/movies");
    } catch (error: any) {
      console.log(error);
      setError(error?.response?.data.message);
    }
  };

  return (
    <div className="wrapper login-wrapper">
      <div className="sign-in-wrapper">
        <h1>Sign in</h1>
        {error && (
          <p className="error-message" style={{ color: "#F44336" }}>
            {error}
          </p>
        )}
        <div className="input-field">
          <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="input-field">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="remember-me">
          <label htmlFor="remember-me">
            <input type="checkbox" id="remember-me" />
            <span className="checkmark"></span>
            Remember me
          </label>
        </div>
        <button className="primary-btn login-btn" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}
