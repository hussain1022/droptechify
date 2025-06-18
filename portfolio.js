
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

// Initialize portfolio page
document.addEventListener('DOMContentLoaded', function() {
    loadProjectsFromFirebase();
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
                    image: projectData.image
                });
            });
            
            displayProjects();
        });
    } catch (error) {
        console.error('Error loading projects from Firebase:', error);
        projects = [];
        displayProjects();
    }
}

// Display projects in the portfolio
function displayProjects() {
    const container = document.getElementById('portfolioGrid');
    if (!container) return;

    container.innerHTML = '';

    if (projects.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem;">
                <h3 style="color: #666; margin-bottom: 1rem;">No Projects Available</h3>
                <p style="color: #999;">Projects will appear here once added from the admin panel.</p>
            </div>
        `;
        return;
    }

    projects.forEach((project, index) => {
        const projectCard = createProjectCard(project, index);
        container.appendChild(projectCard);
    });
}

// Create project card HTML
function createProjectCard(project, index) {
    const card = document.createElement('div');
    card.className = 'portfolio-project-card';
    card.setAttribute('data-category', project.category);
    card.setAttribute('data-aos', 'fade-up');
    card.onclick = () => showProjectDetails(project);

    const ratingStars = '⭐'.repeat(project.rating || 5);
    const techStack = Array.isArray(project.technologies) ? project.technologies : [];

    card.innerHTML = `
        <div class="project-gallery">
            <div class="project-image-main">
                <img src="${project.image || getDefaultProjectImage(project.category)}" 
                     alt="${project.title}" 
                     class="main-project-img"
                     style="width: 100%; height: 100%; object-fit: cover;">
                <div class="image-navigation">
                    <button class="nav-arrow prev-arrow" onclick="event.stopPropagation();">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="nav-arrow next-arrow" onclick="event.stopPropagation();">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
            <div class="project-overlay">
                <button class="btn btn-primary" onclick="event.stopPropagation(); showProjectDetails(this.closest('.portfolio-project-card'))">
                    <i class="fas fa-eye"></i> View Details
                </button>
            </div>
        </div>
        <div class="project-content">
            <h3>${project.title}</h3>
            <div class="project-rating">
                <span class="stars">${ratingStars}</span>
                <span class="rating-text">(${project.rating || 5}.0)</span>
            </div>
            <p>${project.description || ''}</p>
            
            <div class="tech-stack">
                ${techStack.slice(0, 4).map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
            </div>
            
            <div class="project-meta">
                <span class="project-duration"><i class="fas fa-clock"></i> ${project.duration || 'N/A'}</span>
                <span class="project-category">${project.category}</span>
            </div>
        </div>
    `;

    return card;
}

// Show project details
function showProjectDetails(project) {
    // Create modal overlay
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
                <div class="project-image-large">
                    <img src="${project.image || getDefaultProjectImage(project.category)}" 
                         alt="${project.title}"
                         style="width: 100%; height: 400px; object-fit: cover; border-radius: 10px;">
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
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Add modal styles
    const modalStyles = `
        <style>
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
        }
        .modal-content {
            background: white;
            border-radius: 15px;
            max-width: 800px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2rem 2rem 1rem;
            border-bottom: 1px solid #eee;
        }
        .close-modal {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
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
            border-radius: 8px;
        }
        </style>
    `;

    if (!document.querySelector('#modal-styles')) {
        const styleElement = document.createElement('div');
        styleElement.id = 'modal-styles';
        styleElement.innerHTML = modalStyles;
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

console.log('📁 Portfolio loaded with Firebase integration!');
