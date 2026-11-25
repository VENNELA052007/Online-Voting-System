import React from "react";
import { Link, NavLink } from "react-router-dom";

function navClass({ isActive }) {
  return isActive ? "nav-link active" : "nav-link";
}

export default function Header({ user, onLogout }) {
  const isAdmin = user && user.role === "admin";

  return (
    <header className="topbar navbar">
      <div className="container">
        <Link to="/" className="navbar-brand brand">
          <span className="brand-mark" aria-hidden="true">V</span>
          <span>Online Voting</span>
        </Link>
        <nav className="nav-links navbar-nav flex-row" aria-label="Main navigation">
          {!user && <NavLink className={navClass} to="/login">Login</NavLink>}
          {!user && <NavLink className={navClass} to="/signup">Sign up</NavLink>}
          {user && (
            <>
              <NavLink className={navClass} to={isAdmin ? "/admin" : "/dashboard"}>
                {isAdmin ? "Admin dashboard" : "My dashboard"}
              </NavLink>
              <span className="nav-user">{user.name || "Administrator"}</span>
              <button className="btn btn-outline-light button nav-logout" type="button" onClick={onLogout}>
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
