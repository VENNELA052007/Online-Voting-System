import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { readData, writeData } from "../utils/storage";
import { getAge } from "../utils/elections";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", dob: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();

    if (!name) {
      setError("Please enter your full name.");
      return;
    }
    if (!form.dob || getAge(form.dob) < 18) {
      setError("You must be 18 or above to register for voting.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const users = readData("users", []);
    if (users.some((user) => user.email === email)) {
      setError("An account with this email already exists.");
      return;
    }

    // CREATE: save the new voter in Local Storage
    writeData("users", [...users, { name, dob: form.dob, email, password: form.password }]);
    navigate("/login/user", { state: { message: "Signup successful. You can now log in." } });
  }

  return (
    <main className="form-page container">
      <form className="form-card card" onSubmit={handleSubmit}>
        <p className="tag">JOIN THE ELECTION</p>
        <h1>Voter signup</h1>
        <p className="small-text">Create an account to take part in the student election.</p>
        <label className="form-label" htmlFor="name">Full name</label>
        <input className="form-control" id="name" name="name" type="text" autoComplete="name"
          value={form.name} onChange={handleChange} required />
        <label className="form-label" htmlFor="dob">Date of birth</label>
        <input className="form-control" id="dob" name="dob" type="date"
          value={form.dob} onChange={handleChange} required />
        <label className="form-label" htmlFor="email">Email</label>
        <input className="form-control" id="email" name="email" type="email" autoComplete="email"
          value={form.email} onChange={handleChange} required />
        <label className="form-label" htmlFor="password">Password</label>
        <input className="form-control" id="password" name="password" type="password" autoComplete="new-password"
          value={form.password} onChange={handleChange} required />
        <label className="form-label" htmlFor="confirmPassword">Confirm password</label>
        <input className="form-control" id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password"
          value={form.confirmPassword} onChange={handleChange} required />
        {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}
        <button className="btn btn-primary button" type="submit">Create account</button>
        <p className="small-text form-footnote">
          Already registered? <Link to="/login/user">Voter login</Link>
        </p>
      </form>
    </main>
  );
}
