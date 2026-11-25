// Small helper functions about elections. No React in here.

// An election is "Open" only inside its schedule and only if the admin has not closed it.
export function getElectionStatus(election, now = new Date()) {
  if (election.closedByAdmin) return "Closed";
  if (now < new Date(election.startTime)) return "Upcoming";
  if (now > new Date(election.endTime)) return "Ended";
  return "Open";
}

export function formatDateTime(value) {
  return new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

// Counts the votes of every candidate in one election.
export function getResults(electionId, candidates, votes) {
  const electionVotes = votes.filter((vote) => vote.electionId === electionId);
  const total = electionVotes.length;

  const rows = candidates
    .filter((candidate) => candidate.electionId === electionId)
    .map((candidate) => {
      const count = electionVotes.filter((vote) => vote.candidateId === candidate.id).length;
      const percent = total === 0 ? 0 : Math.round((count / total) * 100);
      return { candidate, count, percent };
    });

  const topCount = Math.max(0, ...rows.map((row) => row.count));
  const winners = topCount === 0
    ? []
    : rows.filter((row) => row.count === topCount).map((row) => row.candidate.name);

  return { rows, total, winners };
}

export function getAge(dob) {
  const birthDate = new Date(`${dob}T00:00:00`);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const beforeBirthday =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}
