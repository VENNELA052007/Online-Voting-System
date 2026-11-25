import React, { useState } from "react";

export default function CandidatesPanel({ elections, candidates, onAdd, onUpdate, onDelete }) {
  const [selectedElectionId, setSelectedElectionId] = useState(elections.length > 0 ? elections[0].id : null);
  const [form, setForm] = useState({ name: "", party: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  // If the selected election was deleted, fall back to the first one.
  const electionId = elections.some((election) => election.id === selectedElectionId)
    ? selectedElectionId
    : (elections.length > 0 ? elections[0].id : null);

  const visibleCandidates = candidates.filter((candidate) => candidate.electionId === electionId);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function resetForm() {
    setForm({ name: "", party: "" });
    setEditingId(null);
    setError("");
  }

  function handleElectionChange(event) {
    setSelectedElectionId(Number(event.target.value));
    resetForm();
  }

  function handleSubmit(event) {
    event.preventDefault();
    const data = { name: form.name.trim(), party: form.party.trim() };

    if (!data.name || !data.party) {
      setError("Candidate name and party are required.");
      return;
    }

    if (editingId === null) onAdd({ electionId, ...data }); // CREATE
    else onUpdate(editingId, data); // UPDATE
    resetForm();
  }

  function startEditing(candidate) {
    setEditingId(candidate.id);
    setForm({ name: candidate.name, party: candidate.party });
    setError("");
  }

  function handleDelete(candidate) {
    onDelete(candidate.id); // DELETE
    if (editingId === candidate.id) resetForm();
  }

  if (elections.length === 0) {
    return <div className="panel"><p className="mb-0">Create an election first, then add its candidates.</p></div>;
  }

  return (
    <div className="row g-4">
      <section className="col-lg-5">
        <div className="panel">
          <h2>{editingId === null ? "Add candidate" : "Edit candidate"}</h2>
          <form onSubmit={handleSubmit}>
            <label className="form-label" htmlFor="electionSelect">Election</label>
            <select className="form-select" id="electionSelect" value={electionId} onChange={handleElectionChange}>
              {elections.map((election) => (
                <option key={election.id} value={election.id}>{election.title}</option>
              ))}
            </select>
            <label className="form-label" htmlFor="candidateName">Candidate name</label>
            <input className="form-control" id="candidateName" name="name" value={form.name} onChange={handleChange} required />
            <label className="form-label" htmlFor="candidateParty">Party or group</label>
            <input className="form-control" id="candidateParty" name="party" value={form.party} onChange={handleChange} required />
            {error && <div className="alert alert-danger mt-3 mb-0" role="alert">{error}</div>}
            <div className="d-flex flex-wrap gap-2 mt-3">
              <button className="btn btn-primary button" type="submit">
                {editingId === null ? "Add candidate" : "Save changes"}
              </button>
              {editingId !== null && (
                <button className="btn btn-outline-secondary button" type="button" onClick={resetForm}>Cancel</button>
              )}
            </div>
          </form>
        </div>
      </section>

      <section className="col-lg-7">
        <div className="panel">
          <h2>Candidates</h2>
          <div className="card-list">
            {visibleCandidates.length === 0 && <p>No candidates in this election yet.</p>}
            {/* READ: candidates of the selected election */}
            {visibleCandidates.map((candidate) => (
              <div className="candidate-card" key={candidate.id}>
                <div><h3>{candidate.name}</h3><p>{candidate.party}</p></div>
                <div className="d-flex flex-wrap gap-2">
                  <button className="btn btn-outline-primary button" type="button"
                    onClick={() => startEditing(candidate)} aria-label={`Edit ${candidate.name}`}>Edit</button>
                  <button className="btn btn-danger button danger" type="button"
                    onClick={() => handleDelete(candidate)} aria-label={`Delete ${candidate.name}`}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
