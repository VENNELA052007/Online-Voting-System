import React, { useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import useNow from "../hooks/useNow";
import ElectionCard from "../components/ElectionCard";
import { getElectionStatus, getResults } from "../utils/elections";

export default function VoterDashboard({ user }) {
  const [elections] = useLocalStorage("elections", []);
  const [candidates] = useLocalStorage("candidates", []);
  const [votes, setVotes] = useLocalStorage("votes", []);
  const [message, setMessage] = useState("");
  const now = useNow();

  // Side effect: set the browser tab title for this page.
  useEffect(() => {
    document.title = "Voter dashboard | Online Voting";
  }, []);

  const myVotes = votes.filter((vote) => vote.email === user.email);
  const openCount = elections.filter((election) => getElectionStatus(election, now) === "Open").length;

  // CREATE: record one vote
  function castVote(electionId, candidateId) {
    const election = elections.find((item) => item.id === electionId);

    if (getElectionStatus(election, new Date()) !== "Open") {
      setMessage("Voting is not open for this election.");
      return;
    }
    // Prevent duplicate voting: one vote per voter per election
    if (votes.some((vote) => vote.electionId === electionId && vote.email === user.email)) {
      setMessage("You have already voted in this election.");
      return;
    }

    setVotes([
      ...votes,
      { id: Date.now(), electionId, candidateId, email: user.email, castAt: new Date().toISOString() }
    ]);
    setMessage("Your vote has been recorded successfully.");
  }

  return (
    <main className="container page-content">
      <div className="page-heading">
        <div>
          <p className="tag">VOTER MODULE</p>
          <h1>Voter dashboard</h1>
          <p>Welcome, {user.name}.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><strong>{elections.length}</strong><span>Elections</span></div>
        <div className="stat-card"><strong>{openCount}</strong><span>Open for voting</span></div>
        <div className="stat-card"><strong>{myVotes.length}</strong><span>Votes you have cast</span></div>
      </div>

      {message && <div className="alert alert-info" role="status">{message}</div>}

      {elections.length === 0 && <p>No elections have been created yet.</p>}
      <div className="election-list">
        {elections.map((election) => (
          <ElectionCard
            key={election.id}
            election={election}
            status={getElectionStatus(election, now)}
            candidates={candidates.filter((candidate) => candidate.electionId === election.id)}
            myVote={myVotes.find((vote) => vote.electionId === election.id)}
            results={getResults(election.id, candidates, votes)}
            onVote={castVote}
          />
        ))}
      </div>
    </main>
  );
}
