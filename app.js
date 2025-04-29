import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Needed to fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read JSON data files
const showsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/shows.json')));
const aboutData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/about.json')));
const faqData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/faq.json')));

// Static files (css, js, images, videos)
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/pages'));

// Custom middleware to find current page for button styling
  // Default to 'home' if root path
  // Save it into res.locals so it's available in every EJS template
app.use((req, res, next) => {
  let path = req.path.split('/')[1];
  if (path === '') path = 'home';
  res.locals.currentPage = path.toLowerCase();
  next();
});

// bodyParser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Route for Homepage
// showData provided for posters
app.get('/', (req, res) => {
  res.render('home', { shows: showsData });
});

// Route for Shows page
app.get('/shows', (req, res) => {
  res.render('shows', { shows: showsData });
});

// Route for a Shows page - slug
app.get('/shows/:slug', (req, res) => {
  const showSlug = req.params.slug;
  const show = showsData.find(item => item.slug === showSlug);
  // Catch incorrect slugs
  if (!show) {
    return res.status(404).send('Show not found.');
  }
  res.render('shows-selection', { show });
});

// Route for About page with list of sections
app.get('/about', (req, res) => {
  res.render('about', { sections: aboutData });
});

// Route for About page - slug
app.get('/about/:slug', (req, res) => {
  const aboutSlug = req.params.slug;
  const section = aboutData.find(item => item.slug === aboutSlug);
  const aboutTemplate = section.template || 'about-post-single-image'
  
  // Catch incorrect slugs
  if (!section) {
    return res.status(404).send('About post not found.');
  } 
  res.render(aboutTemplate, { section });
});

// Route for Contact page
app.get('/contact', (req, res) => {
  res.render('contact', { faqs: faqData });
});

// Route for Contact page - Post contact form contents
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log('Contact form submission:', { name, email, message });
  res.render('contact-confirmation', { name });
});

// Route for 404 pages
app.use((req, res) => {
  res.status(404).render('404');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});