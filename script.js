// DOM Elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');
const revealPhoneBtn = document.getElementById('revealPhoneBtn');
const revealEmailBtn = document.getElementById('revealEmailBtn');
const phoneDisplay = document.getElementById('phoneDisplay');
const emailDisplay = document.getElementById('emailDisplay');

// Protected contact information (encoded to avoid simple scraping)
const encodedPhone = 'KzIzNDgwNTY4MjkwNzM='; // BaW5mase64 encoded: +1 (234) 567-8900
const encodedEmail = 'd2FuZGFsYWZhcm1zbmdAZ21haWwuY29t'; // Base64 encoded: info@greenvalleyfarm.com

// Slideshow images array (11 images as requested)
const slideImages = [
    'images/slide1.jpg',
    'images/slide2.jpg',
    'images/slide3.jpg',
    'images/slide4.jpg',
    'images/slide5.jpg',
    'images/slide6.jpg',
    'images/slide7.jpg',
    'images/slide8.jpg',
    'images/slide9.jpg',
    'images/slide10.jpg',
    'images/slide11.jpg'
];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Initialize slideshow with all images
    initSlideshow();
    
    // Initialize image loading
    initImageLoading();
});

// ===== MOBILE MENU FUNCTIONALITY =====
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileNav.classList.toggle('active');
        mobileMenuBtn.innerHTML = mobileNav.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (mobileNav && mobileNav.classList.contains('active') && 
        !mobileNav.contains(e.target) && 
        !mobileMenuBtn.contains(e.target)) {
        mobileNav.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
});

// Close menu when clicking a link
if (mobileNav) {
    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// ===== IMAGE SLIDESHOW FUNCTIONALITY =====
function initSlideshow() {
    const slidesWrapper = document.querySelector('.slides-wrapper');
    const slideshowNav = document.querySelector('.slideshow-nav');
    const prevBtn = document.querySelector('.slideshow-prev');
    const nextBtn = document.querySelector('.slideshow-next');
    
    if (!slidesWrapper || !slideshowNav) return;
    
    let currentSlide = 0;
    let slides = [];
    let dots = [];
    
    // Create slides dynamically
    slideImages.forEach((imageSrc, index) => {
        // Create slide element
        const slide = document.createElement('div');
        slide.className = `slide ${index === 0 ? 'active' : ''}`;
        slide.dataset.index = index;
        
        // Create image element
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = `Farm image ${index + 1}`;
        img.className = 'slide-image loading';
        img.loading = 'lazy';
        img.width = 1200;
        img.height = 800;
        
        // Add loading handler
        img.addEventListener('load', function() {
            this.classList.remove('loading');
            this.classList.add('loaded');
        });
        
        img.addEventListener('error', function() {
            console.log(`Failed to load slide image: ${this.src}`);
            this.classList.remove('loading');
            // Fallback background color
            this.style.backgroundColor = '#7a9c59';
        });
        
        slide.appendChild(img);
        slidesWrapper.appendChild(slide);
        slides.push(slide);
        
        // Create navigation dot
        const dot = document.createElement('button');
        dot.className = `slideshow-dot ${index === 0 ? 'active' : ''}`;
        dot.dataset.slide = index;
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        slideshowNav.appendChild(dot);
        dots.push(dot);
        
        // Add click event to dot
        dot.addEventListener('click', () => {
            showSlide(index);
            resetSlideTimer();
        });
    });
    
    function showSlide(n) {
        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show the selected slide
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    // Auto advance slides
    let slideTimer = setInterval(nextSlide, 4000);
    
    function resetSlideTimer() {
        clearInterval(slideTimer);
        slideTimer = setInterval(nextSlide, 4000);
    }
    
    // Navigation button events
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetSlideTimer();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetSlideTimer();
        });
    }
    
    // Pause slideshow on hover
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mouseenter', () => {
            clearInterval(slideTimer);
        });
        
        slideshowContainer.addEventListener('mouseleave', () => {
            resetSlideTimer();
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetSlideTimer();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetSlideTimer();
        }
    });
}

// ===== IMAGE LOADING WITH PLACEHOLDER MAINTENANCE =====
function initImageLoading() {
    const images = document.querySelectorAll('img:not(.slide-image)');
    
    images.forEach(img => {
        // Add loading class to fade in when loaded
        if (!img.complete) {
            img.classList.add('loading');
        }
        
        img.addEventListener('load', function() {
            this.classList.remove('loading');
            this.classList.add('loaded');
        });
        
        // Handle images that might fail to load
        img.addEventListener('error', function() {
            console.log(`Image failed to load: ${this.src}`);
            this.classList.remove('loading');
            // Set a placeholder color
            this.style.backgroundColor = '#f0f0f0';
            this.style.padding = '20px';
            this.alt = 'Image not available';
        });
    });
}

// ===== CONTACT INFORMATION PROTECTION =====
let phoneRevealed = false;
let emailRevealed = false;

if (revealPhoneBtn) {
    revealPhoneBtn.addEventListener('click', function() {
        // Decode and reveal phone number
        const phoneNumber = atob(encodedPhone);
        
        // Create a clickable link
        const phoneLink = document.createElement('a');
        phoneLink.href = `tel:${phoneNumber.replace(/\D/g, '')}`;
        phoneLink.textContent = phoneNumber;
        phoneLink.style.color = 'var(--primary-color)';
        phoneLink.style.textDecoration = 'none';
        phoneLink.style.fontWeight = 'bold';
        phoneLink.style.fontSize = '1.2rem';
        phoneLink.style.marginRight = '10px';
        
        // Create WhatsApp link
        const whatsappLink = document.createElement('a');
        const cleanPhone = phoneNumber.replace(/\D/g, '');
        whatsappLink.href = `https://wa.me/${cleanPhone}`;
        whatsappLink.textContent = 'Message on WhatsApp';
        whatsappLink.className = 'btn contact-btn';
        whatsappLink.style.marginTop = '15px';
        whatsappLink.style.display = 'block';
        whatsappLink.target = '_blank';
        whatsappLink.rel = 'noopener noreferrer';
        
        // Replace content
        phoneDisplay.innerHTML = '';
        phoneDisplay.appendChild(phoneLink);
        phoneDisplay.appendChild(document.createElement('br'));
        phoneDisplay.appendChild(whatsappLink);
        
        // Hide the reveal button
        revealPhoneBtn.style.display = 'none';
        phoneRevealed = true;
        
        // Log for analytics (in real implementation, send to server)
        console.log('Phone number revealed by user');
    });
}

if (revealEmailBtn) {
    revealEmailBtn.addEventListener('click', function() {
        // Decode and reveal email
        const emailAddress = atob(encodedEmail);
        
        // Create a clickable mailto link
        const emailLink = document.createElement('a');
        emailLink.href = `mailto:${emailAddress}`;
        emailLink.textContent = emailAddress;
        emailLink.style.color = 'var(--primary-color)';
        emailLink.style.textDecoration = 'none';
        emailLink.style.fontWeight = 'bold';
        emailLink.style.fontSize = '1.2rem';
        
        // Replace content
        emailDisplay.innerHTML = '';
        emailDisplay.appendChild(emailLink);
        
        // Hide the reveal button
        revealEmailBtn.style.display = 'none';
        emailRevealed = true;
        
        // Log for analytics (in real implementation, send to server)
        console.log('Email address revealed by user');
    });
}

// ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if(this.getAttribute('href') === '#') return;
        
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// ===== BUTTON LOADING EFFECT =====
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
        // Add a slight loading effect
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
});