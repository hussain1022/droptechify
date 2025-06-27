// Firebase Configuration and Initialization
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, onSnapshot, orderBy, query } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyChFO-OThN7rPIZuAOVNP8aG7R9qEAO-z4",
    authDomain: "droptechify-80034.firebaseapp.com",
    projectId: "droptechify-80034",
    storageBucket: "droptechify-80034.firebasestorage.app",
    messagingSenderId: "41692901589",
    appId: "1:41692901589:web:1e2000fd5bf89f0d7c725c",
    measurementId: "G-1PJMJF5W4L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Global variables
let currentImageIndex = 0;
let projects = [];
let currentFilter = 'all';

// Initialize portfolio page
document.addEventListener('DOMContentLoaded', function() {
    loadProjectsFromFirebase();
    initializeFilters();
});

// Load projects from Firebase with real-time updates
function loadProjectsFromFirebase() {
    try {
        const projectsQuery = query(collection(db, 'projects'), orderBy('dateAdded', 'desc'));
        onSnapshot(projectsQuery, (snapshot) => {
            projects = [];
            snapshot.docs.forEach(doc => {
                const projectData = doc.data();
                projects.push({
                    id: doc.id,
                    title: projectData.title,
                    category: projectData.category,
                    rating: projectData.rating || 5,
                    duration: projectData.duration,
                    description: projectData.description,
                    technologies: Array.isArray(projectData.technologies) ? projectData.technologies : [],
                    image: projectData.image,
                    dateAdded: projectData.dateAdded
                });
            });

            console.log(`✅ Loaded ${projects.length} projects`);
            displayProjects();
        });
    } catch (error) {
        console.error('Error loading projects from Firebase:', error);
        displayEmptyState();
    }
}

// Display projects in the portfolio
function displayProjects() {
    const container = document.getElementById('portfolioGrid');
    if (!container) return;

    container.innerHTML = '';

    // Filter projects based on current filter
    const filteredProjects = currentFilter === 'all' 
        ? projects 
        : projects.filter(project => project.category === currentFilter);

    if (filteredProjects.length === 0) {
        displayEmptyState();
        return;
    }

    filteredProjects.forEach((project, index) => {
        const projectCard = createProjectCard(project, index);
        container.appendChild(projectCard);

        // Add animation delay
        setTimeout(() => {
            projectCard.classList.add('fade-in');
        }, index * 100);
    });
}

// Display empty state
function displayEmptyState() {
    const container = document.getElementById('portfolioGrid');
    if (!container) return;

    const message = currentFilter === 'all' 
        ? 'No projects uploaded yet' 
        : `No ${currentFilter} projects found`;

    container.innerHTML = `
        <div class="empty-content">
            <i class="fas fa-folder-open" style="font-size: 3rem; color: #667eea; margin-bottom: 1rem;"></i>
            <h3 style="color: #666; margin-bottom: 1rem;">${message}</h3>
            <p style="color: #999;">Projects will appear here once added from the admin panel.</p>
        </div>
    `;
}

// Create image carousel for project modal
function createImageCarousel(project) {
    const images = project.images || (project.image ? [project.image] : [getDefaultProjectImage(project.category)]);
    
    if (images.length === 1) {
        return `<img src="${images[0]}" alt="${project.title}" style="width: 100%; height: 400px; object-fit: cover; border-radius: 10px;">`;
    }
    
    return `
        <div class="carousel-container" style="position: relative; width: 100%; height: 400px; border-radius: 10px; overflow: hidden;">
            <div class="carousel-images" id="carousel-images">
                ${images.map((img, index) => `
                    <img src="${img}" 
                         alt="${project.title} - Image ${index + 1}" 
                         style="width: 100%; height: 100%; object-fit: cover; display: ${index === 0 ? 'block' : 'none'};"
                         data-index="${index}">
                `).join('')}
            </div>
            ${images.length > 1 ? `
                <button class="carousel-btn prev-btn" onclick="changeCarouselImage(-1, ${images.length})" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.7); color: white; border: none; padding: 10px 15px; border-radius: 50%; cursor: pointer; font-size: 18px;">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="carousel-btn next-btn" onclick="changeCarouselImage(1, ${images.length})" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.7); color: white; border: none; padding: 10px 15px; border-radius: 50%; cursor: pointer; font-size: 18px;">
                    <i class="fas fa-chevron-right"></i>
                </button>
                <div class="carousel-indicators" style="position: absolute; bottom: 15px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px;">
                    ${images.map((_, index) => `
                        <button onclick="goToCarouselImage(${index}, ${images.length})" 
                                style="width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; background: ${index === 0 ? 'white' : 'transparent'}; cursor: pointer;" 
                                data-indicator="${index}"></button>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
}

// Carousel navigation functions
let currentCarouselIndex = 0;

function changeCarouselImage(direction, totalImages) {
    const images = document.querySelectorAll('#carousel-images img');
    const indicators = document.querySelectorAll('.carousel-indicators button');
    
    // Hide current image
    images[currentCarouselIndex].style.display = 'none';
    indicators[currentCarouselIndex].style.background = 'transparent';
    
    // Calculate new index
    currentCarouselIndex += direction;
    if (currentCarouselIndex >= totalImages) currentCarouselIndex = 0;
    if (currentCarouselIndex < 0) currentCarouselIndex = totalImages - 1;
    
    // Show new image
    images[currentCarouselIndex].style.display = 'block';
    indicators[currentCarouselIndex].style.background = 'white';
}

function goToCarouselImage(index, totalImages) {
    const images = document.querySelectorAll('#carousel-images img');
    const indicators = document.querySelectorAll('.carousel-indicators button');
    
    // Hide current image
    images[currentCarouselIndex].style.display = 'none';
    indicators[currentCarouselIndex].style.background = 'transparent';
    
    // Show selected image
    currentCarouselIndex = index;
    images[currentCarouselIndex].style.display = 'block';
    indicators[currentCarouselIndex].style.background = 'white';
}

// Create project card HTML
function createProjectCard(project, index) {
    const card = document.createElement('div');
    card.className = 'portfolio-project-card';
    card.setAttribute('data-category', project.category);
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', (index * 100).toString());
    card.onclick = () => showProjectDetails(project);

    const ratingStars = '⭐'.repeat(project.rating || 5);
    const techStack = Array.isArray(project.technologies) ? project.technologies : [];

    card.innerHTML = `
        <div class="project-image">
            <img src="${(project.images && project.images[0]) || project.image || getDefaultProjectImage(project.category)}" 
                 alt="${project.title}" 
                 loading="lazy"
                 style="width: 100%; height: 100%; object-fit: cover;">
            <div class="project-overlay">
                <button class="btn btn-primary" onclick="event.stopPropagation(); showProjectDetails(this.closest('.portfolio-project-card').project)">
                    <i class="fas fa-eye"></i> View Details
                </button>
            </div>
            ${project.images && project.images.length > 1 ? `<div class="image-count"><i class="fas fa-images"></i> ${project.images.length}</div>` : ''}
        </div>
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <div class="project-rating">
                <span class="stars">${ratingStars}</span>
                <span class="rating-text">(${project.rating || 5}.0)</span>
            </div>
            <div class="project-category">${project.category}</div>
            <p class="project-description">${project.description || ''}</p>
            <div class="tech-stack">
                ${techStack.slice(0, 4).map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
            </div>
            <div class="project-meta">
                <span class="project-duration"><i class="fas fa-clock"></i> ${project.duration || 'N/A'}</span>
                <span class="project-date">${formatDate(project.dateAdded)}</span>
            </div>
        </div>
    `;

    // Store project data for easy access
    card.project = project;
    return card;
}

// Initialize filter functionality
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Update current filter
            currentFilter = btn.getAttribute('data-filter');

            // Display filtered projects
            displayProjects();
        });
    });
}

// Show project details in modal
function showProjectDetails(project) {
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${project.title}</h2>
                <button class="close-modal" onclick="closeProjectModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="project-image-carousel">
                    ${createImageCarousel(project)}
                </div>
                <div class="project-details">
                    <div class="project-rating">
                        <span class="stars">${'⭐'.repeat(project.rating || 5)}</span>
                        <span class="rating-text">(${project.rating || 5}.0)</span>
                    </div>
                    <p class="project-description">${project.description || ''}</p>
                    <div class="project-info-grid">
                        <div class="info-item">
                            <strong>Category:</strong> ${project.category}
                        </div>
                        <div class="info-item">
                            <strong>Duration:</strong> ${project.duration || 'N/A'}
                        </div>
                        <div class="info-item">
                            <strong>Technologies:</strong>
                            <div class="tech-stack">
                                ${(project.technologies || []).map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                    <div style="text-align: center; margin-top: 2rem;">
                        <a href="https://wa.me/923030273718?text=Hi! I'm interested in a project similar to ${encodeURIComponent(project.title)}" 
                           target="_blank" 
                           style="background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: white; padding: 1rem 2rem; border-radius: 50px; text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; font-weight: 600;">
                            <i class="fab fa-whatsapp"></i> Get Similar Project
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Add modal styles
    if (!document.querySelector('#modal-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'modal-styles';
        styleElement.textContent = `
        .project-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 2rem;
            backdrop-filter: blur(5px);
        }
        .modal-content {
            background: white;
            border-radius: 20px;
            max-width: 900px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            animation: modalSlideIn 0.3s ease;
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2rem 2rem 1rem;
            border-bottom: 1px solid #e2e8f0;
        }
        .close-modal {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
            padding: 0.5rem;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        .close-modal:hover {
            background: #f8f9fa;
            color: #333;
        }
        .modal-body {
            padding: 2rem;
        }
        .project-details {
            margin-top: 2rem;
        }
        .project-info-grid {
            display: grid;
            gap: 1rem;
            margin-top: 2rem;
        }
        .info-item {
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 10px;
        }
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: scale(0.8);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        `;
        document.head.appendChild(styleElement);
    }
}

// Close modal
function closeProjectModal() {
    const modal = document.querySelector('.project-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Format date helper
function formatDate(timestamp) {
    if (!timestamp) return 'Recent';

    try {
        const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
        return date.toLocaleDateString();
    } catch (error) {
        return 'Recent';
    }
}

// Get default project image based on category
function getDefaultProjectImage(category) {
    const defaultImages = {
        'python': "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Crect fill='%233776ab' width='600' height='400'/%3E%3Ctext fill='white' x='50%25' y='50%25' text-anchor='middle' font-family='Arial' font-size='32' font-weight='bold'%3EPython Project%3C/text%3E%3C/svg%3E",
        'web-scraping': "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Crect fill='%232d3748' width='600' height='400'/%3E%3Ctext fill='%2300ff88' x='50%25' y='50%25' text-anchor='middle' font-family='Arial' font-size='32' font-weight='bold'%3EWeb Scraping%3C/text%3E%3C/svg%3E",
        'bot': "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Crect fill='%2325D366' width='600' height='400'/%3E%3Ctext fill='white' x='50%25' y='50%25' text-anchor='middle' font-family='Arial' font-size='32' font-weight='bold'%3EBot Development%3C/text%3E%3C/svg%3E",
        'web-dev': "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Crect fill='%23764ba2' width='600' height='400'/%3E%3Ctext fill='white' x='50%25' y='50%25' text-anchor='middle' font-family='Arial' font-size='32' font-weight='bold'%3EWeb Development%3C/text%3E%3C/svg%3E",
        'automation': "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Crect fill='%23ff6b35' width='600' height='400'/%3E%3Ctext fill='white' x='50%25' y='50%25' text-anchor='middle' font-family='Arial' font-size='32' font-weight='bold'%3EAutomation%3C/text%3E%3C/svg%3E"
    };

    return defaultImages[category] || defaultImages['python'];
}

// Make functions globally available
window.showProjectDetails = showProjectDetails;
window.closeProjectModal = closeProjectModal;
window.changeCarouselImage = changeCarouselImage;
window.goToCarouselImage = goToCarouselImage;

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProjectModal();
    }
});

console.log('📁 Portfolio loaded with Firebase integration!');
