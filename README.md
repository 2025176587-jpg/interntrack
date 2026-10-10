# InternTrack – Internship Application Tracker
IMS566 Advanced Web Design Development and Content Management – Individual Assignment

**Live site:** https://2025176587-jpg.github.io/interntrack/
**Repository:** https://github.com/2025176587-jpg/interntrack

## Description
A small web application that helps students track internship applications, interviews and offers, and browse partner companies.

## Features
- Login and Register page with error feedback (simulated, no database)
- Responsive Bootstrap navbar shared by all pages
- Dashboard with summary cards, a doughnut chart (status) and a bar chart (per month)
- Applications page: searchable, filterable table
- Companies page: card grid and allowance bar chart
- Footer, page titles and meta description on every page; pages protected by a login check

## How to test login
- Username: `student`
- Password: `ims566`
- Wrong credentials show an error message. You can also create an account on the Register tab (stored in your browser only).

## Frameworks / libraries
Bootstrap 5.3 · Chart.js 4 · Google Fonts (Manrope) – all loaded via CDN.

## Structure
`index.html` (login) · `dashboard.html` · `applications.html` · `companies.html` · `css/style.css` · `js/app.js`

## Deploy
Push to GitHub → Settings → Pages → Deploy from branch `main` / root.
