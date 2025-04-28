// Fade images and videos in and out with scroll.
document.addEventListener('DOMContentLoaded', () => {
  const faders = document.querySelectorAll('.fade-in');

  const appearOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -50px 0px"
  };

  const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible'); // REMOVE when not in view
      }
    });
  }, appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });
});



// Parallax scrolling on images and video
document.addEventListener('scroll', () => {
  const parallaxElements = document.querySelectorAll('.parallax');

  parallaxElements.forEach(el => {
    const speed = 0.1; // Scroll speed
    const maxOffset = 100; // Maximum allowed offset in pixels

    let offset = window.scrollY * speed;

    // Cap the offset so it never goes beyond max
    if (offset > maxOffset) {
      offset = maxOffset;
    }

    el.style.transform = `translateY(${offset}px)`;
  });
});


// Count items on shows page to determine spacing
document.addEventListener('DOMContentLoaded', () => {
  const row = document.querySelector('.shows-grid-row');
  const cards = row.querySelectorAll('.col');

  if (cards.length % 4 === 1) {
    row.classList.add('justify-center');
  } else {
    row.classList.add('justify-space-evenly');
  }
});
