
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');
const zlib = require('zlib');
const db = require('./database');

const port = process.env.PORT || 5000;

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Initialize database on server start
db.initializeDatabase();

const server = http.createServer(async (req, res) => {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // API Routes
    if (pathname.startsWith('/api/')) {
        try {
            if (pathname === '/api/projects' && req.method === 'GET') {
                const projects = await db.getAllProjects();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(projects));
                return;
            }

            if (pathname === '/api/projects' && req.method === 'POST') {
                let body = '';
                req.on('data', chunk => body += chunk);
                req.on('end', async () => {
                    try {
                        const projectData = JSON.parse(body);
                        const newProject = await db.addProject(projectData);
                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(newProject));
                    } catch (error) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: error.message }));
                    }
                });
                return;
            }

            if (pathname.startsWith('/api/projects/') && req.method === 'PUT') {
                const projectId = pathname.split('/')[3];
                let body = '';
                req.on('data', chunk => body += chunk);
                req.on('end', async () => {
                    try {
                        const projectData = JSON.parse(body);
                        const updatedProject = await db.updateProject(projectId, projectData);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(updatedProject));
                    } catch (error) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: error.message }));
                    }
                });
                return;
            }

            if (pathname.startsWith('/api/projects/') && req.method === 'DELETE') {
                const projectId = pathname.split('/')[3];
                try {
                    await db.deleteProject(projectId);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } catch (error) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: error.message }));
                }
                return;
            }

            if (pathname === '/api/reviews' && req.method === 'GET') {
                const reviews = await db.getAllReviews();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(reviews));
                return;
            }

            if (pathname === '/api/reviews' && req.method === 'POST') {
                let body = '';
                req.on('data', chunk => body += chunk);
                req.on('end', async () => {
                    try {
                        const reviewData = JSON.parse(body);
                        const newReview = await db.addReview(reviewData);
                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(newReview));
                    } catch (error) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: error.message }));
                    }
                });
                return;
            }

            if (pathname.startsWith('/api/reviews/') && req.method === 'PUT') {
                const reviewId = pathname.split('/')[3];
                let body = '';
                req.on('data', chunk => body += chunk);
                req.on('end', async () => {
                    try {
                        const reviewData = JSON.parse(body);
                        const updatedReview = await db.updateReview(reviewId, reviewData);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(updatedReview));
                    } catch (error) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: error.message }));
                    }
                });
                return;
            }

            if (pathname.startsWith('/api/reviews/') && req.method === 'DELETE') {
                const reviewId = pathname.split('/')[3];
                try {
                    await db.deleteReview(reviewId);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } catch (error) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: error.message }));
                }
                return;
            }

        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error' }));
        }
        return;
    }

    // Static file serving
    let filePath = pathname === '/' ? '/index.html' : pathname;
    filePath = filePath.split('?')[0];

    const fullPath = path.join(__dirname, filePath);
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'text/plain';

    fs.readFile(fullPath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File not found</h1>');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('<h1>500 - Server error</h1>');
            }
        } else {
            // Add compression and caching headers for performance
            const headers = {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
                'Accept-Encoding': 'gzip, deflate'
            };

            // Compress text-based files
            if (contentType.includes('text') || contentType.includes('javascript') || contentType.includes('json')) {
                const acceptEncoding = req.headers['accept-encoding'] || '';

                if (acceptEncoding.includes('gzip')) {
                    headers['Content-Encoding'] = 'gzip';
                    res.writeHead(200, headers);
                    zlib.gzip(content, (err, compressed) => {
                        if (err) {
                            res.end(content);
                        } else {
                            res.end(compressed);
                        }
                    });
                } else {
                    res.writeHead(200, headers);
                    res.end(content);
                }
            } else {
                res.writeHead(200, headers);
                res.end(content);
            }
        }
    });
});

server.listen(port, '0.0.0.0', () => {
    console.log(`✅ Server running at http://0.0.0.0:${port}/`);
    console.log(`🌐 Your Droptechify website is ready!`);
});
