const h = React.createElement;
const ADMIN_EMAIL = "admin@voting.com";
const ADMIN_PASSWORD = "admin123";

function getData(key, defaultValue) {
  const savedData = localStorage.getItem(key);
  return savedData ? JSON.parse(savedData) : defaultValue;
}

function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

if (!localStorage.getItem("candidates")) {
  saveData("candidates", [
    { id: 1, name: "Ananya Reddy", party: "Student Progress Group" },
    { id: 2, name: "Rahul Kumar", party: "Campus Development Group" }
  ]);
}
if (!localStorage.getItem("users")) saveData("users", []);
if (!localStorage.getItem("votes")) saveData("votes", []);
if (!localStorage.getItem("electionOpen")) localStorage.setItem("electionOpen", "false");

function Header({ rightSide }) {
  return h("header", { className: "topbar" },
    h("a", { href: "index.html", className: "brand" }, "Online Voting System"),
    rightSide
  );
}

function Home() {
  return h("main", { className: "hero" },
    h("div", { className: "hero-text" },
      h("h1", null, "Online Voting System"),
      h("p", null, "A simple website for our student election."),
      h("div", { className: "button-row" },
        h("a", { className: "button", href: "login.html" }, "Login"),
        h("a", { className: "button secondary", href: "signup.html" }, "New voter signup")
      )
    )
  );
}

function Login() {
  const [message, setMessage] = React.useState("");

  function handleLogin(event) {
    event.preventDefault();
    const email = event.currentTarget.elements.email.value.trim().toLowerCase();
    const password = event.currentTarget.elements.password.value;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      saveData("currentUser", { email: email, role: "admin" });
      location.href = "admin.html";
      return;
    }

    const users = getData("users", []);
    let user = null;
    for (let i = 0; i < users.length; i++) {
      if (users[i].email === email && users[i].password === password) {
        user = users[i];
        break;
      }
    }

    if (user === null) {
      setMessage("Invalid email or password.");
      return;
    }

    saveData("currentUser", { email: user.email, name: user.name, role: "user" });
    location.href = "user.html";
  }

  return h(React.Fragment, null,
    h(Header, { rightSide: h("a", { href: "signup.html" }, "Create account") }),
    h("main", { className: "form-page" },
      h("form", { className: "form-card", onSubmit: handleLogin },
        h("h1", null, "Login"),
        h("p", { className: "small-text" }, "Voters and admin use this login."),
        h("label", { htmlFor: "email" }, "Email"),
        h("input", { id: "email", name: "email", type: "email", required: true }),
        h("label", { htmlFor: "password" }, "Password"),
        h("input", { id: "password", name: "password", type: "password", required: true }),
        h("p", { className: "message" }, message),
        h("button", { type: "submit", className: "button" }, "Login"),
        h("p", { className: "small-text" }, "Admin demo: admin@voting.com / admin123")
      )
    )
  );
}

function Signup() {
  const [message, setMessage] = React.useState("");

  function handleSignup(event) {
    event.preventDefault();
    const form = event.currentTarget.elements;
    const name = form.name.value.trim();
    const dob = form.dob.value;
    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const birthdayNotReached = today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());

    if (birthdayNotReached) age--;
    if (!dob || age < 18) {
      setMessage("You must be 18 or above to register for voting.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const users = getData("users", []);
    for (let i = 0; i < users.length; i++) {
      if (users[i].email === email) {
        setMessage("An account with this email already exists.");
        return;
      }
    }

    users.push({ name: name, dob: dob, email: email, password: password });
    saveData("users", users);
    alert("Signup successful. You can now login.");
    location.href = "login.html";
  }

  return h(React.Fragment, null,
    h(Header, { rightSide: h("a", { href: "login.html" }, "Login") }),
    h("main", { className: "form-page" },
      h("form", { className: "form-card", onSubmit: handleSignup },
        h("h1", null, "Voter Signup"),
        h("label", { htmlFor: "name" }, "Name"),
        h("input", { id: "name", name: "name", type: "text", required: true }),
        h("label", { htmlFor: "dob" }, "Date of Birth"),
        h("input", { id: "dob", name: "dob", type: "date", required: true }),
        h("label", { htmlFor: "email" }, "Email"),
        h("input", { id: "email", name: "email", type: "email", required: true }),
        h("label", { htmlFor: "password" }, "Password"),
        h("input", { id: "password", name: "password", type: "password", required: true }),
        h("label", { htmlFor: "confirmPassword" }, "Confirm Password"),
        h("input", { id: "confirmPassword", name: "confirmPassword", type: "password", required: true }),
        h("p", { className: "message" }, message),
        h("button", { type: "submit", className: "button" }, "Sign up")
      )
    )
  );
}

function Admin() {
  const [candidates, setCandidates] = React.useState(getData("candidates", []));
  const [isOpen, setIsOpen] = React.useState(localStorage.getItem("electionOpen") === "true");
  const [message, setMessage] = React.useState("");
  const users = getData("users", []);
  const votes = getData("votes", []);

  function addCandidate(event) {
    event.preventDefault();
    const form = event.currentTarget.elements;
    const candidate = {
      id: Date.now(),
      name: form.candidateName.value.trim(),
      party: form.candidateParty.value.trim()
    };
    const updatedCandidates = candidates.concat(candidate);
    setCandidates(updatedCandidates);
    saveData("candidates", updatedCandidates);
    event.currentTarget.reset();
    setMessage("Candidate added successfully.");
  }

  function deleteCandidate(id) {
    const updatedCandidates = candidates.filter(function (candidate) {
      return candidate.id !== id;
    });
    setCandidates(updatedCandidates);
    saveData("candidates", updatedCandidates);
  }

  function toggleElection() {
    const newStatus = !isOpen;
    setIsOpen(newStatus);
    localStorage.setItem("electionOpen", String(newStatus));
  }

  function logout() {
    localStorage.removeItem("currentUser");
    location.href = "index.html";
  }

  return h(React.Fragment, null,
    h(Header, { rightSide: h("button", { className: "button", onClick: logout }, "Logout") }),
    h("main", { className: "page-content" },
      h("div", { className: "page-heading" },
        h("div", null,
          h("p", { className: "tag" }, "ADMIN MODULE"),
          h("h1", null, "Admin Dashboard")
        ),
        h("div", null,
          h("span", null, "Election: "),
          h("span", { className: isOpen ? "status" : "status closed" }, isOpen ? "OPEN" : "CLOSED"),
          h("button", { className: "button secondary", onClick: toggleElection }, isOpen ? "Stop Election" : "Start Election")
        )
      ),
      h("div", { className: "grid" },
        h("section", { className: "panel" },
          h("h2", null, "Add Candidate"),
          h("form", { onSubmit: addCandidate },
            h("label", { htmlFor: "candidateName" }, "Candidate name"),
            h("input", { id: "candidateName", name: "candidateName", type: "text", required: true }),
            h("label", { htmlFor: "candidateParty" }, "Party or group"),
            h("input", { id: "candidateParty", name: "candidateParty", type: "text", required: true }),
            h("button", { className: "button", type: "submit" }, "Add Candidate")
          ),
          h("p", { className: "message" }, message)
        ),
        h("section", { className: "panel" },
          h("h2", null, "Candidates"),
          h("div", { className: "card-list" },
            candidates.length ? candidates.map(function (candidate) {
              return h("div", { className: "candidate-card", key: candidate.id },
                h("div", null,
                  h("h3", null, candidate.name),
                  h("p", null, candidate.party)
                ),
                h("button", { className: "button danger", onClick: function () { deleteCandidate(candidate.id); } }, "Delete")
              );
            }) : h("p", null, "No candidates added.")
          )
        )
      ),
      h("div", { className: "grid" },
        h("section", { className: "panel" },
          h("h2", null, "Registered Voters"),
          users.length ? h("table", null,
            h("thead", null, h("tr", null, h("th", null, "Name"), h("th", null, "Email"))),
            h("tbody", null, users.map(function (user) {
              return h("tr", { key: user.email }, h("td", null, user.name), h("td", null, user.email));
            }))
          ) : h("p", null, "No registered voters yet.")
        ),
        h("section", { className: "panel" },
          h("h2", null, "Election Results"),
          candidates.length ? candidates.map(function (candidate) {
            let count = 0;
            for (let i = 0; i < votes.length; i++) {
              if (votes[i].candidateId === candidate.id) count++;
            }
            return h("p", { key: candidate.id }, h("strong", null, candidate.name), ": ", count, " vote(s)");
          }) : h("p", null, "No results to show.")
        )
      )
    )
  );
}

function User() {
  const currentUser = getData("currentUser", null);
  const [candidates] = React.useState(getData("candidates", []));
  const [votes, setVotes] = React.useState(getData("votes", []));
  const [selectedId, setSelectedId] = React.useState("");
  const [message, setMessage] = React.useState("");
  const isOpen = localStorage.getItem("electionOpen") === "true";
  let hasVoted = false;

  for (let i = 0; i < votes.length; i++) {
    if (votes[i].email === currentUser.email) hasVoted = true;
  }

  function castVote(event) {
    event.preventDefault();
    if (localStorage.getItem("electionOpen") !== "true") {
      setMessage("Voting is currently closed.");
      return;
    }
    if (!selectedId) {
      setMessage("Please select a candidate.");
      return;
    }
    if (hasVoted) {
      setMessage("You have already voted.");
      return;
    }

    const newVote = { email: currentUser.email, candidateId: Number(selectedId) };
    const updatedVotes = votes.concat(newVote);
    setVotes(updatedVotes);
    saveData("votes", updatedVotes);
    setMessage("Your vote has been recorded. You can vote only once.");
  }

  function logout() {
    localStorage.removeItem("currentUser");
    location.href = "index.html";
  }

  return h(React.Fragment, null,
    h(Header, { rightSide: h("button", { className: "button", onClick: logout }, "Logout") }),
    h("main", { className: "page-content" },
      h("div", { className: "page-heading" },
        h("div", null,
          h("p", { className: "tag" }, "USER MODULE"),
          h("h1", null, "Voter Dashboard"),
          h("p", null, "Welcome, ", currentUser.name, ".")
        ),
        h("p", { className: isOpen ? "status" : "status closed" }, isOpen ? "Election is open" : "Election is closed")
      ),
      h("section", { className: "panel" },
        h("h2", null, "Choose one candidate"),
        h("p", { className: "message" }, message || (hasVoted ? "Your vote has been recorded. You can vote only once." : (!isOpen ? "Voting is currently closed." : ""))),
        h("form", { onSubmit: castVote },
          h("div", { className: "card-list" },
            candidates.length ? candidates.map(function (candidate) {
              return h("label", { className: "candidate-card", key: candidate.id },
                h("span", null,
                  h("input", {
                    type: "radio",
                    name: "candidate",
                    value: candidate.id,
                    checked: selectedId === String(candidate.id),
                    disabled: hasVoted || !isOpen,
                    onChange: function () { setSelectedId(String(candidate.id)); }
                  }),
                  " ", h("strong", null, candidate.name), " - ", candidate.party
                )
              );
            }) : h("p", null, "No candidates are available.")
          ),
          h("button", { type: "submit", className: "button", disabled: hasVoted || !isOpen || candidates.length === 0 }, "Cast Vote")
        )
      )
    )
  );
}

const rootElement = document.getElementById("root");
const page = rootElement.dataset.page;
const currentUser = getData("currentUser", null);

if (page === "admin" && (!currentUser || currentUser.role !== "admin")) {
  location.href = "login.html";
} else if (page === "user" && (!currentUser || currentUser.role !== "user")) {
  location.href = "login.html";
} else {
  const pages = { home: Home, login: Login, signup: Signup, admin: Admin, user: User };
  const PageComponent = pages[page];
  ReactDOM.createRoot(rootElement).render(h(PageComponent));
}
