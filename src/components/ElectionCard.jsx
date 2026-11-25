import React, { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge";
import ResultBars from "./ResultBars";
import { formatDateTime, getCountdownText } from "../utils/elections";

// One election as the voter sees it: details, candidates, vote form, confirmation.
export default function ElectionCard({ election, status, now, candidates, myVote, results, onVote }) {
  const [selectedId, setSelectedId] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const canVote = status === "Open" && !myVote;
  const votedCandidate = myVote ? candidates.find((c) => c.id === myVote.candidateId) : null;
  const selectedCandidate = candidates.find((candidate) => candidate.id === selectedId);
  const countdownText = getCountdownText(election, status, now);
  const countdownTarget = status === "Open" ? election.endTime : election.startTime;
  const countdownNeedsWarning = countdownText && new Date(countdownTarget) - now < 60 * 60 * 1000;

  useEffect(() => {
    if (!confirming) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") setConfirming(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [confirming]);

  useEffect(() => {
    if (!canVote) setConfirming(false);
  }, [canVote]);

  function handleSubmit(event) {
    event.preventDefault();
    if (selectedId === null) return;
    setConfirming(true);
  }

  return (
    <article className="election-card" aria-label={election.title}>
      <div className="d-flex justify-content-between align-items-start gap-2 flex-wrap">
        <h2 className="h4 mb-1">{election.title}</h2>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <StatusBadge status={status} />
          {countdownText && (
            <small className={countdownNeedsWarning ? "text-warning-emphasis" : "text-secondary"}>
              {countdownText}
            </small>
          )}
        </div>
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

      {confirming && canVote && selectedCandidate && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div
            className="modal d-block"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`vote-confirm-title-${election.id}`}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title fs-5" id={`vote-confirm-title-${election.id}`}>
                    Confirm your vote
                  </h2>
                  <button
                    className="btn-close"
                    type="button"
                    aria-label="Cancel"
                    onClick={() => setConfirming(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    You are voting for <strong>{selectedCandidate.name}</strong> ({selectedCandidate.party})
                    in <strong>{election.title}</strong>.
                  </p>
                  <p className="mb-0">You cannot change your vote after confirming.</p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setConfirming(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => {
                      onVote(election.id, selectedId);
                      setConfirming(false);
                    }}
                  >
                    Confirm vote
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </article>
  );
}
