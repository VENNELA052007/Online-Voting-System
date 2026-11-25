import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ADMIN_EMAIL, ADMIN_PASSWORD, readData } from "../utils/storage";

export default function Login({ onLogin }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Controlled form: React state is the single source of truth for the inputs.
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const successMessage = location.state?.message || ""; // sent from the signup page

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const email = form.email.trim().toLowerCase();

    // Admin login (fixed demo account)
    if (email === ADMIN_EMAIL && form.password === ADMIN_PASSWORD) {
      onLogin({ email, name: "Administrator", role: "admin" });
      navigate("/admin");
      return;
    }

    // Voter login: look for a matching account saved by the signup page
    const savedUser = readData("users", []).find(
      (user) => user.email === email && user.password === form.password
    );
    if (!savedUser) {
      setError("Invalid email or password.");
      return;
    }

    onLogin({ email: savedUser.email, name: savedUser.name, role: "user" });
    navigate("/dashboard");
  }

  return (
    <main className="form-page container">
      <form className="form-card card" onSubmit={handleSubmit}>
        <p className="tag">WELCOME BACK</p>
        <h1>Login</h1>
        <p className="small-text">Sign in to continue to your dashboard.</p>
        <label className="form-label" htmlFor="email">Email</label>
        <input
          className="form-control"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <label className="form-label" htmlFor="password">Password</label>
        <input
          className="form-control"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          required
        />
        {successMessage && !error && (
          <div className="alert alert-success mt-3" role="status">{successMessage}</div>
        )}
        {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}
        <button className="btn btn-primary button" type="submit">Login</button>
        <p className="small-text form-footnote">
          New voter? <Link to="/signup">Create an account</Link>
        </p>
        <p className="small-text">Admin demo: {ADMIN_EMAIL} / {ADMIN_PASSWORD}</p>
      </form>
    </main>
  );
}
