// Navbar (burger) toggle
const burgerMenu = document.getElementById('burger-menu');
const navList = document.querySelector('nav ul.navigation');
const navLinks = document.querySelectorAll('.nav-link');

function closeMobileNav() {
  navList?.classList.remove('show');
}

burgerMenu?.addEventListener('click', () => {
  navList?.classList.toggle('show');
});

// Close menu after clicking a link (mobile)
navLinks.forEach((link) => {
  link.addEventListener('click', () => closeMobileNav());
});

// Close menu when clicking outside the nav (mobile)
document.addEventListener('click', (e) => {
  const clickedInsideNav = e.target.closest('nav');
  if (!clickedInsideNav) closeMobileNav();
});

// If user resizes to desktop, ensure nav is reset
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) closeMobileNav();
});



// Gallery Slider Functionality
const gallerySlider = document.querySelector('.gallery-slider');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const galleryCards = document.querySelectorAll('.gallery-card');
const galleryImages = document.querySelectorAll('.gallery-image');

// Modal elements
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const modalClose = document.querySelector('.modal-close');

// Calculate scroll amount (one card width + gap)
let scrollAmount = 0;
const cardWidth = galleryCards[0]?.offsetWidth || 300;
const gap = 24; // 1.5rem = 24px
const scrollStep = cardWidth + gap;

// Next button functionality
nextBtn?.addEventListener('click', () => {
  scrollAmount += scrollStep;
  if (scrollAmount > gallerySlider.scrollWidth - gallerySlider.clientWidth) {
    scrollAmount = gallerySlider.scrollWidth - gallerySlider.clientWidth;
  }
  gallerySlider.scrollTo({
    left: scrollAmount,
    behavior: 'smooth'
  });
});

// Previous button functionality
prevBtn?.addEventListener('click', () => {
  scrollAmount -= scrollStep;
  if (scrollAmount < 0) {
    scrollAmount = 0;
  }
  gallerySlider.scrollTo({
    left: scrollAmount,
    behavior: 'smooth'
  });
});

// Update scroll amount on manual scroll
gallerySlider?.addEventListener('scroll', () => {
  scrollAmount = gallerySlider.scrollLeft;
  
  // Update button visibility based on scroll position
  if (prevBtn && nextBtn) {
    prevBtn.style.opacity = scrollAmount > 0 ? '1' : '0.5';
    nextBtn.style.opacity = 
      scrollAmount >= gallerySlider.scrollWidth - gallerySlider.clientWidth - 10 
      ? '0.5' : '1';
  }
});

// Image expansion on click
galleryImages.forEach((img, index) => {
  img.addEventListener('click', () => {
    modal.style.display = 'block';
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    
    // Get caption from the card's info section
    const card = img.closest('.gallery-card');
    const title = card?.querySelector('.gallery-title')?.textContent || '';
    const description = card?.querySelector('.gallery-description')?.textContent || '';
    modalCaption.textContent = `${title} - ${description}`;
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  });
});

// Close modal
modalClose?.addEventListener('click', () => {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
});

// Close modal when clicking outside the image
modal?.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// Close modal with ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.style.display === 'block') {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// Initialize button visibility
if (prevBtn && nextBtn && gallerySlider) {
  prevBtn.style.opacity = '0.5';
  if (gallerySlider.scrollWidth <= gallerySlider.clientWidth) {
    nextBtn.style.opacity = '0.5';
  }
}

// Update on window resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    scrollAmount = gallerySlider.scrollLeft;
    if (prevBtn && nextBtn) {
      prevBtn.style.opacity = scrollAmount > 0 ? '1' : '0.5';
      nextBtn.style.opacity = 
        scrollAmount >= gallerySlider.scrollWidth - gallerySlider.clientWidth - 10 
        ? '0.5' : '1';
    }
  }, 250);
});

// Hide navbar on scroll down, show on scroll up (smooth, no delay)
const navEl = document.querySelector("nav");

let lastScrollY = window.scrollY;
let ticking = false;

function updateNavbar() {
  const currentY = window.scrollY;

  // Optional: keep navbar visible at very top
  if (currentY <= 0) {
    navEl?.classList.remove("nav--hidden");
    lastScrollY = currentY;
    ticking = false;
    return;
  }

  // If scrolling down -> hide, scrolling up -> show
  if (currentY > lastScrollY) {
    // scrolling down
    navEl?.classList.add("nav--hidden");
  } else if (currentY < lastScrollY) {
    // scrolling up
    navEl?.classList.remove("nav--hidden");
  }

  lastScrollY = currentY;
  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  },
  { passive: true }
);

// Hero fade-up on load
window.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero-intro");
  if (!hero) return;

  // Trigger after first paint so transition/animation runs reliably
  requestAnimationFrame(() => {
    hero.classList.add("is-visible");
  });
});

// Skills icons: fade-up one-by-one ONLY when scrolled down enough
document.addEventListener("DOMContentLoaded", () => {
  const skillsSection = document.querySelector("#skills");
  const skillIcons = document.querySelectorAll("#skills .icon-card");
  if (!skillsSection || !skillIcons.length) return;

  // stagger delays (slower)
  skillIcons.forEach((icon, index) => {
    icon.style.transitionDelay = `${index * 160}ms`;
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        skillIcons.forEach((icon) => icon.classList.add("is-visible"));
        obs.disconnect(); // run once
      });
    },
    {
      threshold: 0.35,                 // requires more of the section visible
      rootMargin: "0px 0px -20% 0px",  // triggers later (needs scroll)
    }
  );

  observer.observe(skillsSection);
});

// Projects cards: fade-up one-by-one when scrolled into view
document.addEventListener("DOMContentLoaded", () => {
  const projectsSection = document.querySelector("#projects");
  const cards = document.querySelectorAll("#projects .project-card");
  if (!projectsSection || !cards.length) return;

  // stagger: one-by-one reveal
  cards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 180}ms`;
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        cards.forEach((card) => card.classList.add("is-visible"));
        obs.disconnect(); // run once
      });
    },
    {
      threshold: 0.25,
      rootMargin: "0px 0px -15% 0px", // triggers after you scroll down a bit
    }
  );

  observer.observe(projectsSection);
});

// Project image lightbox
document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");
  const triggers = document.querySelectorAll(".lightbox-trigger");

  if (!lightbox || !lightboxImg || !lightboxClose || !triggers.length) return;

  const openLightbox = (src) => {
    lightboxImg.src = src;
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden"; // prevent scroll
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightboxImg.src = "";
    document.body.style.overflow = "";
  };

  triggers.forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => {
      openLightbox(img.src);
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);

  // Close when clicking outside image
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Close with ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
});

// Auto update footer year
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
