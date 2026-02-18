import { useState } from "react";
import axios from "axios";

// ✅ API Base URL (local + deployed)
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email || !newPassword) {
      alert("Please enter email and new password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_BASE_URL}/api/auth/forgot-password`,
        { email, newPassword }
      );

      alert(res.data.message || "Password reset successful");
      window.location.href = "/";
    } catch (err) {
      console.error("FORGOT PASSWORD ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "420px", margin: "auto" }}>
      <h2>Forgot Password</h2>

      <form onSubmit={handleReset}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
