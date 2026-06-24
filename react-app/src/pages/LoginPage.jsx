import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AuthPage.css";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  function validate() {
    const errs = {};
    if (!isValidEmail(email)) errs.email = email ? "Enter a valid email." : "Email is required.";
    if (!password) errs.password = "Password is required.";
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const matched = users.find(u => u.email === email && u.password === password);
      if (matched) {
        setAlert({ type: "success", msg: "Welcome back! Redirecting..." });
        login(matched);
        setTimeout(() => navigate("/"), 900);
      } else {
        setLoading(false);
        const exists = users.some(u => u.email === email);
        setAlert({ type: "error", msg: exists ? "Incorrect password." : "No account found. Please sign up first." });
      }
    }, 850);
  }

  return (
    <div className="auth-body">
      <div className="auth-card">
        <div className="brand-logo-area">
          <img src="/images/icon.png" width="32" height="32" alt="Logo" />
          <span className="brand-name">RoamEase</span>
        </div>
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Please enter your details to sign in</p>

        {alert && (
          <div className={`auth-alert ${alert.type}`}>
            <span>{alert.type === "success" ? "✓" : "⚠"}</span> {alert.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className={`form-group ${errors.email ? "invalid" : ""}`}>
            <label>Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">✉</span>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className={`form-group ${errors.password ? "invalid" : ""}`}>
            <label>Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(v => !v)}>
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? <span className="spinner-inline" /> : null}
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <span className="signup-link">
          Don't have an account? <Link to="/signup">Create an account</Link>
        </span>
      </div>
    </div>
  );
}
