import React, { useState } from "react";
import StatusBadge from "../StatusBadge";
import { formatDateTime, getElectionStatus } from "../../utils/elections";
import { toInputValue } from "../../utils/storage";

// A new election starts now and ends in 24 hours (the admin can change both).
function emptyForm() {
  const start = new Date();
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { title: "", description: "", startTime: toInputValue(start), endTime: toInputValue(end) };
}

export default function ElectionsPanel({ elections, candidates, votes, now, onAdd, onUpdate, onDelete, onToggleClosed }) {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null); // null = creating, a number = editing that election
  const [error, setError] = useState("");

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function resetForm() {
    setForm(emptyForm());
    setEditingId(null);
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    const data = {
      title: form.title.trim(),
      description: form.description.trim(),
      startTime: form.startTime,
      endTime: form.endTime
    };

    if (!data.title) {
      setError("Election title is required.");
      return;
    }
    if (new Date(data.endTime) <= new Date(data.startTime)) {
      setError("The end time must be after the start time.");
      return;
    }

    if (editingId === null) onAdd(data); // CREATE
    else onUpdate(editingId, data); // UPDATE
    resetForm();
  }

  function startEditing(election) {
    setEditingId(election.id);
    setForm({
      title: election.title,
      description: election.description,
      startTime: election.startTime,
      endTime: election.endTime
    });
    setError("");
  }

  function handleDelete(election) {
    if (!window.confirm(`Delete "${election.title}" with all its candidates and votes?`)) return;
    onDelete(election.id); // DELETE
    if (editingId === election.id) resetForm();
  }

  return (
    <div className="row g-4">
      <section className="col-lg-5">
        <div className="panel">
          <h2>{editingId === null ? "Create election" : "Edit election"}</h2>
          <form onSubmit={handleSubmit}>
            <label className="form-label" htmlFor="title">Election title</label>
            <input className="form-control" id="title" name="title" value={form.title} onChange={handleChange} required />
            <label className="form-label" htmlFor="description">Description</label>
            <textarea className="form-control" id="description" name="description" rows="2"
              value={form.description} onChange={handleChange} />
            <label className="form-label" htmlFor="startTime">Voting starts</label>
            <input className="form-control" id="startTime" name="startTime" type="datetime-local"
              value={form.startTime} onChange={handleChange} required />
            <label className="form-label" htmlFor="endTime">Voting ends</label>
            <input className="form-control" id="endTime" name="endTime" type="datetime-local"
              value={form.endTime} onChange={handleChange} required />
            {error && <div className="alert alert-danger mt-3 mb-0" role="alert">{error}</div>}
            <div className="d-flex flex-wrap gap-2 mt-3">
              <button className="btn btn-primary button" type="submit">
                {editingId === null ? "Create election" : "Save changes"}
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
          <h2>All elections</h2>
          {elections.length === 0 && <p>No elections yet. Create the first one.</p>}
          <div className="card-list">
            {/* READ: list every election with its status and schedule */}
            {elections.map((election) => {
              const status = getElectionStatus(election, now);
              const candidateCount = candidates.filter((c) => c.electionId === election.id).length;
              const voteCount = votes.filter((v) => v.electionId === election.id).length;
              return (
                <div className="election-card" key={election.id}>
                  <div className="d-flex justify-content-between align-items-start gap-2 flex-wrap">
                    <h3 className="h5 mb-1">{election.title}</h3>
                    <StatusBadge status={status} />
                  </div>
                  {election.description && <p className="mb-1">{election.description}</p>}
                  <p className="election-meta mb-2">
                    {formatDateTime(election.startTime)} to {formatDateTime(election.endTime)}
                    <br />
                    {candidateCount} candidate(s) · {voteCount} vote(s)
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    <button className="btn btn-outline-primary button" type="button"
                      onClick={() => startEditing(election)} aria-label={`Edit ${election.title}`}>Edit</button>
                    <button className="btn btn-outline-secondary button" type="button"
                      onClick={() => onToggleClosed(election.id)}>
                      {election.closedByAdmin ? "Reopen voting" : "Close voting"}
                    </button>
                    <button className="btn btn-danger button danger" type="button"
                      onClick={() => handleDelete(election)} aria-label={`Delete ${election.title}`}>Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
