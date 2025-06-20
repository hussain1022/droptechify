// Optimized DropTechify Website Script
console.log('🚀 Loading DropTechify website...');

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Initialize AOS with performance optimization
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 400,
        once: true,
        offset: 30,
        disable: window.innerWidth < 768, // Disable on mobile for better performance
        startEvent: 'DOMContentLoaded'
    });
}

// Enhanced Mobile Navigation - Clean Implementation
const initMobileNav = () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navToggle || !navMenu) {
        console.log('Navigation elements not found');
        return;
    }

    console.log('Initializing mobile navigation...');

    // Reset initial state
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    document.body.classList.remove('menu-open');

    let isMenuOpen = false;

    // Add close button to menu
    const closeButton = document.createElement('button');
    closeButton.className = 'nav-close-btn';
    closeButton.innerHTML = '×';
    closeButton.setAttribute('aria-label', 'Close menu');
    
    // Remove any existing close button first
    const existingCloseBtn = navMenu.querySelector('.nav-close-btn');
    if (existingCloseBtn) {
        existingCloseBtn.remove();
    }
    
    navMenu.appendChild(closeButton);

    // Enhanced toggle function
    const toggleMenu = (forceClose = false) => {
        console.log('Toggle menu called, current state:', isMenuOpen);
        
        if (forceClose || isMenuOpen) {
            // Close menu
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
            isMenuOpen = false;
            console.log('Menu closed');
        } else {
            // Open menu
            navMenu.classList.add('active');
            navToggle.classList.add('active');
            document.body.classList.add('menu-open');
            document.body.style.overflow = 'hidden';
            isMenuOpen = true;
            console.log('Menu opened');
        }
    };

    // Enhanced click handler for toggle button
    const handleToggleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Nav toggle clicked!');
        toggleMenu();
    };

    // Add event listeners
    navToggle.addEventListener('click', handleToggleClick);
    navToggle.addEventListener('touchstart', handleToggleClick, { passive: true });

    // Close button event listener
    closeButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Close button clicked');
        toggleMenu(true);
    });

    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            console.log('Nav link clicked, closing menu');
            toggleMenu(true);
        });
    });

    // Close menu when clicking dropdown items
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            console.log('Dropdown item clicked, closing menu');
            toggleMenu(true);
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            console.log('Clicked outside, closing menu');
            toggleMenu(true);
        }
    });

    // Close menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && isMenuOpen) {
            console.log('Window resized, closing menu');
            toggleMenu(true);
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            console.log('Escape pressed, closing menu');
            toggleMenu(true);
        }
    });

    console.log('Mobile navigation initialized successfully');
};

// Optimized smooth scrolling
const initSmoothScroll = () => {
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        e.preventDefault();
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);

        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
};

// Enhanced navbar - Always sticky and visible
const initNavbarScroll = () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // Simple scroll effect for navbar
    const updateNavbar = throttle(() => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        }
    }, 16);

    window.addEventListener('scroll', updateNavbar, { passive: true });
};

// Optimized floating elements animation
const initFloatingElements = () => {
    const floatingElements = document.querySelectorAll('.floating-element');

    floatingElements.forEach((element) => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'scale(1.2) translateY(-10px)';
            element.style.boxShadow = '0 10px 30px rgba(255,255,255,0.3)';
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1)';
            element.style.boxShadow = 'none';
        });
    });
};

// Optimized intersection observer
const initScrollAnimations = () => {
    if (!window.IntersectionObserver) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target); // Stop observing after animation
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .review-card, .stat-item');
    animatedElements.forEach(el => observer.observe(el));
};

// Optimized scroll progress indicator
const initScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        z-index: 9999;
        transition: width 0.1s ease;
        will-change: width;
    `;
    document.body.appendChild(progressBar);

    const updateProgress = throttle(() => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = Math.min(scrolled, 100) + '%';
    }, 16);

    window.addEventListener('scroll', updateProgress, { passive: true });
};

// Optimized form submission
const initContactForm = () => {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        const successMsg = document.getElementById('form-success');
        const errorMsg = document.getElementById('form-error');

        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                contactForm.style.display = 'none';
                successMsg.style.display = 'block';

                // Auto-open WhatsApp after 3 seconds
                setTimeout(() => {
                    const name = formData.get('name');
                    const service = formData.get('service');
                    const whatsappMessage = `Hi! I'm ${name} and I'm interested in ${service}. Can we discuss?`;
                    const whatsappUrl = `https://wa.me/923030273718?text=${encodeURIComponent(whatsappMessage)}`;
                    window.open(whatsappUrl, '_blank');
                }, 3000);

            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            errorMsg.style.display = 'block';
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
};

// Button ripple effect with performance optimization
const initButtonEffects = () => {
    let rippleStyle = document.getElementById('ripple-styles');
    if (!rippleStyle) {
        rippleStyle = document.createElement('style');
        rippleStyle.id = 'ripple-styles';
        rippleStyle.textContent = `
            .btn {
                position: relative;
                overflow: hidden;
            }
            .ripple {
                position: absolute;
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                background-color: rgba(255, 255, 255, 0.7);
                pointer-events: none;
            }
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(rippleStyle);
    }

    document.addEventListener('click', (e) => {
        const button = e.target.closest('.btn');
        if (!button) return;

        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
        `;
        ripple.classList.add('ripple');
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
};

// Optimized image lazy loading with performance boost
const initLazyLoading = () => {
    // Add loading="lazy" to all images for native lazy loading
    document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });

    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    } else {
        // Fallback with improved performance
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        }, { rootMargin: '50px' });

        document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
    }
};

// Resource preloading for better performance
const preloadResources = () => {
    // Preload critical CSS
    const criticalCSS = ['https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'];

    criticalCSS.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
    });
};

// Service worker registration for caching
const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => console.log('SW registered'))
                .catch(error => console.log('SW registration failed'));
        });
    }
};

// Countdown Timer Function
const initCountdownTimer = () => {
    // Set end date (15 days from now)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 15);

    const countdownTimer = document.getElementById('countdown-timer');
    if (!countdownTimer) return;

    const updateTimer = () => {
        const now = new Date().getTime();
        const distance = endDate.getTime() - now;

        if (distance < 0) {
            // Timer expired
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    };

    // Update immediately and then every second
    updateTimer();
    setInterval(updateTimer, 1000);
};

// Initialize all functions when DOM is ready
const initializeWebsite = () => {
    console.log('🚀 Initializing DropTechify website...');

    // Core functionality
    initMobileNav();
    initSmoothScroll();
    initNavbarScroll();
    initScrollProgress();
    initContactForm();

    // Visual enhancements
    initFloatingElements();
    initScrollAnimations();
    initButtonEffects();

    // Performance optimizations
    initLazyLoading();
    preloadResources();

    // Additional functionality
    initCountdownTimer();

    console.log('✅ DropTechify website initialized successfully!');
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWebsite);
} else {
    initializeWebsite();
}

// Add fade-in animation CSS
const fadeInStyle = document.createElement('style');
fadeInStyle.textContent = `
    .fade-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
        transition: all 0.6s ease !important;
    }

    .service-card, .review-card, .stat-item {
        opacity: 0;
        transform: translateY(30px);
    }
`;
document.head.appendChild(fadeInStyle);

// Modal functions for portfolio
window.openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => {
            modal.querySelector('.modal-content').style.transform = 'scale(1)';
            modal.querySelector('.modal-content').style.opacity = '1';
        });
    }
};

window.closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.querySelector('.modal-content').style.transform = 'scale(0.8)';
        modal.querySelector('.modal-content').style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
};

// Close modal on outside click
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        window.closeModal(e.target.id);
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal[style*="block"]');
        openModals.forEach(modal => window.closeModal(modal.id));
    }
});

// Initialize AOS
AOS.init({
    duration: 800,
    offset: 100,
    once: true
});

// Enhanced mobile navigation (handled by initMobileNav function)

// Firebase integration for homepage reviews
document.addEventListener('DOMContentLoaded', function() {
    loadHomepageReviews();
});

// Load reviews for homepage
async function loadHomepageReviews() {
    try {
        // Firebase configuration
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
        const { getFirestore, collection, onSnapshot, orderBy, query, limit } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');

        const firebaseConfig = {
            apiKey: "AIzaSyChFO-OThN7rPIZuAOVNP8aG7R9qEAO-z4",
            authDomain: "droptechify-80034.firebaseapp.com",
            projectId: "droptechify-80034",
            storageBucket: "droptechify-80034.firebasestorage.app",
            messagingSenderId: "41692901589",
            appId: "1:41692901589:web:1e2000fd5bf89f0d7c725c",
            measurementId: "G-1PJMJF5W4L"
        };

        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        // Listen for reviews
        const reviewsQuery = query(collection(db, 'reviews'), orderBy('dateAdded', 'desc'), limit(6));
        onSnapshot(reviewsQuery, (snapshot) => {
            const reviewsContainer = document.getElementById('homepage-reviews');
            if (reviewsContainer && snapshot.docs.length > 0) {
                reviewsContainer.innerHTML = '';

                snapshot.docs.forEach(doc => {
                    const review = doc.data();
                    const reviewCard = createReviewCard(review);
                    reviewsContainer.appendChild(reviewCard);
                });
            } else if (reviewsContainer) {
                reviewsContainer.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                        <p style="color: #666;">Reviews will appear here once added from admin panel.</p>
                    </div>
                `;
            }
        });
    } catch (error) {
        console.log('Homepage reviews not loaded:', error);
    }
}

// Create review card
function createReviewCard(review) {
    const card = document.createElement('div');
    card.className = 'review-card';
    card.setAttribute('data-aos', 'fade-up');

    const ratingStars = '⭐'.repeat(review.rating || 5);

    card.innerHTML = `
        <div class="stars">${ratingStars}</div>
        <p>"${review.text || ''}"</p>
        <div class="reviewer">
            <strong>${review.name || 'Anonymous'}</strong>
            ${review.position && review.company ? `<br><small>${review.position} at ${review.company}</small>` : ''}
        </div>
    `;

    return card;
}

console.log('🎉 DropTechify website script loaded and optimized!');
