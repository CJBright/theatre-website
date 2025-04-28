import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;

// Needed to fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read shows.json data for current shows
const showsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/shows.json')));

// Static files (css, js, images, videos)
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/pages'));

// Middleware to find current page for button styling
  // Default to 'home' if root path
  // Save it into res.locals so it's available in every EJS template
app.use((req, res, next) => {
  let path = req.path.split('/')[1];
  if (path === '') path = 'home';
  res.locals.currentPage = path.toLowerCase();
  next();
});

// Route for Homepage
app.get('/', (req, res) => {
  res.render('home', { shows: showsData });
});

// Route for Shows page
app.get('/shows', (req, res) => {
  res.render('shows', { shows: showsData });
});

// Route for About page
app.get('/about', (req, res) => {
  res.render('about', { shows: showsData });
});

// Route for Contact page
app.get('/contact', (req, res) => {
  res.render('contact', { shows: showsData });
});

// Route for a specific show page
app.get('/shows/:slug', (req, res) => {
  const showSlug = req.params.slug;
  const show = showsData.find(s => s.slug === showSlug);
  // Catch incorrect slugs
  if (!show) {
    return res.status(404).send('Show not found');
  }
  res.render('single-show', { show });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});