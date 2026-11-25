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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("ending");
  const now = useNow();

  // Side effect: set the browser tab title for this page.
  useEffect(() => {
    document.title = "Voter dashboard | Online Voting";
  }, []);

  const myVotes = votes.filter((vote) => vote.email === user.email);
  const openCount = elections.filter((election) => getElectionStatus(election, now) === "Open").length;
  const searchText = search.trim().toLowerCase();
  const filteredElections = elections.filter((election) => {
    const matchesSearch = !searchText ||
      election.title.toLowerCase().includes(searchText) ||
      candidates.some((candidate) =>
        candidate.electionId === election.id && candidate.name.toLowerCase().includes(searchText)
      );
    const matchesStatus = statusFilter === "All" || getElectionStatus(election, now) === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const visibleElections = [...filteredElections].sort((first, second) => {
    if (sortBy === "newest") return new Date(second.startTime) - new Date(first.startTime);
    if (sortBy === "title") return first.title.localeCompare(second.title);
    return new Date(first.endTime) - new Date(second.endTime);
  });
  const filtersAreActive = Boolean(searchText) || statusFilter !== "All";

  function clearFilters() {
    setSearch("");
    setStatusFilter("All");
  }

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

      <section className="panel mb-3" aria-label="Find elections">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-5">
            <label className="form-label" htmlFor="electionSearch">Search</label>
            <input
              className="form-control"
              id="electionSearch"
              type="search"
              placeholder="Search elections or candidates"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="col-12 col-md-3">
            <label className="form-label" htmlFor="electionStatus">Status</label>
            <select
              className="form-select"
              id="electionStatus"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              {["All", "Open", "Upcoming", "Ended", "Closed"].map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-3">
            <label className="form-label" htmlFor="electionSort">Sort by</label>
            <select
              className="form-select"
              id="electionSort"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="ending">Ending soonest</option>
              <option value="newest">Newest first</option>
              <option value="title">Title A to Z</option>
            </select>
          </div>
          {filtersAreActive && (
            <div className="col-12 col-md-1">
              <button className="btn btn-outline-secondary w-100" type="button" onClick={clearFilters}>
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {message && <div className="alert alert-info" role="status">{message}</div>}

      {elections.length === 0 && <p>No elections have been created yet.</p>}
      {elections.length > 0 && (
        <p className="small-text" aria-live="polite">
          Showing {visibleElections.length} of {elections.length} elections
        </p>
      )}
      {elections.length > 0 && visibleElections.length === 0 && (
        <div className="alert alert-info" role="status">
          No elections match your search.
          <button className="btn btn-link" type="button" onClick={clearFilters}>Clear filters</button>
        </div>
      )}
      <div className="election-list">
        {visibleElections.map((election) => (
          <ElectionCard
            key={election.id}
            election={election}
            status={getElectionStatus(election, now)}
            now={now}
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
