
const { Pool } = require('pg');

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database tables
async function initializeDatabase() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS projects (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL,
                duration VARCHAR(100),
                rating INTEGER DEFAULT 5,
                description TEXT,
                technologies TEXT[],
                image TEXT,
                date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(50) DEFAULT 'published'
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS reviews (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                position VARCHAR(255),
                company VARCHAR(255),
                rating INTEGER DEFAULT 5,
                text TEXT NOT NULL,
                date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(50) DEFAULT 'published'
            )
        `);

        console.log('✅ Database tables initialized');
    } catch (error) {
        console.error('❌ Database initialization error:', error);
    }
}

// Project operations
async function getAllProjects() {
    try {
        const result = await pool.query('SELECT * FROM projects ORDER BY date_added DESC');
        return result.rows;
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}

async function addProject(projectData) {
    try {
        const { title, category, duration, rating, description, technologies, image } = projectData;
        const result = await pool.query(
            'INSERT INTO projects (title, category, duration, rating, description, technologies, image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [title, category, duration, rating, description, technologies, image]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error adding project:', error);
        throw error;
    }
}

async function updateProject(id, projectData) {
    try {
        const { title, category, duration, rating, description, technologies, image } = projectData;
        const result = await pool.query(
            'UPDATE projects SET title = $1, category = $2, duration = $3, rating = $4, description = $5, technologies = $6, image = $7 WHERE id = $8 RETURNING *',
            [title, category, duration, rating, description, technologies, image, id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error updating project:', error);
        throw error;
    }
}

async function deleteProject(id) {
    try {
        await pool.query('DELETE FROM projects WHERE id = $1', [id]);
        return true;
    } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
}

// Review operations
async function getAllReviews() {
    try {
        const result = await pool.query('SELECT * FROM reviews ORDER BY date_added DESC');
        return result.rows;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
}

async function addReview(reviewData) {
    try {
        const { name, position, company, rating, text } = reviewData;
        const result = await pool.query(
            'INSERT INTO reviews (name, position, company, rating, text) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, position, company, rating, text]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error adding review:', error);
        throw error;
    }
}

async function updateReview(id, reviewData) {
    try {
        const { name, position, company, rating, text } = reviewData;
        const result = await pool.query(
            'UPDATE reviews SET name = $1, position = $2, company = $3, rating = $4, text = $5 WHERE id = $6 RETURNING *',
            [name, position, company, rating, text, id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error updating review:', error);
        throw error;
    }
}

async function deleteReview(id) {
    try {
        await pool.query('DELETE FROM reviews WHERE id = $1', [id]);
        return true;
    } catch (error) {
        console.error('Error deleting review:', error);
        throw error;
    }
}

module.exports = {
    initializeDatabase,
    getAllProjects,
    addProject,
    updateProject,
    deleteProject,
    getAllReviews,
    addReview,
    updateReview,
    deleteReview
};