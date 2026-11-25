import React from "react";

// Vote counts as progress bars. Used by the admin results tab AND the voter's election card.
export default function ResultBars({ results, announced }) {
  const { rows, total, winners } = results;

  if (rows.length === 0) return <p className="mb-0">No candidates in this election.</p>;

  const label = announced ? "Winner" : "Leading";

  return (
    <div>
      {rows.map(({ candidate, count, percent }) => (
        <div className="mb-3" key={candidate.id}>
          <div className="d-flex justify-content-between gap-2">
            <strong>{candidate.name}</strong>
            <span>{count} vote(s) · {percent}%</span>
          </div>
          <div
            className="progress"
            role="progressbar"
            aria-label={`${candidate.name} vote share`}
            aria-valuenow={percent}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div className="progress-bar" style={{ width: `${percent}%` }}></div>
          </div>
        </div>
      ))}
      <p className="small-text mb-0">
        Total votes: {total}
        {winners.length === 1 && ` · ${label}: ${winners[0]}`}
        {winners.length > 1 && ` · Tie between ${winners.join(" and ")}`}
      </p>
    </div>
  );
}
