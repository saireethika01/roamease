import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AuthPage.css";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getStrength(pw) {
  let score = 0;
  const condLength = pw.length >= 6;
  const condNumber = /[0-9]/.test(pw);
  const condUpper = /[A-Z]/.test(pw);
  if (condLength) score++;
  if (condNumber) score++;
  if (condUpper) score++;
  return { score, condLength, condNumber, condUpper };
}

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const strength = getStrength(password);
  const strengthLabel = ["", "Weak", "Medium", "Strong"][strength.score] || "";
  const strengthColor = ["", "#f43f5e", "#f97316", "#16a34a"][strength.score] || "transparent";

  function validate() {
    const errs = {};
    if (name.trim().length < 2) errs.name = name ? "Name too short." : "Name is required.";
    if (!isValidEmail(email)) errs.email = email ? "Enter a valid email." : "Email is required.";
    if (password.length < 6) errs.password = password ? "Min 6 characters." : "Password is required.";
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
      if (users.find(u => u.email === email)) {
        setLoading(false);
        setAlert({ type: "error", msg: "Email already registered. Please sign in." });
        return;
      }
      users.push({ name, email, password });
      localStorage.setItem("users", JSON.stringify(users));
      setAlert({ type: "success", msg: "Account created! Redirecting to login..." });
      setTimeout(() => navigate("/login"), 1200);
    }, 850);
  }

  return (
    <div className="auth-body">
      <div className="auth-card">
        <div className="brand-logo-area">
          <img src="/images/icon.png" width="32" height="32" alt="Logo" />
          <span className="brand-name">RoamEase</span>
        </div>
        <h2>Create Account</h2>
        <p className="auth-subtitle">Join us to explore the world, one journey at a time</p>

        {alert && (
          <div className={`auth-alert ${alert.type}`}>
            <span>{alert.type === "success" ? "✓" : "⚠"}</span> {alert.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className={`form-group ${errors.name ? "invalid" : ""}`}>
            <label>Full Name</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input type="text" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
            </div>
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className={`form-group ${errors.email ? "invalid" : ""}`}>
            <label>Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">✉</span>
              <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
            </div>
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className={`form-group ${errors.password ? "invalid" : ""}`}>
            <label>Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Min. 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(v => !v)}>
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}

            {password.length > 0 && (
              <>
                <div className="password-strength-bar-wrapper show">
                  <div className="password-strength-bar" style={{ width: `${(strength.score / 3) * 100}%`, backgroundColor: strengthColor }} />
                </div>
                <span className="strength-text show" style={{ color: strengthColor }}>{strengthLabel} password</span>
                <div className="strength-checklist show">
                  <div className={`checklist-item ${strength.condLength ? "valid" : ""}`}>
                    <span className="chk-icon">{strength.condLength ? "✓" : "○"}</span>
                    <span className="chk-text">Min. 6 characters</span>
                  </div>
                  <div className={`checklist-item ${strength.condNumber ? "valid" : ""}`}>
                    <span className="chk-icon">{strength.condNumber ? "✓" : "○"}</span>
                    <span className="chk-text">At least 1 number</span>
                  </div>
                  <div className={`checklist-item ${strength.condUpper ? "valid" : ""}`}>
                    <span className="chk-icon">{strength.condUpper ? "✓" : "○"}</span>
                    <span className="chk-text">At least 1 uppercase letter</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? <span className="spinner-inline" /> : null}
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <span className="signup-link">
          Already have an account? <Link to="/login">Sign in instead</Link>
        </span>
      </div>
    </div>
  );
}
