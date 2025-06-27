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
        <div class="project-image">
            <img src="${project.image || getDefaultProjectImage(project.category)}" 
                 alt="${project.title}" 
                 style="width: 100%; height: 200px; object-fit: cover;">
            <div class="project-overlay">
                <button class="btn btn-primary" onclick="event.stopPropagation(); openProjectDetail('${project.id}')">
                    <i class="fas fa-eye"></i> View Details
                </button>
            </div>
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
// DropTechify Portfolio Management System
console.log('📁 Loading DropTechify Portfolio...');

// Firebase configuration (same as admin panel)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, onSnapshot, orderBy, query } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

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

// Load portfolio projects
function loadPortfolioProjects() {
    const projectsQuery = query(collection(db, 'projects'), orderBy('dateAdded', 'desc'));

    onSnapshot(projectsQuery, (snapshot) => {
        const comingSoonSection = document.querySelector('.coming-soon-section');
        const dynamicProjects = document.getElementById('dynamic-projects');
        const projectsGrid = document.getElementById('projects-grid');

        if (snapshot.docs.length > 0) {
            // Hide coming soon and show dynamic projects
            if (comingSoonSection) comingSoonSection.style.display = 'none';
            if (dynamicProjects) dynamicProjects.style.display = 'block';

            // Clear existing projects
            if (projectsGrid) {
                projectsGrid.innerHTML = '';

                // Add each project
                snapshot.docs.forEach(doc => {
                    const project = { id: doc.id, ...doc.data() };
                    const projectCard = createProjectCard(project);
                    projectsGrid.appendChild(projectCard);
                });

                console.log(`✅ Loaded ${snapshot.docs.length} portfolio projects`);
            }
        } else {
            // Show coming soon if no projects
            if (comingSoonSection) comingSoonSection.style.display = 'block';
            if (dynamicProjects) {
                dynamicProjects.style.display = 'block';
                if (projectsGrid) {
                    projectsGrid.innerHTML = `
                        <div class="empty-content">
                            <h3>No Projects Available</h3>
                            <p>Projects will appear here once added from the admin panel.</p>
                        </div>
                    `;
                }
            }
        }
    }, (error) => {
        console.error('❌ Error loading projects:', error);
    });
}

// Create project card element
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-aos', 'fade-up');

    const ratingStars = '⭐'.repeat(project.rating || 5);
    const technologies = Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies || '';

    // Handle image display
    let imageContent = '';
    if (project.image && project.image.startsWith('http')) {
        imageContent = `<img src="${project.image}" alt="${project.title}" loading="lazy">`;
    } else {
        // Default icon based on category
        const categoryIcons = {
            'python': 'fab fa-python',
            'web-scraping': 'fas fa-spider',
            'bot': 'fas fa-robot',
            'web-dev': 'fas fa-code',
            'automation': 'fas fa-cogs'
        };
        const iconClass = categoryIcons[project.category] || 'fas fa-laptop-code';
        imageContent = `<i class="${iconClass}"></i>`;
    }

    card.innerHTML = `
        <div class="project-image">
            <img src="${project.image || getDefaultProjectImage(project.category)}" 
                 alt="${project.title}" 
                 style="width: 100%; height: 200px; object-fit: cover;">
            <div class="project-overlay">
                <button class="btn btn-primary" onclick="event.stopPropagation(); openProjectDetail('${project.id}')">
                    <i class="fas fa-eye"></i> View Details
                </button>
            </div>
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
            </div>
        </div>
    `;

    // Add click handler for modal
    card.addEventListener('click', () => openProjectModal(project));

    return card;
}

// Open project modal with details
function openProjectModal(project) {
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');

    if (!modal || !modalBody) return;

    const ratingStars = '⭐'.repeat(project.rating || 5);
    const technologies = Array.isArray(project.technologies) ? project.technologies : [];
    const techList = technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('');

    // Handle image display
    let imageContent = '';
    if (project.image && project.image.startsWith('http')) {
        imageContent = `<img src="${project.image}" alt="${project.title}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 10px; margin-bottom: 2rem;">`;
    }

    modalBody.innerHTML = `
        <div style="padding: 3rem;">
            ${imageContent}
            <h2 style="color: #2d3748; margin-bottom: 1rem;">${project.title}</h2>
            <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 2rem;">
                <span style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem;">${project.category}</span>
                <span style="color: #ffd700; font-size: 1.2rem;">${ratingStars}</span>
                <span style="color: #718096;">Duration: ${project.duration || 'Custom'}</span>
            </div>
            <div style="color: #718096; line-height: 1.8; margin-bottom: 2rem; font-size: 1.1rem;">
                ${project.description || 'No detailed description available.'}
            </div>
            ${techList ? `
                <div style="margin-bottom: 2rem;">
                    <h4 style="color: #2d3748; margin-bottom: 1rem;">Technologies Used:</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                        ${techList}
                    </div>
                </div>
            ` : ''}
            <div style="text-align: center; margin-top: 2rem;">
                <a href="https://wa.me/923030273718?text=Hi! I'm interested in a project similar to ${encodeURIComponent(project.title)}" 
                   target="_blank" 
                   style="background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: white; padding: 1rem 2rem; border-radius: 50px; text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; font-weight: 600;">
                    <i class="fab fa-whatsapp"></i> Get Similar Project
                </a>
            </div>
        </div>
    `;

    // Add tech tag styles
    const techTags = modalBody.querySelectorAll('.tech-tag');
    techTags.forEach(tag => {
        tag.style.cssText = `
            background: #f8f9fa;
            border: 2px solid #667eea;
            color: #667eea;
            padding: 0.3rem 0.8rem;
            border-radius: 15px;
            font-size: 0.8rem;
            font-weight: 500;
        `;
    });

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close project modal
window.closeProjectModal = function() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProjectModal();
    }
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing portfolio...');
    loadPortfolioProjects();
});

console.log('✅ Portfolio script loaded successfully!');
