import React from "react";
import { Link } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import useNow from "../hooks/useNow";
import { getElectionStatus } from "../utils/elections";

export default function Home() {
  const [elections] = useLocalStorage("elections", []);
  const now = useNow();
  const openCount = elections.filter((election) => getElectionStatus(election, now) === "Open").length;

  return (
    <main>
      <section className="hero">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7 hero-text">
              <p className="tag">STUDENT ELECTION 2026</p>
              <h1>Make your vote count.</h1>
              <p>A simple and fair way to take part in our college student election.</p>
              <div className="button-row d-flex flex-wrap gap-2">
                <Link className="btn btn-primary button" to="/login/user">Voter login</Link>
                <Link className="btn btn-outline-primary button" to="/login/admin">Admin login</Link>
                <Link className="btn btn-success button secondary" to="/signup">Create voter account</Link>
              </div>
            </div>
            <aside className="col-lg-5">
              <div className="hero-note">
                <div className="status-line">
                  <span className="hero-icon" aria-hidden="true">✓</span>
                  <span className={`badge rounded-pill ${openCount > 0 ? "text-bg-success" : "text-bg-secondary"}`}>
                    {openCount} election{openCount === 1 ? "" : "s"} open now
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
              <p>Open the dashboard and view the available elections and candidates.</p>
            </article>
          </div>
          <div className="col-md-4">
            <article className="step-card">
              <span className="step-number">3</span>
              <h3>Cast your vote</h3>
              <p>Select one candidate in each open election and submit your vote.</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
