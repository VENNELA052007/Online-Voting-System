import React from "react";
import Header from "./Header";

// Shared page frame: the navbar on top, the current page (children) below.
export default function Layout({ user, onLogout, children }) {
  return (
    <>
      <Header user={user} onLogout={onLogout} />
      {children}
    </>
  );
}
