
// Firebase Configuration and Initialization
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, onSnapshot, orderBy, query, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

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

// Global variables for edit mode
let editingProjectId = null;
let editingReviewId = null;

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Admin dashboard loading...');
    
    // Check if user is logged in
    if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
        console.log('❌ Not logged in, redirecting...');
        window.location.href = 'admin-login.html';
        return;
    }

    console.log('✅ User authenticated, initializing dashboard...');
    
    // Initialize dashboard immediately
    initializeDashboard();
    
    // Initialize Firebase connection
    initializeFirebaseSync();
    
    // Ensure dashboard section is shown by default
    setTimeout(() => {
        showDashboardSection();
        updateStats();
    }, 500);
});

// Function to show dashboard section by default
function showDashboardSection() {
    const dashboardMenuItem = document.querySelector('[data-section="dashboard"]');
    const dashboardSection = document.getElementById('dashboard-section');
    
    if (dashboardMenuItem && dashboardSection) {
        // Remove active from all menu items
        document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
        
        // Set dashboard as active
        dashboardMenuItem.classList.add('active');
        dashboardSection.classList.add('active');
        
        // Update page title
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) {
            pageTitle.textContent = 'Dashboard Overview';
        }
    }
}

// Initialize dashboard functionality
function initializeDashboard() {
    console.log('🚀 Initializing dashboard functionality...');
    
    // Menu navigation
    const menuItems = document.querySelectorAll('.menu-item');
    const contentSections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('page-title');

    console.log('📋 Found menu items:', menuItems.length);
    console.log('📄 Found content sections:', contentSections.length);

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🖱️ Menu item clicked:', item.getAttribute('data-section'));
            
            // Remove active class from all menu items
            menuItems.forEach(mi => mi.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');
            
            // Hide all content sections
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Show target section
            const targetSection = item.getAttribute('data-section');
            const sectionElement = document.getElementById(targetSection + '-section');
            if (sectionElement) {
                sectionElement.classList.add('active');
                console.log('✅ Section activated:', targetSection);
                
                // Load data when switching to sections
                if (targetSection === 'projects') {
                    loadProjectsData();
                } else if (targetSection === 'reviews') {
                    loadReviewsData();
                }
            } else {
                console.error('❌ Section not found:', targetSection + '-section');
            }
            
            // Update page title
            const titles = {
                'dashboard': 'Dashboard Overview',
                'projects': 'Manage Projects',
                'reviews': 'Manage Reviews',
                'settings': 'Site Settings'
            };
            if (pageTitle) {
                pageTitle.textContent = titles[targetSection];
            }
        });
    });

    // Form submissions
    setupFormHandlers();
    
    // Load data from Firebase with real-time updates
    loadDataWithRealTime();
    
    console.log('✅ Dashboard initialized successfully!');
}

// Setup form handlers
function setupFormHandlers() {
    console.log('📝 Setting up form handlers...');
    
    // Project form
    const projectForm = document.getElementById('project-form');
    if (projectForm) {
        projectForm.addEventListener('submit', handleProjectSubmit);
        console.log('✅ Project form handler added');
    } else {
        console.warn('⚠️ Project form not found');
    }
    
    // Review form
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', handleReviewSubmit);
        console.log('✅ Review form handler added');
    } else {
        console.warn('⚠️ Review form not found');
    }
}

// Handle project form submission
async function handleProjectSubmit(e) {
    e.preventDefault();
    console.log('📤 Submitting project form...');
    
    const formData = new FormData(e.target);
    const projectData = {
        title: formData.get('title'),
        category: formData.get('category'),
        duration: formData.get('duration'),
        rating: parseInt(formData.get('rating')),
        description: formData.get('description'),
        technologies: formData.get('technologies').split(',').map(tech => tech.trim()),
        image: formData.get('image') || getDefaultProjectImage(formData.get('category')),
        dateAdded: new Date(),
        status: 'published'
    };

    console.log('📋 Project data:', projectData);

    try {
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        submitBtn.disabled = true;

        if (editingProjectId) {
            // Update existing project
            const projectRef = doc(db, 'projects', editingProjectId);
            await updateDoc(projectRef, projectData);
            showToast('✅ Project updated successfully! Check live website.', 'success');
            editingProjectId = null;
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Add Project';
            console.log('✅ Project updated in Firebase');
        } else {
            // Add new project
            const docRef = await addDoc(collection(db, 'projects'), projectData);
            showToast('✅ Project added successfully! Live on website now.', 'success');
            console.log('✅ Project added to Firebase with ID:', docRef.id);
        }

        // Clear form and restore button
        e.target.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Force refresh data
        setTimeout(() => {
            loadProjectsData();
            updateStats();
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error saving project:', error);
        showToast('❌ Error saving project. Please check connection and try again.', 'error');
        
        // Restore button
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Add Project';
        submitBtn.disabled = false;
    }
}

// Handle review form submission
async function handleReviewSubmit(e) {
    e.preventDefault();
    console.log('📤 Submitting review form...');
    
    const formData = new FormData(e.target);
    const reviewData = {
        name: formData.get('name'),
        position: formData.get('position'),
        company: formData.get('company'),
        rating: parseInt(formData.get('rating')),
        text: formData.get('text'),
        dateAdded: new Date(),
        status: 'published'
    };

    console.log('📋 Review data:', reviewData);

    try {
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        submitBtn.disabled = true;

        if (editingReviewId) {
            // Update existing review
            const reviewRef = doc(db, 'reviews', editingReviewId);
            await updateDoc(reviewRef, reviewData);
            showToast('✅ Review updated successfully! Check live website.', 'success');
            editingReviewId = null;
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Add Review';
            console.log('✅ Review updated in Firebase');
        } else {
            // Add new review
            const docRef = await addDoc(collection(db, 'reviews'), reviewData);
            showToast('✅ Review added successfully! Live on website now.', 'success');
            console.log('✅ Review added to Firebase with ID:', docRef.id);
        }

        // Clear form and restore button
        e.target.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Force refresh data
        setTimeout(() => {
            loadReviewsData();
            updateStats();
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error saving review:', error);
        showToast('❌ Error saving review. Please check connection and try again.', 'error');
        
        // Restore button
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Add Review';
        submitBtn.disabled = false;
    }
}

// Load data with real-time updates
function loadDataWithRealTime() {
    console.log('🔄 Setting up real-time data listeners...');
    
    // Real-time projects listener
    const projectsQuery = query(collection(db, 'projects'), orderBy('dateAdded', 'desc'));
    onSnapshot(projectsQuery, (snapshot) => {
        console.log('📊 Projects updated, count:', snapshot.docs.length);
        const tableBody = document.getElementById('projects-table-body');
        if (tableBody) {
            tableBody.innerHTML = '';
            
            snapshot.docs.forEach(doc => {
                const project = { id: doc.id, ...doc.data() };
                addProjectToTable(project);
            });
        }
        
        updateStats();
    }, (error) => {
        console.error('❌ Error loading projects:', error);
    });

    // Real-time reviews listener
    const reviewsQuery = query(collection(db, 'reviews'), orderBy('dateAdded', 'desc'));
    onSnapshot(reviewsQuery, (snapshot) => {
        console.log('📊 Reviews updated, count:', snapshot.docs.length);
        const tableBody = document.getElementById('reviews-table-body');
        if (tableBody) {
            tableBody.innerHTML = '';
            
            snapshot.docs.forEach(doc => {
                const review = { id: doc.id, ...doc.data() };
                addReviewToTable(review);
            });
        }
        
        updateStats();
    }, (error) => {
        console.error('❌ Error loading reviews:', error);
    });
}

// Load projects data
function loadProjectsData() {
    console.log('📊 Loading projects data...');
    // Data is already loaded via real-time listener
}

// Load reviews data
function loadReviewsData() {
    console.log('📊 Loading reviews data...');
    // Data is already loaded via real-time listener
}

// Add project to table
function addProjectToTable(project) {
    const tableBody = document.getElementById('projects-table-body');
    if (!tableBody) return;
    
    const row = document.createElement('tr');
    
    const ratingStars = '⭐'.repeat(parseInt(project.rating || 5));
    
    row.innerHTML = `
        <td>${project.title || 'Untitled'}</td>
        <td>${project.category || 'N/A'}</td>
        <td>${ratingStars}</td>
        <td>${project.duration || 'N/A'}</td>
        <td class="action-buttons">
            <button class="btn btn-sm btn-secondary" onclick="editProject('${project.id}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteProject('${project.id}')">Delete</button>
        </td>
    `;
    
    tableBody.appendChild(row);
}

// Add review to table
function addReviewToTable(review) {
    const tableBody = document.getElementById('reviews-table-body');
    if (!tableBody) return;
    
    const row = document.createElement('tr');
    
    const ratingStars = '⭐'.repeat(parseInt(review.rating || 5));
    const dateAdded = review.dateAdded ? new Date(review.dateAdded.seconds * 1000).toLocaleDateString() : 'N/A';
    
    row.innerHTML = `
        <td>${review.name || 'Anonymous'}</td>
        <td>${review.company || 'N/A'}</td>
        <td>${ratingStars}</td>
        <td>${dateAdded}</td>
        <td class="action-buttons">
            <button class="btn btn-sm btn-secondary" onclick="editReview('${review.id}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteReview('${review.id}')">Delete</button>
        </td>
    `;
    
    tableBody.appendChild(row);
}

// Edit project
async function editProject(projectId) {
    console.log('✏️ Editing project:', projectId);
    try {
        const projectRef = doc(db, 'projects', projectId);
        const projectSnap = await getDoc(projectRef);
        
        if (projectSnap.exists()) {
            const project = projectSnap.data();
            
            // Fill form with project data
            document.getElementById('project-title').value = project.title || '';
            document.getElementById('project-category').value = project.category || '';
            document.getElementById('project-duration').value = project.duration || '';
            document.getElementById('project-rating').value = project.rating || 5;
            document.getElementById('project-description').value = project.description || '';
            document.getElementById('project-tech').value = Array.isArray(project.technologies) ? project.technologies.join(', ') : '';
            document.getElementById('project-image').value = project.image || '';
            
            // Set edit mode
            editingProjectId = projectId;
            document.querySelector('#project-form button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Update Project';
            
            // Switch to projects section and scroll to form
            document.querySelector('[data-section="projects"]').click();
            setTimeout(() => {
                document.getElementById('project-form').scrollIntoView({ behavior: 'smooth' });
            }, 300);
            
            console.log('✅ Project loaded for editing');
        }
    } catch (error) {
        console.error('❌ Error loading project for edit:', error);
        showToast('Error loading project data', 'error');
    }
}

// Edit review
async function editReview(reviewId) {
    console.log('✏️ Editing review:', reviewId);
    try {
        const reviewRef = doc(db, 'reviews', reviewId);
        const reviewSnap = await getDoc(reviewRef);
        
        if (reviewSnap.exists()) {
            const review = reviewSnap.data();
            
            // Fill form with review data
            document.getElementById('reviewer-name').value = review.name || '';
            document.getElementById('reviewer-rating').value = review.rating || 5;
            document.getElementById('reviewer-position').value = review.position || '';
            document.getElementById('reviewer-company').value = review.company || '';
            document.getElementById('review-text').value = review.text || '';
            
            // Set edit mode
            editingReviewId = reviewId;
            document.querySelector('#review-form button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Update Review';
            
            // Switch to reviews section and scroll to form
            document.querySelector('[data-section="reviews"]').click();
            setTimeout(() => {
                document.getElementById('review-form').scrollIntoView({ behavior: 'smooth' });
            }, 300);
            
            console.log('✅ Review loaded for editing');
        }
    } catch (error) {
        console.error('❌ Error loading review for edit:', error);
        showToast('Error loading review data', 'error');
    }
}

// Delete project
async function deleteProject(projectId) {
    console.log('🗑️ Deleting project:', projectId);
    if (confirm('Are you sure you want to delete this project?')) {
        try {
            await deleteDoc(doc(db, 'projects', projectId));
            showToast('Project deleted successfully!', 'success');
            console.log('✅ Project deleted');
        } catch (error) {
            console.error('❌ Error deleting project:', error);
            showToast('Error deleting project', 'error');
        }
    }
}

// Delete review
async function deleteReview(reviewId) {
    console.log('🗑️ Deleting review:', reviewId);
    if (confirm('Are you sure you want to delete this review?')) {
        try {
            await deleteDoc(doc(db, 'reviews', reviewId));
            showToast('Review deleted successfully!', 'success');
            console.log('✅ Review deleted');
        } catch (error) {
            console.error('❌ Error deleting review:', error);
            showToast('Error deleting review', 'error');
        }
    }
}

// Update statistics
async function updateStats() {
    try {
        const projectsSnapshot = await getDocs(collection(db, 'projects'));
        const reviewsSnapshot = await getDocs(collection(db, 'reviews'));
        
        const totalProjectsEl = document.getElementById('total-projects');
        const totalReviewsEl = document.getElementById('total-reviews');
        
        if (totalProjectsEl) totalProjectsEl.textContent = projectsSnapshot.size;
        if (totalReviewsEl) totalReviewsEl.textContent = reviewsSnapshot.size;
        
        console.log('📈 Stats updated - Projects:', projectsSnapshot.size, 'Reviews:', reviewsSnapshot.size);
    } catch (error) {
        console.error('❌ Error updating stats:', error);
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

// Show toast message
function showToast(message, type = 'success') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideInRight 0.3s ease;
    `;
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Logout function
function logout() {
    console.log('🚪 Logging out...');
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminEmail');
        window.location.href = 'admin-login.html';
    }
}

// Initialize Firebase sync
function initializeFirebaseSync() {
    console.log('🔄 Initializing Firebase sync...');
    
    // Test Firebase connection
    testFirebaseConnection();
    
    // Load initial data
    loadDataWithRealTime();
    
    console.log('✅ Firebase sync initialized successfully!');
}

// Test Firebase connection
async function testFirebaseConnection() {
    try {
        console.log('🧪 Testing Firebase connection...');
        const testQuery = query(collection(db, 'projects'), orderBy('dateAdded', 'desc'));
        const snapshot = await getDocs(testQuery);
        console.log('✅ Firebase connection successful. Projects count:', snapshot.size);
        
        const reviewsQuery = query(collection(db, 'reviews'), orderBy('dateAdded', 'desc'));
        const reviewsSnapshot = await getDocs(reviewsQuery);
        console.log('✅ Firebase connection successful. Reviews count:', reviewsSnapshot.size);
        
        return true;
    } catch (error) {
        console.error('❌ Firebase connection failed:', error);
        showToast('Firebase connection failed. Please check your connection.', 'error');
        return false;
    }
}

// Section switching function
function switchSection(event, sectionName) {
    event.preventDefault();
    console.log('🔄 Switching to section:', sectionName);
    
    // Remove active class from all menu items and sections
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
    
    // Add active class to clicked item
    event.target.closest('.menu-item').classList.add('active');
    
    // Show target section
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
        console.log('✅ Section activated:', sectionName);
        
        // Load data when switching to sections
        if (sectionName === 'projects') {
            loadProjectsData();
        } else if (sectionName === 'reviews') {
            loadReviewsData();
        } else if (sectionName === 'dashboard') {
            updateStats();
        }
    }
    
    // Update page title
    const titles = {
        'dashboard': 'Dashboard Overview',
        'projects': 'Manage Projects',
        'reviews': 'Manage Reviews',
        'settings': 'Site Settings'
    };
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        pageTitle.textContent = titles[sectionName];
    }
}

// Make functions globally available
window.editProject = editProject;
window.editReview = editReview;
window.deleteProject = deleteProject;
window.deleteReview = deleteReview;
window.logout = logout;
window.switchSection = switchSection;

// Add toast animation styles
const toastStyle = document.createElement('style');
toastStyle.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(toastStyle);

console.log('🔐 Admin dashboard script loaded successfully!');
