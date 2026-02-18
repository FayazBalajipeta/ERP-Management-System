import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
  `${process.env.REACT_APP_API_URL}/api/auth/login`,
  { email, password }
);


      console.log("LOGIN RESPONSE:", res.data);

      // 🔐 Validate backend response
      if (!res.data.token) {
        alert("Login failed: token missing");
        return;
      }

      // ✅ Safely store auth data (NO unused variable)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(
          res.data.user || { role: res.data.role || "user" }
        )
      );

      const storedUser = JSON.parse(localStorage.getItem("user"));
      console.log("USER ROLE:", storedUser.role);

      // ✅ Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      alert(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card-wrapper">
        <div className="login-card">
          <div className="logo">
            ⚙️ <span>SmartERP</span>
          </div>

          <h2>Welcome back!</h2>
          <p>Please login to your account</p>

          <form onSubmit={handleLogin}>
            {/* EMAIL */}
            <div className="input-group">
              <label>Email Address</label>
              <div className="input-box">
                <FaEnvelope className="icon" />
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="input-group">
              <label>Password</label>
              <div className="input-box">
                <FaLock className="icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* FORGOT PASSWORD */}
            <div className="forgot-password">
              <span onClick={() => navigate("/forgot-password")}>
                Forgot Password?
              </span>
            </div>

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login Now"}
            </button>
          </form>

          <div className="or">OR</div>

          <button
            className="signup-btn"
            onClick={() => navigate("/register")}
          >
            Signup Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
