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
