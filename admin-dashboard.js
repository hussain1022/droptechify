// Firebase Configuration and Initialization
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc, 
    doc, 
    onSnapshot, 
    orderBy, 
    query,
    getDoc 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

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

// Global variables
let editingProjectId = null;
let editingReviewId = null;

console.log('🔥 Admin Dashboard Starting...');

// Check authentication when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 DOM Content Loaded');

    // Check if user is logged in
    if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
        console.log('❌ User not authenticated');
        window.location.href = 'admin-login.html';
        return;
    }

    console.log('✅ User authenticated');

    // Initialize dashboard
    initializeDashboard();
});

// Initialize dashboard
function initializeDashboard() {
    console.log('🚀 Initializing dashboard...');

    // Test Firebase connection
    testFirebaseConnection();

    // Setup form handlers
    setupFormHandlers();

    // Load initial data
    loadProjectsData();
    loadReviewsData();
    updateStats();

    console.log('✅ Dashboard initialized successfully');
}

// Test Firebase connection
async function testFirebaseConnection() {
    try {
        console.log('🧪 Testing Firebase connection...');
        const testQuery = query(collection(db, 'projects'));
        const snapshot = await getDocs(testQuery);
        console.log('✅ Firebase connected! Projects found:', snapshot.size);
        showMessage('Firebase connected successfully!', 'success');
    } catch (error) {
        console.error('❌ Firebase connection failed:', error);
        showMessage('Firebase connection failed: ' + error.message, 'error');
    }
}

// Setup form handlers
function setupFormHandlers() {
    console.log('📝 Setting up form handlers...');

    // Project form
    const projectForm = document.getElementById('project-form');
    if (projectForm) {
        projectForm.addEventListener('submit', handleProjectSubmit);
        console.log('✅ Project form handler set');
    }

    // Review form
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', handleReviewSubmit);
        console.log('✅ Review form handler set');
    }
}

// Handle project form submission
async function handleProjectSubmit(e) {
    e.preventDefault();
    console.log('📤 Submitting project...');

    const formData = new FormData(e.target);
    // Process multiple images
    const imagesText = document.getElementById('project-images').value;
    const imageUrls = imagesText ? imagesText.split('\n').filter(url => url.trim()) : [];
    
    const projectData = {
        title: formData.get('title') || document.getElementById('project-title').value,
        category: formData.get('category') || document.getElementById('project-category').value,
        duration: formData.get('duration') || document.getElementById('project-duration').value,
        rating: parseInt(formData.get('rating') || document.getElementById('project-rating').value),
        description: formData.get('description') || document.getElementById('project-description').value,
        technologies: (formData.get('technologies') || document.getElementById('project-tech').value).split(',').map(tech => tech.trim()),
        images: imageUrls.length > 0 ? imageUrls : [getDefaultProjectImage(document.getElementById('project-category').value)],
        image: imageUrls.length > 0 ? imageUrls[0] : getDefaultProjectImage(document.getElementById('project-category').value), // Keep for backward compatibility
        dateAdded: new Date(),
        status: 'published'
    };

    console.log('📋 Project data:', projectData);

    try {
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        submitBtn.disabled = true;

        if (editingProjectId) {
            // Update existing project
            const projectRef = doc(db, 'projects', editingProjectId);
            await updateDoc(projectRef, projectData);
            showMessage('Project updated successfully!', 'success');
            editingProjectId = null;
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Add Project';
        } else {
            // Add new project
            const docRef = await addDoc(collection(db, 'projects'), projectData);
            showMessage('Project added successfully!', 'success');
            console.log('✅ Project added with ID:', docRef.id);
        }

        // Reset form
        e.target.reset();
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Add Project';
        submitBtn.disabled = true;

        // Reload data
        loadProjectsData();
        updateStats();

    } catch (error) {
        console.error('❌ Error saving project:', error);
        showMessage('Error saving project: ' + error.message, 'error');

        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Add Project';
        submitBtn.disabled = false;
    }
}

// Handle review form submission
async function handleReviewSubmit(e) {
    e.preventDefault();
    console.log('📤 Submitting review...');

    const formData = new FormData(e.target);
    const reviewData = {
        name: formData.get('name') || document.getElementById('reviewer-name').value,
        position: formData.get('position') || document.getElementById('reviewer-position').value,
        company: formData.get('company') || document.getElementById('reviewer-company').value,
        rating: parseInt(formData.get('rating') || document.getElementById('reviewer-rating').value),
        text: formData.get('text') || document.getElementById('review-text').value,
        image: '',
        dateAdded: new Date(),
        status: 'published'
    };

    console.log('📋 Review data:', reviewData);

    try {
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        submitBtn.disabled = true;

        if (editingReviewId) {
            // Update existing review
            const reviewRef = doc(db, 'reviews', editingReviewId);
            await updateDoc(reviewRef, reviewData);
            showMessage('Review updated successfully!', 'success');
            editingReviewId = null;
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Add Review';
        } else {
            // Add new review
            const docRef = await addDoc(collection(db, 'reviews'), reviewData);
            showMessage('Review added successfully!', 'success');
            console.log('✅ Review added with ID:', docRef.id);
        }

        // Reset form
        e.target.reset();
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Add Review';
        submitBtn.disabled = true;

        // Reload data
        loadReviewsData();
        updateStats();

    } catch (error) {
        console.error('❌ Error saving review:', error);
        showMessage('Error saving review: ' + error.message, 'error');

        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Add Review';
        submitBtn.disabled = false;
    }
}

// Load projects data
async function loadProjectsData() {
    console.log('📊 Loading projects...');
    try {
        const projectsQuery = query(collection(db, 'projects'), orderBy('dateAdded', 'desc'));
        const snapshot = await getDocs(projectsQuery);

        const tableBody = document.getElementById('projects-table');
        if (tableBody) {
            tableBody.innerHTML = '';

            if (snapshot.empty) {
                tableBody.innerHTML = '<tr><td colspan="5">No projects found</td></tr>';
            } else {
                snapshot.forEach((doc) => {
                    const project = { id: doc.id, ...doc.data() };
                    addProjectToTable(project);
                });
            }
        }

        console.log('✅ Projects loaded:', snapshot.size);
    } catch (error) {
        console.error('❌ Error loading projects:', error);
        showMessage('Error loading projects: ' + error.message, 'error');
    }
}

// Load reviews data
async function loadReviewsData() {
    console.log('📊 Loading reviews...');
    try {
        const reviewsQuery = query(collection(db, 'reviews'), orderBy('dateAdded', 'desc'));
        const snapshot = await getDocs(reviewsQuery);

        const tableBody = document.getElementById('reviews-table');
        if (tableBody) {
            tableBody.innerHTML = '';

            if (snapshot.empty) {
                tableBody.innerHTML = '<tr><td colspan="5">No reviews found</td></tr>';
            } else {
                snapshot.forEach((doc) => {
                    const review = { id: doc.id, ...doc.data() };
                    addReviewToTable(review);
                });
            }
        }

        console.log('✅ Reviews loaded:', snapshot.size);
    } catch (error) {
        console.error('❌ Error loading reviews:', error);
        showMessage('Error loading reviews: ' + error.message, 'error');
    }
}

// Add project to table
function addProjectToTable(project) {
    const tableBody = document.getElementById('projects-table');
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
    const tableBody = document.getElementById('reviews-table');
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
            
            // Handle multiple images
            const projectImages = project.images || (project.image ? [project.image] : []);
            document.getElementById('project-images').value = projectImages.join('\n');
            
            // Show image previews
            if (projectImages.length > 0) {
                displayImagePreviews(projectImages);
            }

            // Set edit mode
            editingProjectId = projectId;
            document.querySelector('#project-form button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Update Project';

            // Switch to projects section
            showSection('projects');
            document.getElementById('project-form').scrollIntoView({ behavior: 'smooth' });

            showMessage('Project loaded for editing', 'success');
        }
    } catch (error) {
        console.error('❌ Error loading project for edit:', error);
        showMessage('Error loading project: ' + error.message, 'error');
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

            // Switch to reviews section
            showSection('reviews');
            document.getElementById('review-form').scrollIntoView({ behavior: 'smooth' });

            showMessage('Review loaded for editing', 'success');
        }
    } catch (error) {
        console.error('❌ Error loading review for edit:', error);
        showMessage('Error loading review: ' + error.message, 'error');
    }
}

// Delete project
async function deleteProject(projectId) {
    console.log('🗑️ Deleting project:', projectId);
    if (confirm('Are you sure you want to delete this project?')) {
        try {
            await deleteDoc(doc(db, 'projects', projectId));
            showMessage('Project deleted successfully!', 'success');
            loadProjectsData();
            updateStats();
        } catch (error) {
            console.error('❌ Error deleting project:', error);
            showMessage('Error deleting project: ' + error.message, 'error');
        }
    }
}

// Delete review
async function deleteReview(reviewId) {
    console.log('🗑️ Deleting review:', reviewId);
    if (confirm('Are you sure you want to delete this review?')) {
        try {
            await deleteDoc(doc(db, 'reviews', reviewId));
            showMessage('Review deleted successfully!', 'success');
            loadReviewsData();
            updateStats();
        } catch (error) {
            console.error('❌ Error deleting review:', error);
            showMessage('Error deleting review: ' + error.message, 'error');
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

// Show section
function showSection(sectionName) {
    console.log('📄 Showing section:', sectionName);

    // Remove active class from all menu items and sections
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));

    // Add active class to clicked menu item
    const menuItem = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
    if (menuItem) menuItem.classList.add('active');

    // Show target section
    const section = document.getElementById(sectionName);
    if (section) section.classList.add('active');

    // Update page title
    const titles = {
        'dashboard': 'Dashboard Overview',
        'projects': 'Manage Projects', 
        'reviews': 'Manage Reviews',
        'settings': 'Site Settings'
    };

    const pageTitle = document.getElementById('page-title');
    if (pageTitle) pageTitle.textContent = titles[sectionName] || 'Admin Panel';

    // Load data for specific sections
    if (sectionName === 'projects') {
        loadProjectsData();
    } else if (sectionName === 'reviews') {
        loadReviewsData();
    }
}

// Save settings
function saveSettings() {
    showMessage('Settings saved successfully!', 'success');
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminEmail');
        showMessage('Logging out...', 'success');
        setTimeout(() => {
            window.location.href = 'admin-login.html';
        }, 1000);
    }
}

// Show message
function showMessage(message, type = 'success') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.status-message');
    existingMessages.forEach(msg => msg.remove());

    const messageDiv = document.createElement('div');
    messageDiv.className = `status-message ${type}`;
    messageDiv.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check' : 'fa-exclamation-triangle'}"></i> ${message}`;

    document.body.appendChild(messageDiv);

    // Show message
    setTimeout(() => messageDiv.classList.add('show'), 100);

    // Hide message after 4 seconds
    setTimeout(() => {
        messageDiv.classList.remove('show');
        setTimeout(() => messageDiv.remove(), 300);
    }, 4000);
}

// Get default project image
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

// Multiple image upload handling for projects
function handleMultipleImageUpload(input) {
    const files = Array.from(input.files);
    
    if (files.length === 0) return;
    
    console.log(`📸 Processing ${files.length} images...`);
    
    // Show loading state
    const preview = document.getElementById('images-preview');
    const container = document.getElementById('preview-container');
    container.innerHTML = '<div style="padding: 20px; text-align: center;">Processing images...</div>';
    preview.style.display = 'block';
    
    const imageUrls = [];
    let processedCount = 0;
    
    files.forEach((file, index) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            console.warn(`❌ File ${file.name} is not an image`);
            processedCount++;
            if (processedCount === files.length) {
                finishImageProcessing(imageUrls);
            }
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            console.warn(`❌ File ${file.name} is too large (max 5MB)`);
            showMessage(`Image ${file.name} is too large. Max size is 5MB.`, 'error');
            processedCount++;
            if (processedCount === files.length) {
                finishImageProcessing(imageUrls);
            }
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            imageUrls[index] = e.target.result;
            processedCount++;
            
            console.log(`✅ Processed image ${processedCount}/${files.length}`);
            
            // When all files are processed
            if (processedCount === files.length) {
                finishImageProcessing(imageUrls);
            }
        };
        
        reader.onerror = function() {
            console.error(`❌ Error reading file ${file.name}`);
            processedCount++;
            if (processedCount === files.length) {
                finishImageProcessing(imageUrls);
            }
        };
        
        reader.readAsDataURL(file);
    });
}

// Finish image processing
function finishImageProcessing(imageUrls) {
    // Filter out empty/null URLs
    const validImages = imageUrls.filter(url => url && url.trim());
    
    if (validImages.length === 0) {
        showMessage('No valid images were processed.', 'error');
        document.getElementById('images-preview').style.display = 'none';
        return;
    }
    
    // Get existing images from textarea
    const existingImages = document.getElementById('project-images').value;
    const existingUrls = existingImages ? existingImages.split('\n').filter(url => url.trim()) : [];
    
    // Combine existing and new images
    const allImages = [...existingUrls, ...validImages];
    
    // Update textarea
    document.getElementById('project-images').value = allImages.join('\n');
    
    // Display previews
    displayImagePreviews(allImages);
    
    showMessage(`✅ ${validImages.length} images uploaded successfully!`, 'success');
    console.log(`📸 Total images: ${allImages.length}`);
}

// Display image previews
function displayImagePreviews(imageUrls) {
    const preview = document.getElementById('images-preview');
    const container = document.getElementById('preview-container');
    
    container.innerHTML = '';
    
    const validUrls = imageUrls.filter(url => url && url.trim());
    
    if (validUrls.length === 0) {
        preview.style.display = 'none';
        return;
    }
    
    validUrls.forEach((url, index) => {
        const imageWrapper = document.createElement('div');
        imageWrapper.style.cssText = 'position: relative; display: inline-block; margin: 5px;';
        
        const img = document.createElement('img');
        img.src = url.trim();
        img.style.cssText = 'width: 120px; height: 90px; object-fit: cover; border-radius: 8px; border: 2px solid #ddd; transition: transform 0.2s ease;';
        
        // Add hover effect
        img.onmouseover = () => img.style.transform = 'scale(1.05)';
        img.onmouseout = () => img.style.transform = 'scale(1)';
        
        // Handle image load errors
        img.onerror = () => {
            img.style.border = '2px solid #dc3545';
            img.alt = 'Failed to load image';
        };
        
        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '×';
        removeBtn.style.cssText = 'position: absolute; top: -8px; right: -8px; background: #dc3545; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; font-size: 14px; cursor: pointer; line-height: 1; box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: background 0.2s ease;';
        removeBtn.title = 'Remove image';
        removeBtn.onclick = () => removeImage(index);
        removeBtn.onmouseover = () => removeBtn.style.background = '#a71d2a';
        removeBtn.onmouseout = () => removeBtn.style.background = '#dc3545';
        
        // Image index indicator
        const indexIndicator = document.createElement('div');
        indexIndicator.innerHTML = index + 1;
        indexIndicator.style.cssText = 'position: absolute; bottom: 5px; left: 5px; background: rgba(0,0,0,0.7); color: white; border-radius: 12px; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold;';
        
        imageWrapper.appendChild(img);
        imageWrapper.appendChild(removeBtn);
        imageWrapper.appendChild(indexIndicator);
        container.appendChild(imageWrapper);
    });
    
    // Add image count indicator
    const countIndicator = document.createElement('div');
    countIndicator.innerHTML = `📸 ${validUrls.length} image(s) selected`;
    countIndicator.style.cssText = 'margin-top: 10px; padding: 5px 10px; background: #28a745; color: white; border-radius: 15px; font-size: 12px; display: inline-block;';
    container.appendChild(countIndicator);
    
    preview.style.display = 'block';
}

// Remove specific image
function removeImage(index) {
    const imagesText = document.getElementById('project-images').value;
    const imageUrls = imagesText.split('\n').filter(url => url.trim());
    imageUrls.splice(index, 1);
    
    document.getElementById('project-images').value = imageUrls.join('\n');
    displayImagePreviews(imageUrls);
}

// Clear all images
function clearAllImages() {
    document.getElementById('project-images').value = '';
    document.getElementById('images-preview').style.display = 'none';
    document.getElementById('project-images-file').value = '';
}



// Make functions globally available
window.showSection = showSection;
window.editProject = editProject;
window.editReview = editReview;
window.deleteProject = deleteProject;
window.deleteReview = deleteReview;
window.logout = logout;
window.saveSettings = saveSettings;
window.handleMultipleImageUpload = handleMultipleImageUpload;
window.clearAllImages = clearAllImages;
window.removeImage = removeImage;


console.log('✅ Admin Dashboard loaded successfully!');
