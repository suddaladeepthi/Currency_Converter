import React, { useRef, useState } from "react";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [pwVisible, setPwVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(
        auth,
        emailRef.current.value,
        passwordRef.current.value
      );
      // After signup, redirect to login page
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-center-wrapper">
      <form
        className={`auth-form${error ? " shake" : ""}`}
        onSubmit={handleSignup}
      >
        <h2 className="auth-form-title">Sign Up</h2>
        <input
          ref={emailRef}
          type="email"
          placeholder="Email"
          required
          className="auth-form-input"
        />
        <div className="auth-form-password-container">
          <input
            ref={passwordRef}
            type={pwVisible ? "text" : "password"}
            placeholder="Password"
            required
            className="auth-form-input"
          />
          <span
            onClick={() => setPwVisible(v => !v)}
            className="auth-form-password-toggle"
            title={pwVisible ? "Hide password" : "Show password"}
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") setPwVisible(v => !v);
            }}
            aria-label={pwVisible ? "Hide password" : "Show password"}
          >
            {pwVisible ? "🙈" : "👁️"}
          </span>
        </div>
        <button
          type="submit"
          className="auth-form-button"
          disabled={loading}
        >
          {loading ? (
            <span>
              <span className="spinner" />
              Creating...
            </span>
          ) : "Sign Up"}
        </button>
        <button
          type="button"
          className="auth-form-google-button"
          tabIndex={-1}
          style={{marginBottom: "6px"}}
        >
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
            alt="Google"
            width={20}
            height={20}
          />
          Continue with Google
        </button>
        {error && <div className="auth-form-error">{error}</div>}
        <div className="auth-form-footer">
          Already have an account? <a href="/login">Log in</a>
        </div>
      </form>
    </div>
  );
}