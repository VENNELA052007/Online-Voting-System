import React, { useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import useNow from "../hooks/useNow";
import ElectionsPanel from "../components/admin/ElectionsPanel";
import CandidatesPanel from "../components/admin/CandidatesPanel";
import VotersPanel from "../components/admin/VotersPanel";
import ResultsPanel from "../components/admin/ResultsPanel";
import { getElectionStatus } from "../utils/elections";

const TABS = ["Elections", "Candidates", "Voters", "Results"];

// The admin dashboard owns ALL the data (state). The panels below only show it
// and call the functions we pass to them as props (lifting state up).
export default function AdminDashboard() {
  const [elections, setElections] = useLocalStorage("elections", []);
  const [candidates, setCandidates] = useLocalStorage("candidates", []);
  const [users, setUsers] = useLocalStorage("users", []);
  const [votes, setVotes] = useLocalStorage("votes", []);
  const [activeTab, setActiveTab] = useState("Elections");
  const [message, setMessage] = useState("");
  const now = useNow();

  // Side effect: hide the success message after 3 seconds.
  useEffect(() => {
    if (!message) return undefined;
    const timerId = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(timerId);
  }, [message]);

  useEffect(() => {
    document.title = "Admin dashboard | Online Voting";
  }, []);

  // ---------- ELECTIONS: create, update, delete, status ----------
  function addElection(data) {
    setElections([
      ...elections,
      { id: Date.now(), ...data, closedByAdmin: false, resultsPublished: false }
    ]);
    setMessage("Election created successfully.");
  }

  function updateElection(id, data) {
    setElections(elections.map((election) => (election.id === id ? { ...election, ...data } : election)));
    setMessage("Election updated successfully.");
  }

  function deleteElection(id) {
    setElections(elections.filter((election) => election.id !== id));
    // Also remove everything that belongs to this election.
    setCandidates(candidates.filter((candidate) => candidate.electionId !== id));
    setVotes(votes.filter((vote) => vote.electionId !== id));
    setMessage("Election deleted with its candidates and votes.");
  }

  function toggleClosed(id) {
    const election = elections.find((item) => item.id === id);
    setElections(
      elections.map((item) => (item.id === id ? { ...item, closedByAdmin: !item.closedByAdmin } : item))
    );
    setMessage(election.closedByAdmin ? "Voting reopened." : "Voting closed.");
  }

  function togglePublished(id) {
    const election = elections.find((item) => item.id === id);
    setElections(
      elections.map((item) => (item.id === id ? { ...item, resultsPublished: !item.resultsPublished } : item))
    );
    setMessage(election.resultsPublished ? "Results hidden from voters." : "Results announced to voters.");
  }

  // ---------- CANDIDATES: create, update, delete ----------
  function addCandidate(data) {
    setCandidates([...candidates, { id: Date.now(), ...data }]);
    setMessage("Candidate added successfully.");
  }

  function updateCandidate(id, data) {
    setCandidates(candidates.map((candidate) => (candidate.id === id ? { ...candidate, ...data } : candidate)));
    setMessage("Candidate updated successfully.");
  }

  function deleteCandidate(id) {
    setCandidates(candidates.filter((candidate) => candidate.id !== id));
    setVotes(votes.filter((vote) => vote.candidateId !== id));
    setMessage("Candidate deleted successfully.");
  }

  // ---------- VOTERS: delete ----------
  function deleteVoter(email) {
    setUsers(users.filter((user) => user.email !== email));
    setVotes(votes.filter((vote) => vote.email !== email));
    setMessage("Voter removed successfully.");
  }

  const openCount = elections.filter((election) => getElectionStatus(election, now) === "Open").length;

  return (
    <main className="container page-content">
      <div className="page-heading">
        <div>
          <p className="tag">ADMIN MODULE</p>
          <h1>Admin dashboard</h1>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><strong>{users.length}</strong><span>Registered voters</span></div>
        <div className="stat-card"><strong>{elections.length}</strong><span>Elections</span></div>
        <div className="stat-card"><strong>{openCount}</strong><span>Open now</span></div>
        <div className="stat-card"><strong>{votes.length}</strong><span>Votes cast</span></div>
      </div>

      <div className="nav nav-pills tab-bar" role="tablist" aria-label="Admin sections">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={activeTab === tab ? "nav-link active" : "nav-link"}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {message && <div className="alert alert-success" role="status">{message}</div>}

      {activeTab === "Elections" && (
        <ElectionsPanel
          elections={elections}
          candidates={candidates}
          votes={votes}
          now={now}
          onAdd={addElection}
          onUpdate={updateElection}
          onDelete={deleteElection}
          onToggleClosed={toggleClosed}
        />
      )}
      {activeTab === "Candidates" && (
        <CandidatesPanel
          elections={elections}
          candidates={candidates}
          onAdd={addCandidate}
          onUpdate={updateCandidate}
          onDelete={deleteCandidate}
        />
      )}
      {activeTab === "Voters" && <VotersPanel users={users} votes={votes} onDelete={deleteVoter} />}
      {activeTab === "Results" && (
        <ResultsPanel
          elections={elections}
          candidates={candidates}
          votes={votes}
          voterCount={users.length}
          now={now}
          onTogglePublished={togglePublished}
        />
      )}
    </main>
  );
}
