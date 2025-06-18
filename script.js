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
        duration: 600,
        once: true,
        offset: 50,
        disable: window.innerWidth < 768 // Disable on mobile for better performance
    });
}

// Optimized Mobile Navigation
const initMobileNav = () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!navToggle || !navMenu) return;

    // Ensure proper initial state
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');

    const toggleMenu = () => {
        const isActive = navMenu.classList.contains('active');
        const scrollY = window.scrollY;

        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');

        // Animate hamburger bars
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            if (!isActive) {
                if (index === 0) bar.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                if (index === 1) bar.style.opacity = '0';
                if (index === 2) bar.style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            }
        });

        // Prevent body scroll when menu is open (mobile only)
        if (window.innerWidth <= 768) {
            if (!isActive) {
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
                document.body.style.top = `-${scrollY}px`;
                document.body.setAttribute('data-scroll-position', scrollY);
            } else {
                const savedScrollY = document.body.getAttribute('data-scroll-position') || 0;
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.removeAttribute('data-scroll-position');
                window.scrollTo(0, parseInt(savedScrollY));
            }
        }
    };

    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleMenu();
    });

    // Close mobile menu when clicking on nav links
    navMenu.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-link') || e.target.classList.contains('dropdown-item')) {
            if (navMenu.classList.contains('active')) {
                setTimeout(() => toggleMenu(), 100);
            }
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Close menu on window resize
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            toggleMenu();
        }
    }, 100));

    // Ensure proper desktop behavior and cleanup
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            // Close mobile menu
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            
            // Reset body scroll
            const savedScrollY = document.body.getAttribute('data-scroll-position') || 0;
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.top = '';
            document.body.removeAttribute('data-scroll-position');
            window.scrollTo(0, parseInt(savedScrollY));
            
            // Reset hamburger bars
            const bars = navToggle.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            });
        }
    }, 100));
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

// Optimized navbar background change - Always sticky
const initNavbarScroll = () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // Ensure navbar is always visible and properly styled
    navbar.style.position = 'fixed';
    navbar.style.top = '0';
    navbar.style.left = '0';
    navbar.style.right = '0';
    navbar.style.width = '100%';
    navbar.style.zIndex = '10000';
    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    navbar.style.backdropFilter = 'blur(15px)';
    navbar.style.webkitBackdropFilter = 'blur(15px)';
    navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';

    const updateNavbar = throttle(() => {
        // Always keep navbar visible and styled consistently
        navbar.style.position = 'fixed';
        navbar.style.top = '0';
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.backdropFilter = 'blur(15px)';
        navbar.style.webkitBackdropFilter = 'blur(15px)';
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        navbar.style.zIndex = '10000';
    }, 16);

    window.addEventListener('scroll', updateNavbar, { passive: true });
    window.addEventListener('resize', updateNavbar, { passive: true });
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

// Optimized image lazy loading
const initLazyLoading = () => {
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

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

console.log('🎉 DropTechify website script loaded and optimized!');