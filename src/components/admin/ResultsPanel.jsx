import React from "react";
import StatusBadge from "../StatusBadge";
import ResultBars from "../ResultBars";
import { getElectionStatus, getResults } from "../../utils/elections";
import { downloadCsv, toCsv } from "../../utils/csv";

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
        const safeTitle = election.title
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "") || "election";

        function exportResults() {
          const rows = [
            ["Election", "Candidate", "Party", "Votes", "Percentage"],
            ...results.rows.map(({ candidate, count, percent }) => [
              election.title,
              candidate.name,
              candidate.party,
              count,
              `${percent}%`
            ]),
            ["Total votes", "", "", results.total, ""],
            ["Registered voters", "", "", voterCount, ""],
            ["Turnout", "", "", "", `${turnout}%`]
          ];

          downloadCsv(`${safeTitle}-results.csv`, toCsv(rows));
        }

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
            <div className="d-flex flex-wrap gap-2 mt-3">
              <button className="btn btn-primary button" type="button" onClick={() => onTogglePublished(election.id)}>
                {election.resultsPublished ? "Hide results from voters" : "Announce results"}
              </button>
              <button
                className="btn btn-outline-secondary button"
                type="button"
                onClick={exportResults}
                disabled={results.rows.length === 0}
              >
                Export CSV
              </button>
            </div>
          </section>
        );
      })}
    </div>
  );
}
