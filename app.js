import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';

// Load the environment variables
dotenv.config();

// Use Twilio SendGrid's v3 Node.js Library
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Create the web app
const app = express();
const PORT = process.env.PORT || 3000;

// Needed to fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read JSON data files
const showsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/shows.json')));
const aboutData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/about.json')));
const faqData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/faq.json')));

// Set static file paths (css, js, images, videos)
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/pages'));

// Function - Render 404
function renderNotFound(res) {
  return res.status(404).render('404');
}

// Function - Capitalise names
function capitalise(word) {
  return word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : '';
}

// Middleware - Custom - Find current page for navigation bar styling
app.use((req, res, next) => {
  let path = req.path.split('/')[1];
  // Default to 'home' if root path
  if (path === '') path = 'home';
  // Save it into res.locals so it's available in every EJS template
  res.locals.currentPage = path.toLowerCase();
  next();
});

// Middleware - bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

// Route for Homepage
  // showData needed for poster section
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
  
  // Return 404 if the show does not exist
  if (!show) return renderNotFound(res);

  // Render the show screen.
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

  // Return 404 if the section does not exist
  if (!section) return renderNotFound(res);

  // Access section.template and display
  const aboutTemplate = section.template || 'about-post-single-image'
  res.render(aboutTemplate, { section });
});

// Route for Contact page
app.get('/contact', (req, res) => {
  res.render('contact', { faqs: faqData });
});

// Route to POST Contact page contact-form
app.post('/contact', async (req, res) => {

  // Extract and format the full form fields
  const {
    firstName,
    lastName,
    email,
    phone,
    subject,
    message
  } = req.body;

  // Compose the email content
  const msg = {
    to: process.env.CONTACT_RECEIVER, // Business receiving email address (in .env)
    from: process.env.SENDGRID_VERIFIED, // Business SendGrid verified sender (in .env)
    replyTo: email, // User's email address (from contact form) 
    subject: `New Contact Form Message: ${subject}`,
    text: `
Name: ${capitalise(firstName)} ${capitalise(lastName)}
Email: ${email}
Phone: ${phone || 'Not provided'}

Message:
${message}
    `.trim()
  };

  // Log the message
  console.log(msg);

  // Try to send the email and redirect user
  try {
    await sgMail.send(msg);
    console.log('✅ Contact form email sent');
    res.render('contact-confirmation', {
      firstName: capitalise(firstName),
      lastName: capitalise(lastName),
      email,
      phone,
      subject,
      message
    });
  } catch (err) {
    console.error('❌ Email failed to send:', err);
    res.status(500).send('Sorry, something went wrong when sending the message.');
  }
});

// Route for 404 pages
app.use((req, res) => {
  res.status(404).render('404');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});