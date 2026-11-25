# Online Voting System

A responsive front-end student election project built with React, Vite and
Bootstrap. It includes voter registration, login, candidate selection,
election status control and an admin dashboard. Demo data is stored in the
browser's Local Storage.

## Run locally

1. Install Node.js (version 20.19 or newer).
2. Run `npm install`.
3. Run `npm run dev`, then open the local URL printed by Vite.

Create a production build with `npm run build`.

## Demo admin account

- Email: `admin@voting.com`
- Password: `admin123`

## Deploy to Vercel

Commit and push the project to GitHub, then import the repository into Vercel.
Vercel detects Vite automatically. Use `npm run build` as the build command and
`dist` as the output directory. The included `vercel.json` sends app routes to
the React entry point.

## Demo limitations

This project is for classroom demonstration, not real elections. Local Storage
is specific to a browser and device, and account passwords are not securely
stored. A real election needs a trusted backend, secure authentication,
authorization, and tamper-resistant vote storage.
