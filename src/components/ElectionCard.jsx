import React, { useState } from "react";
import StatusBadge from "./StatusBadge";
import ResultBars from "./ResultBars";
import { formatDateTime } from "../utils/elections";

// One election as the voter sees it: details, candidates, vote form, confirmation.
export default function ElectionCard({ election, status, candidates, myVote, results, onVote }) {
  const [selectedId, setSelectedId] = useState(null);

  const canVote = status === "Open" && !myVote;
  const votedCandidate = myVote ? candidates.find((c) => c.id === myVote.candidateId) : null;

  function handleSubmit(event) {
    event.preventDefault();
    if (selectedId === null) return;
    onVote(election.id, selectedId);
  }

  return (
    <article className="election-card" aria-label={election.title}>
      <div className="d-flex justify-content-between align-items-start gap-2 flex-wrap">
        <h2 className="h4 mb-1">{election.title}</h2>
        <StatusBadge status={status} />
      </div>
      {election.description && <p className="mb-1">{election.description}</p>}
      <p className="election-meta">
        {formatDateTime(election.startTime)} to {formatDateTime(election.endTime)}
      </p>

      {/* Conditional rendering: a different message for each situation */}
      {votedCandidate && (
        <div className="alert alert-success" role="status">
          ✓ Vote confirmed. You voted for <strong>{votedCandidate.name}</strong> on{" "}
          {formatDateTime(myVote.castAt)}. You can vote only once in this election.
        </div>
      )}
      {!myVote && status === "Upcoming" && (
        <div className="alert alert-info" role="status">
          Voting opens on {formatDateTime(election.startTime)}.
        </div>
      )}
      {!myVote && status === "Closed" && (
        <div className="alert alert-danger" role="status">Voting is closed for this election.</div>
      )}
      {!myVote && status === "Ended" && (
        <div className="alert alert-secondary" role="status">Voting ended on {formatDateTime(election.endTime)}.</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card-list">
          {candidates.length === 0 && <p>No candidates have been added yet.</p>}
          {/* List rendering: one card per candidate, each with a unique key */}
          {candidates.map((candidate) => (
            <label className="candidate-card voter-choice" key={candidate.id}>
              <span>
                <input
                  className="form-check-input"
                  type="radio"
                  name={`candidate-${election.id}`}
                  value={candidate.id}
                  checked={myVote ? myVote.candidateId === candidate.id : selectedId === candidate.id}
                  disabled={!canVote}
                  onChange={() => setSelectedId(candidate.id)}
                />
                <strong>{candidate.name}</strong>
                <span className="candidate-party">{candidate.party}</span>
              </span>
            </label>
          ))}
        </div>
        {canVote && (
          <button
            className="btn btn-primary button vote-button"
            type="submit"
            disabled={selectedId === null || candidates.length === 0}
          >
            Cast vote
          </button>
        )}
      </form>

      {election.resultsPublished && (
        <div className="results-box">
          <h3 className="h5">Final results</h3>
          <ResultBars results={results} announced />
        </div>
      )}
    </article>
  );
}
