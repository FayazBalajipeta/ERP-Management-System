import { useState } from "react";
import axios from "axios";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
const handleRegister = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    await axios.post("http://localhost:5000/api/auth/register", {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    });

    alert("Registration successful");
    window.location.href = "/";
  } catch (err) {
    alert(err.response?.data?.message || "Registration failed");
  }
};



  return (
    <div className="register-page">
      <div className="register-card">
        <h2>Create SmartERP Account</h2>
        <p>Please fill in the details below</p>

        <form onSubmit={handleRegister}>
          <div className="row">
            <input
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <input
            name="email"
            type="email"
            placeholder="Email ID"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Re-enter Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit">Register</button>
        </form>

        <p className="login-link">
          Already have an account?{" "}
          <span onClick={() => (window.location.href = "/")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
