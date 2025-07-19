// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }));

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Close menu on window resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Enhanced scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe all animated elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .bounce-in, .hero-content, .hero-image, .section-header, .product-card, .product-showcase, .service-card, .feature, .stat-card, .about-main-content, .stats-container, .founder-card, .mission-card, .vision-card, .value-card, .service-detailed-card, .contact-hero-content, .contact-cards-grid, .form-container, .info-card, .portfolio-item');
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});

// Add active class to current page navigation
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// Portfolio functionality
function initPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.dataset.filter;
            portfolioItems.forEach((item, index) => {
                item.style.display = 'block';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0) scale(1)';
            });
        });
    });
}

// Initialize portfolio filters if on portfolio page
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.portfolio-filters')) {
        initPortfolioFilters();
    }
});

// Enhanced contact form submission
function handleContactFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('#submitBtn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual email service)
    setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.style.background = '#10B981';
        
        // Reset form
        form.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 3000);
    }, 2000);
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
    }
});

// Smooth page transitions
document.addEventListener('DOMContentLoaded', () => {
    // Add page load animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
function initPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.dataset.filter;

            // Show all items since we only have "All Projects" filter
            portfolioItems.forEach((item, index) => {
                item.style.display = 'block';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0) scale(1)';
            });
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize portfolio filters if on portfolio page
    if (document.querySelector('.portfolio-filters')) {
        initPortfolioFilters();
    }
});

// Add active class to current page navigation
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// Enhanced contact form submission with email functionality
function handleContactFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const submitBtn = document.getElementById('submitBtn');
    const formData = new FormData(form);

    // Change button state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Simple form validation
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#e53e3e';
            field.style.boxShadow = '0 0 0 3px rgba(229, 62, 62, 0.1)';
            isValid = false;

            // Remove error styling after user starts typing
            field.addEventListener('input', function() {
                this.style.borderColor = '#e2e8f0';
                this.style.boxShadow = 'none';
            });
        } else {
            field.style.borderColor = '#38a169';
            field.style.boxShadow = '0 0 0 3px rgba(56, 161, 105, 0.1)';
        }
    });

    // Send email using EmailJS
    if (isValid) {
        const templateParams = {
            from_name: formData.get('name'),
            from_email: formData.get('email'),
            phone: formData.get('phone') || 'Not provided',
            company: formData.get('company') || 'Not provided',
            service: formData.get('service'),
            budget: formData.get('budget') || 'Not specified',
            timeline: formData.get('timeline') || 'Not specified',
            message: formData.get('message'),
            to_email: 'Droptechify@gmail.com'
        };

        // Send email notification
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
            .then(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.background = '#38a169';

                // Also send WhatsApp message
                const whatsappMessage = `New Contact Form Submission:

Name: ${templateParams.from_name}
Email: ${templateParams.from_email}
Phone: ${templateParams.phone}
Company: ${templateParams.company}
Service: ${templateParams.service}
Budget: ${templateParams.budget}
Timeline: ${templateParams.timeline}

Message: ${templateParams.message}`;

                const whatsappUrl = `https://wa.me/923030273718?text=${encodeURIComponent(whatsappMessage)}`;

                setTimeout(() => {
                    window.open(whatsappUrl, '_blank');
                    form.reset();

                    // Reset button
                    setTimeout(() => {
                        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Project Details';
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;
                    }, 2000);
                }, 1000);
            })
            .catch(() => {
                // Fallback to WhatsApp only if email fails
                const whatsappMessage = `New Contact Form Submission:

Name: ${templateParams.from_name}
Email: ${templateParams.from_email}
Phone: ${templateParams.phone}
Company: ${templateParams.company}
Service: ${templateParams.service}
Budget: ${templateParams.budget}
Timeline: ${templateParams.timeline}

Message: ${templateParams.message}`;

                const whatsappUrl = `https://wa.me/923030273718?text=${encodeURIComponent(whatsappMessage)}`;

                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.background = '#38a169';

                setTimeout(() => {
                    window.open(whatsappUrl, '_blank');
                    form.reset();

                    // Reset button
                    setTimeout(() => {
                        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Project Details';
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;
                    }, 2000);
                }, 1000);
            });
    } else {
        submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Please fix errors';
        submitBtn.style.background = '#e53e3e';

        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Project Details';
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);
    }
}

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = '#fff';
        navbar.style.backdropFilter = 'none';
    }
});

// Animate floating demo button
document.addEventListener('DOMContentLoaded', () => {
    const floatingBtn = document.querySelector('.floating-demo-btn a');
    if (floatingBtn) {
        setInterval(() => {
            floatingBtn.style.transform = 'scale(1.1)';
            setTimeout(() => {
                floatingBtn.style.transform = 'scale(1)';
            }, 200);
        }, 3000);
    }
});
