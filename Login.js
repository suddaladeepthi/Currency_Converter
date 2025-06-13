import React, { useRef, useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./AuthForm.css";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [pwVisible, setPwVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(
        auth,
        emailRef.current.value,
        passwordRef.current.value
      );
      // Optionally redirect or show success here
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-center-wrapper">
      <form
        className={`auth-form${error ? " shake" : ""}`}
        onSubmit={handleLogin}
      >
        <h2 className="auth-form-title">Login</h2>
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
            onClick={() => setPwVisible((v) => !v)}
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
              Logging in...
            </span>
          ) : "Login"}
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
          Don't have an account? <a href="/signup">Sign up</a>
        </div>
      </form>
    </div>
  );
}