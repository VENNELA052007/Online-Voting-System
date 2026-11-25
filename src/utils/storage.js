// All Local Storage access lives in this file.
// Keys used: users, currentUser, elections, candidates, votes

export const ADMIN_EMAIL = "admin@voting.com";
export const ADMIN_PASSWORD = "admin123";

export function readData(key, fallback) {
  const saved = localStorage.getItem(key);
  if (saved === null) return fallback;

  try {
    return JSON.parse(saved);
  } catch (error) {
    return fallback;
  }
}

export function writeData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// <input type="datetime-local"> needs "YYYY-MM-DDTHH:mm" in local time.
export function toInputValue(date) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

// Runs once when the app starts. Creates sample data the first time.
export function initializeData() {
  if (localStorage.getItem("elections") === null) {
    const start = new Date();
    const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);

    writeData("elections", [
      {
        id: 1,
        title: "Student Council Election 2026",
        description: "Choose the student representative for this year.",
        startTime: toInputValue(start),
        endTime: toInputValue(end),
        closedByAdmin: false,
        resultsPublished: false
      }
    ]);
    writeData("candidates", [
      { id: 1, electionId: 1, name: "Ananya Reddy", party: "Student Progress Group" },
      { id: 2, electionId: 1, name: "Rahul Kumar", party: "Campus Development Group" }
    ]);
    writeData("votes", []);
    localStorage.removeItem("electionOpen"); // old single-election flag
  }
  if (localStorage.getItem("users") === null) writeData("users", []);
}
