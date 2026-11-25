import React, { useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

const ADMIN_EMAIL = "admin@voting.com";
const ADMIN_PASSWORD = "admin123";

function readData(key, fallback) {
  const saved = localStorage.getItem(key);
  if (saved === null) return fallback;

  try {
    return JSON.parse(saved);
  } catch (error) {
    return fallback;
  }
}

function writeData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function initializeData() {
  if (localStorage.getItem("candidates") === null) {
    writeData("candidates", [
      { id: 1, name: "Ananya Reddy", party: "Student Progress Group" },
      { id: 2, name: "Rahul Kumar", party: "Campus Development Group" }
    ]);
  }
  if (localStorage.getItem("users") === null) writeData("users", []);
  if (localStorage.getItem("votes") === null) writeData("votes", []);
  if (localStorage.getItem("electionOpen") === null) {
    localStorage.setItem("electionOpen", "false");
  }
}

initializeData();

function Header({ user, onLogout }) {
  return (
    <header className="topbar navbar">
      <div className="container">
        <Link to="/" className="navbar-brand brand">
          <span className="brand-mark" aria-hidden="true">V</span>
          <span>Online Voting</span>
        </Link>
        <nav className="nav-links navbar-nav flex-row" aria-label="Main navigation">
        {!user && <Link className="nav-link" to="/login">Login</Link>}
        {!user && <Link className="nav-link" to="/signup">Sign up</Link>}
        {user && (
          <>
            <Link className="nav-link" to={user.role === "admin" ? "/admin" : "/dashboard"}>
              {user.role === "admin" ? "Admin dashboard" : "My dashboard"}
            </Link>
            <span className="nav-user">{user.name || "Administrator"}</span>
            <button className="btn button nav-logout" type="button" onClick={onLogout}>Logout</button>
          </>
        )}
        </nav>
      </div>
    </header>
  );
}

function Layout({ user, onLogout, children }) {
  return (
    <>
      <Header user={user} onLogout={onLogout} />
      {children}
      <Footer />
    </>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p>Online Voting System</p>
        <p>Front-end college project</p>
      </div>
    </footer>
  );
}

function Home() {
  const electionOpen = localStorage.getItem("electionOpen") === "true";

  return (
    <>
      <main>
        <section className="hero">
          <div className="container">
            <div className="row align-items-center g-4">
              <div className="col-lg-7 hero-text">
                <p className="tag">STUDENT ELECTION 2026</p>
                <h1>Make your vote count.</h1>
                <p>A simple and fair way to take part in our college student election.</p>
                <div className="button-row d-flex flex-wrap gap-2">
                  <Link className="btn btn-primary button" to="/login">Login</Link>
                  <Link className="btn btn-success button secondary" to="/signup">Create voter account</Link>
                </div>
              </div>
              <aside className="col-lg-5">
                <div className="hero-note">
                  <div className="status-line">
                    <span className="hero-icon" aria-hidden="true">✓</span>
                    <span className={`badge rounded-pill ${electionOpen ? "text-bg-success" : "text-bg-secondary"}`}>
                      Election {electionOpen ? "Open" : "Closed"}
                    </span>
                  </div>
                  <h2>One student, one vote</h2>
                  <p>Register, review the candidates and cast your vote online.</p>
                </div>
              </aside>
            </div>
          </div>
        </section>
        <section className="container steps-section">
          <p className="tag text-center">HOW IT WORKS</p>
          <h2 className="section-title text-center">Vote in three simple steps</h2>
          <div className="row g-3 mt-2">
            <div className="col-md-4">
              <article className="step-card">
                <span className="step-number">1</span>
                <h3>Create account</h3>
                <p>Enter your details and register as a voter.</p>
              </article>
            </div>
            <div className="col-md-4">
              <article className="step-card">
                <span className="step-number">2</span>
                <h3>Check candidates</h3>
                <p>Open the dashboard and view the available candidates.</p>
              </article>
            </div>
            <div className="col-md-4">
              <article className="step-card">
                <span className="step-number">3</span>
                <h3>Cast your vote</h3>
                <p>Select one candidate and submit your vote.</p>
              </article>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Login({ onLogin }) {
  const location = useLocation();
  const [message, setMessage] = useState(location.state?.message || "");
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget.elements;
    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      onLogin({ email, role: "admin" });
      navigate("/admin");
      return;
    }

    const user = readData("users", []).find(
      (savedUser) => savedUser.email === email && savedUser.password === password
    );
    if (!user) {
      setMessage("Invalid email or password.");
      return;
    }

    onLogin({ email: user.email, name: user.name, role: "user" });
    navigate("/dashboard");
  }

  return (
    <main className="form-page container">
      <form className="form-card card" onSubmit={handleSubmit}>
        <p className="tag">WELCOME BACK</p>
        <h1>Login</h1>
        <p className="small-text">Sign in to continue to your voting dashboard.</p>
        <label className="form-label" htmlFor="email">Email</label>
        <input className="form-control" id="email" name="email" type="email" autoComplete="email" required />
        <label className="form-label" htmlFor="password">Password</label>
        <input className="form-control" id="password" name="password" type="password" autoComplete="current-password" required />
        {message && (
          <div className={location.state?.message ? "alert alert-success mt-3" : "alert alert-danger mt-3"} role="alert">
            {message}
          </div>
        )}
        <button className="btn btn-primary button" type="submit">Login</button>
        <p className="small-text form-footnote">
          New voter? <Link to="/signup">Create an account</Link>
        </p>
        <p className="small-text">Admin demo: {ADMIN_EMAIL} / {ADMIN_PASSWORD}</p>
      </form>
    </main>
  );
}

function Signup() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget.elements;
    const name = form.name.value.trim();
    const dob = form.dob.value;
    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const birthDate = new Date(`${dob}T00:00:00`);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const beforeBirthday =
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());
    if (beforeBirthday) age -= 1;

    if (!dob || age < 18) {
      setMessage("You must be 18 or above to register for voting.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const users = readData("users", []);
    if (users.some((user) => user.email === email)) {
      setMessage("An account with this email already exists.");
      return;
    }

    users.push({ name, dob, email, password });
    writeData("users", users);
    navigate("/login", { state: { message: "Signup successful. You can now log in." } });
  }

  return (
    <main className="form-page container">
      <form className="form-card card" onSubmit={handleSubmit}>
        <p className="tag">JOIN THE ELECTION</p>
        <h1>Voter signup</h1>
        <p className="small-text">Create an account to take part in the student election.</p>
        <label className="form-label" htmlFor="name">Full name</label>
        <input className="form-control" id="name" name="name" type="text" autoComplete="name" required />
        <label className="form-label" htmlFor="dob">Date of birth</label>
        <input className="form-control" id="dob" name="dob" type="date" required />
        <label className="form-label" htmlFor="email">Email</label>
        <input className="form-control" id="email" name="email" type="email" autoComplete="email" required />
        <label className="form-label" htmlFor="password">Password</label>
        <input className="form-control" id="password" name="password" type="password" autoComplete="new-password" required />
        <label className="form-label" htmlFor="confirmPassword">Confirm password</label>
        <input className="form-control" id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required />
        {message && <div className="alert alert-danger" role="alert">{message}</div>}
        <button className="btn btn-primary button" type="submit">Create account</button>
        <p className="small-text form-footnote">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}

function AdminDashboard({ user, onLogout }) {
  const [candidates, setCandidates] = useState(() => readData("candidates", []));
  const [users] = useState(() => readData("users", []));
  const [votes] = useState(() => readData("votes", []));
  const [isOpen, setIsOpen] = useState(() => localStorage.getItem("electionOpen") === "true");
  const [message, setMessage] = useState("");

  function addCandidate(event) {
    event.preventDefault();
    const form = event.currentTarget.elements;
    const updated = candidates.concat({
      id: Date.now(),
      name: form.candidateName.value.trim(),
      party: form.candidateParty.value.trim()
    });
    setCandidates(updated);
    writeData("candidates", updated);
    event.currentTarget.reset();
    setMessage("Candidate added successfully.");
  }

  function deleteCandidate(id) {
    const updated = candidates.filter((candidate) => candidate.id !== id);
    setCandidates(updated);
    writeData("candidates", updated);
  }

  function toggleElection() {
    const next = !isOpen;
    setIsOpen(next);
    localStorage.setItem("electionOpen", String(next));
    setMessage(next ? "Election started successfully." : "Election stopped successfully.");
  }

  return (
    <Layout user={user} onLogout={onLogout}>
      <main className="container page-content">
        <div className="page-heading">
          <div>
            <p className="tag">ADMIN MODULE</p>
            <h1>Admin dashboard</h1>
          </div>
          <div className="election-control">
            <span>Election: <strong className={`badge rounded-pill ${isOpen ? "text-bg-success" : "text-bg-danger"}`}>{isOpen ? "OPEN" : "CLOSED"}</strong></span>
            <button className="btn btn-success button secondary" type="button" onClick={toggleElection}>
              {isOpen ? "Stop election" : "Start election"}
            </button>
          </div>
        </div>
        <div className="row g-4 mt-2">
          <section className="col-lg-6">
            <div className="panel h-100">
            <h2>Add candidate</h2>
            <form onSubmit={addCandidate}>
              <label className="form-label" htmlFor="candidateName">Candidate name</label>
              <input className="form-control" id="candidateName" name="candidateName" required />
              <label className="form-label" htmlFor="candidateParty">Party or group</label>
              <input className="form-control" id="candidateParty" name="candidateParty" required />
              <button className="btn btn-primary button" type="submit">Add candidate</button>
            </form>
            {message && <div className="alert alert-success mt-3 mb-0" role="status">{message}</div>}
            </div>
          </section>
          <section className="col-lg-6">
            <div className="panel h-100">
            <h2>Candidates</h2>
            <div className="card-list">
              {candidates.length === 0 && <p>No candidates added yet.</p>}
              {candidates.map((candidate) => (
                <div className="candidate-card" key={candidate.id}>
                  <div><h3>{candidate.name}</h3><p>{candidate.party}</p></div>
                  <button
                    className="btn btn-danger button danger"
                    type="button"
                    onClick={() => deleteCandidate(candidate.id)}
                    aria-label={`Delete ${candidate.name}`}
                  >Delete</button>
                </div>
              ))}
            </div>
            </div>
          </section>
        </div>
        <div className="row g-4 mt-1">
          <section className="col-lg-6">
            <div className="panel h-100">
            <h2>Registered voters</h2>
            {users.length === 0 ? <p>No registered voters yet.</p> : (
              <div className="table-wrap">
                <table className="table table-striped align-middle mb-0">
                  <thead><tr><th>Name</th><th>Email</th></tr></thead>
                  <tbody>{users.map((voter) => (
                    <tr key={voter.email}><td>{voter.name}</td><td>{voter.email}</td></tr>
                  ))}</tbody>
                </table>
              </div>
            )}
            </div>
          </section>
          <section className="col-lg-6">
            <div className="panel h-100">
            <h2>Election results</h2>
            {candidates.length === 0 ? <p>No results to show.</p> : (
              <div className="results-list">{candidates.map((candidate) => (
                <p key={candidate.id}>
                  <strong>{candidate.name}</strong>
                  <span>{votes.filter((vote) => vote.candidateId === candidate.id).length} vote(s)</span>
                </p>
              ))}</div>
            )}
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}

function VoterDashboard({ user, onLogout }) {
  const [candidates] = useState(() => readData("candidates", []));
  const [votes, setVotes] = useState(() => readData("votes", []));
  const [selectedId, setSelectedId] = useState("");
  const [message, setMessage] = useState("");
  const isOpen = localStorage.getItem("electionOpen") === "true";
  const hasVoted = votes.some((vote) => vote.email === user.email);
  const statusMessage = message || (
    hasVoted
      ? "Your vote has been recorded. You can vote only once."
      : (!isOpen ? "Voting is currently closed." : "")
  );

  function castVote(event) {
    event.preventDefault();
    if (!isOpen) {
      setMessage("Voting is currently closed.");
      return;
    }
    if (!selectedId) {
      setMessage("Please select a candidate.");
      return;
    }
    if (hasVoted) {
      setMessage("You have already voted.");
      return;
    }

    const updated = votes.concat({ email: user.email, candidateId: Number(selectedId) });
    setVotes(updated);
    writeData("votes", updated);
    setMessage("Your vote has been recorded. You can vote only once.");
  }

  return (
    <Layout user={user} onLogout={onLogout}>
      <main className="container page-content">
        <div className="page-heading">
          <div>
            <p className="tag">VOTER MODULE</p>
            <h1>Voter dashboard</h1>
            <p>Welcome, {user.name}.</p>
          </div>
          <p className={`badge rounded-pill ${isOpen ? "text-bg-success" : "text-bg-danger"}`}>
            Election is {isOpen ? "open" : "closed"}
          </p>
        </div>
        <section className="panel card voter-panel">
          <h2>Choose one candidate</h2>
          {statusMessage && <p className="alert alert-info py-2" role="status">{statusMessage}</p>}
          <form onSubmit={castVote}>
            <div className="card-list">
              {candidates.length === 0 && <p>No candidates are available.</p>}
              {candidates.map((candidate) => (
                <label className="candidate-card voter-choice" key={candidate.id}>
                  <span>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="candidate"
                      value={candidate.id}
                      checked={selectedId === String(candidate.id)}
                      disabled={hasVoted || !isOpen}
                      onChange={() => setSelectedId(String(candidate.id))}
                    />
                    <strong>{candidate.name}</strong>
                    <span className="candidate-party">{candidate.party}</span>
                  </span>
                </label>
              ))}
            </div>
            <button className="btn btn-primary button vote-button" type="submit" disabled={hasVoted || !isOpen || candidates.length === 0}>
              Cast vote
            </button>
          </form>
        </section>
      </main>
    </Layout>
  );
}

export default function App() {
  const [user, setUser] = useState(() => readData("currentUser", null));

  function login(nextUser) {
    writeData("currentUser", nextUser);
    setUser(nextUser);
  }

  function logout() {
    localStorage.removeItem("currentUser");
    setUser(null);
  }

  return (
    <Routes>
      <Route path="/" element={<><Header user={user} onLogout={logout} /><Home /></>} />
      <Route path="/login" element={user ? <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace /> : <><Header /><Login onLogin={login} /></>} />
      <Route path="/signup" element={user ? <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace /> : <><Header /><Signup /></>} />
      <Route path="/admin" element={user?.role === "admin" ? <AdminDashboard user={user} onLogout={logout} /> : <Navigate to="/login" replace />} />
      <Route path="/dashboard" element={user?.role === "user" ? <VoterDashboard user={user} onLogout={logout} /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
