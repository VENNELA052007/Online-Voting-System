import React from "react";
import StatusBadge from "../StatusBadge";
import ResultBars from "../ResultBars";
import { getElectionStatus, getResults } from "../../utils/elections";

// Monitor voting live, and announce the results to voters when ready.
export default function ResultsPanel({ elections, candidates, votes, voterCount, now, onTogglePublished }) {
  if (elections.length === 0) {
    return <div className="panel"><p className="mb-0">No elections to show results for.</p></div>;
  }

  return (
    <div className="card-list">
      {elections.map((election) => {
        const results = getResults(election.id, candidates, votes);
        const turnout = voterCount === 0 ? 0 : Math.round((results.total / voterCount) * 100);
        return (
          <section className="panel" key={election.id} aria-label={`Results of ${election.title}`}>
            <div className="d-flex justify-content-between align-items-start gap-2 flex-wrap mb-2">
              <h2 className="mb-0">{election.title}</h2>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <StatusBadge status={getElectionStatus(election, now)} />
                <span className={`badge rounded-pill ${election.resultsPublished ? "text-bg-primary" : "text-bg-light border"}`}>
                  {election.resultsPublished ? "Results announced" : "Results not announced"}
                </span>
              </div>
            </div>
            <p className="election-meta">
              Turnout: {results.total} vote(s) from {voterCount} registered voter(s) ({turnout}%)
            </p>
            <ResultBars results={results} announced={election.resultsPublished} />
            <button className="btn btn-primary button mt-3" type="button" onClick={() => onTogglePublished(election.id)}>
              {election.resultsPublished ? "Hide results from voters" : "Announce results"}
            </button>
          </section>
        );
      })}
    </div>
  );
}
