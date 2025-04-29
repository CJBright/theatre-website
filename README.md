# Theatre Company Website
This project is an informational website for a theatre stage show company.
It advertises upcoming shows, provides show details, and links users to external ticket purchasing platforms.


## Tech Stack
Frontend: HTML5, CSS3, JavaScript (ES6), Bootstrap 5<br>
Backend: Node.js, Express.js, EJS templating, JSON-driven content<br>
Dev Tools: Nodemon, VS Code<br>


## Project Structure

- `public/` – Static files  
  - `css/`, `js/` – Frontend assets  
  - `images/`, `videos/` – Media used across the site

- `views/` – EJS templates  
  - `partials/` – Header, footer  
  - `pages/` – Main site pages

- `data/` – JSON-driven content  
  - `shows.json` – All show information
  - `about.json` – Post content for the About page
  - `faqs.json` – FAQ content for the Contact page

- `app.js` – Express.js app entry  
- `package.json` – Dependencies and scripts  
- `README.md` – Project overview

## Run Locally
### 1. Clone the repository
`git clone https://github.com/CJBright/theatre-site.git`<br>
`cd theatre-site`

### 2. Install project dependencies
`npm install`

### 3. Run the server
`npm start`<br>
The site will be available at http://localhost:3000
