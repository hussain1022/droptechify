// Ultra-Optimized DropTechify Website Script
console.log('🚀 Loading DropTechify website...');

// Critical performance optimizations
const optimizePerformance = () => {
    // Preload critical resources
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap';
    preloadLink.as = 'style';
    document.head.appendChild(preloadLink);

    // Optimize images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.loading = 'lazy';
        img.decoding = 'async';
    });

    // Reduce layout thrashing
    document.documentElement.style.contain = 'layout style paint';
};

// Smooth Scroll Enhancement
const addSmoothScrollStyle = () => {
    if (!document.getElementById('smooth-scroll-style')) {
        const style = document.createElement('style');
        style.id = 'smooth-scroll-style';
        style.textContent = `
            html {
                scroll-behavior: smooth;
                scroll-padding-top: 2rem;
            }

            /* Enhanced scroll progress bar */
            .scroll-progress {
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 4px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                z-index: 10000;
                transition: width 0.2s ease;
                border-radius: 0 2px 2px 0;
                box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
            }

            /* Smooth transitions for all interactive elements */
            a, button, .btn, .nav-btn, .service-card, .tech-item {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
        `;
        document.head.appendChild(style);
    }
};

// Enhanced scroll progress with smooth animation
const initSmoothScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    let ticking = false;

    const updateProgress = () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = Math.min(scrolled, 100) + '%';

        // Add glow effect when scrolling
        if (scrolled > 5) {
            progressBar.style.boxShadow = '0 2px 20px rgba(102, 126, 234, 0.5)';
        } else {
            progressBar.style.boxShadow = '0 2px 10px rgba(102, 126, 234, 0.3)';
        }

        ticking = false;
    };

    const requestTick = () => {
        if (!ticking) {
            requestAnimationFrame(updateProgress);
            ticking = true;
        }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
};

// Enhanced smooth scroll for navigation
const initEnhancedSmoothScroll = () => {
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        e.preventDefault();
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);

        if (target) {
            const offsetTop = target.offsetTop - 20;

            // Smooth scroll with custom easing
            const startPosition = window.pageYOffset;
            const distance = offsetTop - startPosition;
            const duration = Math.min(Math.abs(distance) / 2, 1000); // Max 1 second
            let start = null;

            const animation = (currentTime) => {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            };

            const easeInOutCubic = (t, b, c, d) => {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t * t + b;
                t -= 2;
                return c / 2 * (t * t * t + 2) + b;
            };

            requestAnimationFrame(animation);
        }
    });
};

// Enhanced Hero portfolio dropdown functionality
const initHeroPortfolioDropdown = () => {
    console.log('Initializing hero portfolio dropdown...');

    const heroPortfolioDropdown = document.querySelector('.portfolio-dropdown-hero');
    if (heroPortfolioDropdown) {
        const portfolioBtn = heroPortfolioDropdown.querySelector('.portfolio-btn');
        const dropdownMenu = heroPortfolioDropdown.querySelector('.dropdown-menu-hero');
        let isDropdownOpen = false;
        let touchStarted = false;

        // Function to toggle dropdown
        const toggleDropdown = (e) => {
            e.preventDefault();
            e.stopPropagation();

            isDropdownOpen = !isDropdownOpen;
            heroPortfolioDropdown.classList.toggle('active', isDropdownOpen);

            // Rotate chevron icon
            const chevron = portfolioBtn.querySelector('.fa-chevron-down');
            if (chevron) {
                chevron.style.transform = isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)';
            }

            // Add ripple effect for visual feedback
            const ripple = document.createElement('span');
            const rect = portfolioBtn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = (e.clientX || e.touches?.[0]?.clientX || rect.left + rect.width/2) - rect.left - size / 2;
            const y = (e.clientY || e.touches?.[0]?.clientY || rect.top + rect.height/2) - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                border-radius: 50%;
                background: rgba(255,255,255,0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                z-index: 1;
            `;
            portfolioBtn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);

            console.log('Dropdown toggled:', isDropdownOpen);
        };

        // Function to close dropdown
        const closeDropdown = () => {
            if (isDropdownOpen) {
                isDropdownOpen = false;
                heroPortfolioDropdown.classList.remove('active');
                const chevron = portfolioBtn.querySelector('.fa-chevron-down');
                if (chevron) {
                    chevron.style.transform = 'rotate(0deg)';
                }
            }
        };

        // Enhanced mobile touch events
        let touchTimeout;

        portfolioBtn.addEventListener('touchstart', (e) => {
            touchStarted = true;
            clearTimeout(touchTimeout);
            e.preventDefault();

            // Add visual feedback
            portfolioBtn.style.transform = 'scale(0.95)';
        }, { passive: false });

        portfolioBtn.addEventListener('touchend', (e) => {
            if (touchStarted) {
                touchStarted = false;
                e.preventDefault();

                // Reset visual feedback
                portfolioBtn.style.transform = 'scale(1)';

                // Small delay to prevent double-tap issues
                touchTimeout = setTimeout(() => {
                    toggleDropdown(e);
                }, 50);
            }
        }, { passive: false });

        // Desktop click event
        portfolioBtn.addEventListener('click', (e) => {
            if (!touchStarted) {
                toggleDropdown(e);
            }
        });

        // Close dropdown when clicking/touching outside
        document.addEventListener('click', (e) => {
            if (!heroPortfolioDropdown.contains(e.target)) {
                closeDropdown();
            }
        });

        document.addEventListener('touchstart', (e) => {
            if (!heroPortfolioDropdown.contains(e.target)) {
                closeDropdown();
            }
        });

        // Close dropdown when clicking/touching on dropdown items
        if (dropdownMenu) {
            dropdownMenu.addEventListener('click', (e) => {
                if (e.target.closest('.dropdown-item-hero')) {
                    setTimeout(closeDropdown, 100);
                }
            });

            dropdownMenu.addEventListener('touchend', (e) => {
                if (e.target.closest('.dropdown-item-hero')) {
                    setTimeout(closeDropdown, 100);
                }
            });
        }

        // Close dropdown on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeDropdown();
            }
        });

        // Prevent default touch behaviors that might interfere
        heroPortfolioDropdown.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
    }

    console.log('Hero portfolio dropdown initialized successfully');
};

// Fix reviews section display
const fixReviewsDisplay = () => {
    const reviewsGrid = document.querySelector('.reviews-grid');
    if (reviewsGrid && reviewsGrid.children.length === 0) {
        reviewsGrid.innerHTML = `
            <div class="empty-content" style="grid-column: 1 / -1;">
                <h3>No Reviews Available</h3>
                <p>Client reviews will appear here once added from the admin panel.</p>
            </div>
        `;
    }
};

// Enhanced floating elements animation
const initFloatingElements = () => {
    const floatingElements = document.querySelectorAll('.floating-element');

    floatingElements.forEach((element, index) => {
        // Add slight delay to each element for staggered animation
        element.style.animationDelay = `${index * 0.5}s`;

        element.addEventListener('mouseenter', () => {
            element.style.transform = 'scale(1.2) translateY(-10px)';
            element.style.boxShadow = '0 15px 40px rgba(255,255,255,0.4)';
            element.style.filter = 'brightness(1.2)';
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1)';
            element.style.boxShadow = 'none';
            element.style.filter = 'brightness(1)';
        });
    });
};

// Enhanced scroll animations with better performance
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
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .review-card, .stat-item, .tech-category, .process-step');
    animatedElements.forEach(el => observer.observe(el));
};

// Enhanced form submission with better UX
const initContactForm = () => {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        const successMsg = document.getElementById('form-success');
        const errorMsg = document.getElementById('form-error');

        // Show loading state with animation
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        submitBtn.style.background = 'linear-gradient(135deg, #a0aec0 0%, #718096 100%)';

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
                successMsg.style.animation = 'fadeInUp 0.5s ease';

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
            errorMsg.style.animation = 'fadeInUp 0.5s ease';
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
    });
};

// Enhanced button effects with ripple animation
const initButtonEffects = () => {
    let rippleStyle = document.getElementById('ripple-styles');
    if (!rippleStyle) {
        rippleStyle = document.createElement('style');
        rippleStyle.id = 'ripple-styles';
        rippleStyle.textContent = `
            .btn, .nav-btn {
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
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(rippleStyle);
    }

    document.addEventListener('click', (e) => {
        const button = e.target.closest('.btn, .nav-btn');
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

        // Add slight scale effect
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
    });
};

// Enhanced mobile navigation behavior
const initMobileEnhancements = () => {
    // Prevent zoom on double tap for iOS
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Add touch feedback for buttons
    const touchElements = document.querySelectorAll('.btn, .nav-btn, .service-card, .tech-item');
    touchElements.forEach(element => {
        element.addEventListener('touchstart', () => {
            element.style.transform = 'scale(0.98)';
        }, { passive: true });

        element.addEventListener('touchend', () => {
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 100);
        }, { passive: true });
    });

    // Optimize mobile side nav
    if (window.innerWidth <= 768) {
        const sideNav = document.querySelector('.side-nav');
        if (sideNav) {
            // Hide side nav when scrolling down, show when scrolling up
            let lastScrollTop = 0;
            window.addEventListener('scroll', () => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    sideNav.style.transform = 'translateX(-50%) translateY(20px)';
                    sideNav.style.opacity = '0.8';
                } else {
                    sideNav.style.transform = 'translateX(-50%) translateY(0)';
                    sideNav.style.opacity = '1';
                }
                lastScrollTop = scrollTop;
            }, { passive: true });
        }
    }
};

// Initialize all functions when DOM is ready
const initializeWebsite = () => {
    console.log('🚀 Initializing DropTechify website...');

    // Performance optimizations first
    optimizePerformance();

    // Add styles first
    addSmoothScrollStyle();

    // Core functionality
    initHeroPortfolioDropdown();
    initEnhancedSmoothScroll();
    initSmoothScrollProgress();
    initContactForm();

    // Visual enhancements (load these after critical functionality)
    requestIdleCallback(() => {
        initFloatingElements();
        initScrollAnimations();
        initButtonEffects();
        initMobileEnhancements();
    });

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

    .service-card, .review-card, .stat-item, .tech-category, .process-step {
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
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 600,
        offset: 50,
        once: true,
        disable: window.innerWidth < 768
    });
}

// Firebase integration for homepage reviews
document.addEventListener('DOMContentLoaded', function() {
    loadHomepageReviews();
});

// Load reviews for homepage
async function loadHomepageReviews() {
    try {
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
                        <p style="color: #718096;">Reviews will appear here once added from admin panel.</p>
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
// Ultra performance optimizations
const optimizeWebsitePerformance = () => {
    // Reduce unnecessary repaints
    document.documentElement.style.willChange = 'scroll-position';

    // Optimize images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.style.willChange = 'auto';
        img.loading = 'lazy';
        img.decoding = 'async';
    });

    // Optimize animations for 60fps
    const animatedElements = document.querySelectorAll('.floating-element, .service-card, .tech-item');
    animatedElements.forEach(el => {
        el.style.transform = 'translate3d(0,0,0)';
        el.style.backfaceVisibility = 'hidden';
    });
};
