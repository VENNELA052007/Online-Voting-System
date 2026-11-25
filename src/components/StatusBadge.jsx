import React from "react";

const BADGE_STYLES = {
  Open: "text-bg-success",
  Upcoming: "text-bg-info",
  Closed: "text-bg-danger",
  Ended: "text-bg-secondary"
};

export default function StatusBadge({ status }) {
  return <span className={`badge rounded-pill ${BADGE_STYLES[status]}`}>{status}</span>;
}
