import React, { useState } from "react";

export default function VotersPanel({ users, votes, onDelete }) {
  const [search, setSearch] = useState("");

  const visibleUsers = users.filter((user) => {
    const text = search.trim().toLowerCase();
    return user.name.toLowerCase().includes(text) || user.email.includes(text);
  });

  function handleDelete(user) {
    if (!window.confirm(`Remove ${user.name}? Their votes will also be removed.`)) return;
    onDelete(user.email); // DELETE
  }

  return (
    <div className="panel">
      <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-3">
        <h2 className="mb-0">Registered voters</h2>
        <input
          className="form-control voter-search"
          type="search"
          placeholder="Search by name or email"
          aria-label="Search voters"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      {users.length === 0 ? (
        <p className="mb-0">No registered voters yet.</p>
      ) : (
        <div className="table-wrap">
          <table className="table table-striped align-middle mb-0">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Date of birth</th><th>Votes cast</th><th>Action</th></tr>
            </thead>
            <tbody>
              {/* READ: every registered voter */}
              {visibleUsers.map((user) => (
                <tr key={user.email}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.dob}</td>
                  <td>{votes.filter((vote) => vote.email === user.email).length}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" type="button"
                      onClick={() => handleDelete(user)} aria-label={`Remove ${user.name}`}>Remove</button>
                  </td>
                </tr>
              ))}
              {visibleUsers.length === 0 && <tr><td colSpan="5">No voter matches your search.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
