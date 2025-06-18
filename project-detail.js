
// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            if (navMenu.classList.contains('active')) {
                if (index === 0) bar.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                if (index === 1) bar.style.opacity = '0';
                if (index === 2) bar.style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            }
        });
    });

    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const bars = navToggle.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            });
        });
    });
}

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }
});

// Portfolio project data (same as portfolio.js)
const portfolioProjects = {
    'email-scraper': {
        title: 'Email Scraper Tool',
        rating: '⭐⭐⭐⭐⭐',
        ratingText: '(5.0)',
        duration: '2 weeks',
        category: 'Python • Web Scraping',
        client: 'Marketing Agency',
        industry: 'Digital Marketing',
        timeline: '2 weeks',
        team: '1 Developer',
        images: [
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Crect fill='%232d3748' width='600' height='400'/%3E%3Ctext fill='%2300ff88' x='50%25' y='30%25' text-anchor='middle' font-family='Arial' font-size='32' font-weight='bold'%3EEmail Scraper%3C/text%3E%3Crect fill='%23434c5e' x='50' y='120' width='500' height='40' rx='5'/%3E%3Ctext fill='%23eceff4' x='60' y='145' font-family='Arial' font-size='14'%3ESource: Website%3C/text%3E%3Crect fill='%2300ff88' x='200' y='300' width='200' height='50' rx='25'/%3E%3Ctext fill='%23000' x='300' y='330' text-anchor='middle' font-family='Arial' font-size='16' font-weight='bold'%3EStart Scraping%3C/text%3E%3C/svg%3E",
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Crect fill='%234a5568' width='600' height='400'/%3E%3Ctext fill='white' x='50%25' y='20%25' text-anchor='middle' font-family='Arial' font-size='24' font-weight='bold'%3EResults Dashboard%3C/text%3E%3Crect fill='%23e2e8f0' x='50' y='100' width='500' height='250' rx='10'/%3E%3Ctext fill='%23000' x='70' y='130' font-family='Arial' font-size='14'%3EEmails Found: 1,247%3C/text%3E%3Ctext fill='%23000' x='70' y='160' font-family='Arial' font-size='14'%3EValid Emails: 1,089%3C/text%3E%3Ctext fill='%23000' x='70' y='190' font-family='Arial' font-size='14'%3ESuccess Rate: 87.3%25%3C/text%3E%3C/svg%3E"
        ],
        overview: `
            <p>A comprehensive email scraping solution that extracts email addresses from multiple sources including LinkedIn profiles, Google search results, and websites. This tool was developed for a marketing agency to automate their lead generation process and significantly improve their outreach efficiency.</p>
            <p>The system features both single search and bulk upload capabilities, making it versatile for different use cases. It includes advanced filtering mechanisms to ensure high-quality email extraction and comprehensive analytics to track performance.</p>
        `,
        features: [
            'Multiple source support (Websites, Google, LinkedIn, Hunter.io)',
            'Single search and bulk upload modes',
            'Personalized email extraction with contact names',
            'CSV/Excel file processing for bulk operations',
            'Admin dashboard with real-time analytics',
            'Secure user authentication system',
            'Email validation and verification',
            'Export results in multiple formats (CSV, Excel, JSON)',
            'Rate limiting to respect website policies',
            'Automated duplicate removal and data cleaning'
        ],
        techStack: [
            { name: 'Python', color: '#3776ab' },
            { name: 'Selenium', color: '#43B02A' },
            { name: 'Flask', color: '#000000' },
            { name: 'BeautifulSoup', color: '#FFB6C1' },
            { name: 'Pandas', color: '#150458' },
            { name: 'SQLite', color: '#003B57' },
            { name: 'Hunter.io API', color: '#FF6B35' },
            { name: 'Google Search API', color: '#4285F4' }
        ],
        results: `
            <p><strong>Increased Lead Generation by 300%:</strong> The client's lead generation process became 3x more efficient, allowing them to process thousands of leads per day instead of hundreds.</p>
            <p><strong>Time Savings:</strong> Reduced manual email collection time from 8 hours per day to 30 minutes of setup time.</p>
            <p><strong>High Accuracy Rate:</strong> Achieved 87% email validity rate with built-in verification systems.</p>
            <p><strong>ROI:</strong> The tool paid for itself within the first month of deployment through increased lead conversion.</p>
        `,
        testimonial: {
            text: "This email scraper has revolutionized our lead generation process. What used to take our team hours now happens automatically with incredible accuracy. The bulk processing feature alone has saved us hundreds of hours. Absolutely fantastic work!",
            author: "Sarah Johnson",
            position: "Marketing Director",
            company: "GrowthLab Marketing"
        }
    },
    'whatsapp-bot': {
        title: 'WhatsApp Automation Bot',
        rating: '⭐⭐⭐⭐⭐',
        ratingText: '(5.0)',
        duration: '3 weeks',
        category: 'Python • Bot • Automation',
        client: 'E-commerce Store',
        industry: 'E-commerce',
        timeline: '3 weeks',
        team: '1 Developer',
        images: [
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Crect fill='%2325D366' width='600' height='400'/%3E%3Ctext fill='white' x='50%25' y='25%25' text-anchor='middle' font-family='Arial' font-size='28' font-weight='bold'%3EWhatsApp Bot%3C/text%3E%3Crect fill='%23128C7E' x='50' y='120' width='500' height='200' rx='20'/%3E%3Ctext fill='white' x='70' y='150' font-family='Arial' font-size='16'%3E🤖 Bot: Hi! How can I help you today?%3C/text%3E%3Ctext fill='white' x='70' y='180' font-family='Arial' font-size='16'%3E👤 User: I need help with my order%3C/text%3E%3Ctext fill='white' x='70' y='210' font-family='Arial' font-size='16'%3E🤖 Bot: I can help you track your order...%3C/text%3E%3Ctext fill='white' x='70' y='240' font-family='Arial' font-size='16'%3E✅ Order Status: Shipped%3C/text%3E%3Ctext fill='white' x='70' y='270' font-family='Arial' font-size='16'%3E📦 Tracking: AB123456789%3C/text%3E%3C/svg%3E"
        ],
        overview: `
            <p>An intelligent WhatsApp automation bot designed for customer support that handles inquiries 24/7. Built for an e-commerce store to manage high volumes of customer queries about orders, products, and support issues.</p>
            <p>The bot integrates with the store's inventory system and order management platform to provide real-time information and automate routine customer service tasks.</p>
        `,
        features: [
            'AI-powered natural language processing',
            'Order tracking and status updates',
            'Product inquiry handling',
            'Automated FAQ responses',
            'Human handoff for complex issues',
            'Multi-language support',
            'Integration with e-commerce platform',
            'Bulk messaging capabilities',
            'Analytics and reporting dashboard',
            'Custom workflow automation'
        ],
        techStack: [
            { name: 'Python', color: '#3776ab' },
            { name: 'Selenium', color: '#43B02A' },
            { name: 'OpenAI API', color: '#412991' },
            { name: 'Flask', color: '#000000' },
            { name: 'MongoDB', color: '#4DB33D' },
            { name: 'WebSocket', color: '#010101' }
        ],
        results: `
            <p><strong>24/7 Customer Support:</strong> Enabled round-the-clock customer service without human intervention for 80% of queries.</p>
            <p><strong>Response Time:</strong> Reduced average response time from 4 hours to under 30 seconds.</p>
            <p><strong>Cost Savings:</strong> Eliminated the need for 2 full-time customer service representatives.</p>
            <p><strong>Customer Satisfaction:</strong> Increased customer satisfaction score by 35% due to instant responses.</p>
        `,
        testimonial: {
            text: "Our WhatsApp bot has transformed our customer service. Customers get instant answers to their questions, and our team can focus on more complex issues. The bot handles 80% of our inquiries automatically - it's incredible!",
            author: "Michael Chen",
            position: "Operations Manager",
            company: "TechStyle Store"
        }
    },
    'inventory-system': {
        title: 'Inventory Management System',
        rating: '⭐⭐⭐⭐⭐',
        ratingText: '(5.0)',
        duration: '4 weeks',
        category: 'Web Development • Python',
        client: 'Retail Chain',
        industry: 'Retail',
        timeline: '4 weeks',
        team: '1 Developer',
        images: [
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Crect fill='%23764ba2' width='600' height='400'/%3E%3Ctext fill='white' x='50%25' y='25%25' text-anchor='middle' font-family='Arial' font-size='24' font-weight='bold'%3EInventory Dashboard%3C/text%3E%3Crect fill='white' x='50' y='100' width='500' height='250' rx='10'/%3E%3Crect fill='%23764ba2' x='70' y='120' width='100' height='20'/%3E%3Ctext fill='white' x='120' y='135' text-anchor='middle' font-size='12'%3ETotal Items: 1,247%3C/text%3E%3Crect fill='%2328a745' x='190' y='120' width='100' height='20'/%3E%3Ctext fill='white' x='240' y='135' text-anchor='middle' font-size='12'%3EIn Stock: 1,089%3C/text%3E%3Crect fill='%23dc3545' x='310' y='120' width='100' height='20'/%3E%3Ctext fill='white' x='360' y='135' text-anchor='middle' font-size='12'%3ELow Stock: 158%3C/text%3E%3C/svg%3E"
        ],
        overview: `
            <p>A comprehensive inventory management web application built for a retail chain to track products across multiple locations. The system provides real-time inventory tracking, automated reorder alerts, and detailed analytics.</p>
            <p>Features include barcode scanning, supplier management, purchase order automation, and comprehensive reporting capabilities.</p>
        `,
        features: [
            'Real-time inventory tracking across multiple locations',
            'Automated low-stock alerts and reorder points',
            'Barcode scanning integration',
            'Supplier management and purchase orders',
            'Sales analytics and reporting',
            'Multi-user access with role-based permissions',
            'Mobile-responsive interface',
            'Data export and backup capabilities',
            'Integration with POS systems',
            'Comprehensive audit trails'
        ],
        techStack: [
            { name: 'Python', color: '#3776ab' },
            { name: 'Django', color: '#092E20' },
            { name: 'PostgreSQL', color: '#336791' },
            { name: 'React', color: '#61DAFB' },
            { name: 'Chart.js', color: '#FF6384' },
            { name: 'Bootstrap', color: '#7952B3' }
        ],
        results: `
            <p><strong>Inventory Accuracy:</strong> Improved inventory accuracy from 85% to 99.2% through real-time tracking.</p>
            <p><strong>Cost Reduction:</strong> Reduced inventory holding costs by 25% through better demand forecasting.</p>
            <p><strong>Time Savings:</strong> Eliminated manual inventory counts, saving 20 hours per week.</p>
            <p><strong>Stockout Prevention:</strong> Reduced stockouts by 90% through automated reorder alerts.</p>
        `,
        testimonial: {
            text: "This inventory system has completely streamlined our operations. We now have complete visibility across all our stores, and the automated alerts ensure we never run out of popular items. The ROI was immediate.",
            author: "David Rodriguez",
            position: "Store Operations Director",
            company: "Urban Retail Group"
        }
    },
    'telegram-bot': {
        title: 'Telegram Trading Bot',
        rating: '⭐⭐⭐⭐⭐',
        ratingText: '(5.0)',
        duration: '5 weeks',
        category: 'Python • Bot • Trading',
        client: 'Crypto Trader',
        industry: 'Cryptocurrency',
        timeline: '5 weeks',
        team: '1 Developer',
        images: [
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Crect fill='%230088cc' width='600' height='400'/%3E%3Ctext fill='white' x='50%25' y='25%25' text-anchor='middle' font-family='Arial' font-size='24' font-weight='bold'%3ETelegram Trading Bot%3C/text%3E%3Crect fill='%23005580' x='50' y='100' width='500' height='200' rx='15'/%3E%3Ctext fill='white' x='70' y='130' font-family='Arial' font-size='14'%3E📊 BTC/USDT Analysis%3C/text%3E%3Ctext fill='%2300ff88' x='70' y='155' font-family='Arial' font-size='14'%3E🟢 BUY Signal Detected%3C/text%3E%3Ctext fill='white' x='70' y='180' font-family='Arial' font-size='14'%3E💰 Entry: $42,150%3C/text%3E%3Ctext fill='white' x='70' y='205' font-family='Arial' font-size='14'%3E🎯 Target: $43,500%3C/text%3E%3Ctext fill='white' x='70' y='230' font-family='Arial' font-size='14'%3E🛡️ Stop Loss: $41,800%3C/text%3E%3Ctext fill='%23ffd700' x='70' y='255' font-family='Arial' font-size='14'%3E⚡ Auto-Execute: ON%3C/text%3E%3C/svg%3E"
        ],
        overview: `
            <p>An advanced cryptocurrency trading bot for Telegram that provides real-time market analysis, automated trading signals, and portfolio management. Built for serious crypto traders who need 24/7 market monitoring.</p>
            <p>The bot uses technical analysis indicators and machine learning algorithms to identify profitable trading opportunities and can execute trades automatically.</p>
        `,
        features: [
            'Real-time cryptocurrency market analysis',
            'Automated trading signal generation',
            'Technical analysis with 15+ indicators',
            'Risk management and stop-loss automation',
            'Portfolio tracking and P&L reporting',
            'Multiple exchange integration',
            'Customizable alert systems',
            'Backtesting capabilities',
            'Multi-timeframe analysis',
            'Secure API key management'
        ],
        techStack: [
            { name: 'Python', color: '#3776ab' },
            { name: 'Telegram Bot API', color: '#0088cc' },
            { name: 'CCXT', color: '#000000' },
            { name: 'Pandas', color: '#150458' },
            { name: 'NumPy', color: '#013243' },
            { name: 'TA-Lib', color: '#FF6B6B' }
        ],
        results: `
            <p><strong>Trading Performance:</strong> Achieved 73% win rate with average 2.3% profit per successful trade.</p>
            <p><strong>24/7 Monitoring:</strong> Never misses market opportunities, monitoring 50+ cryptocurrencies continuously.</p>
            <p><strong>Risk Management:</strong> Automated stop-losses prevented major losses during market crashes.</p>
            <p><strong>Time Efficiency:</strong> Eliminated need for manual chart monitoring, saving 8+ hours daily.</p>
        `,
        testimonial: {
            text: "This trading bot has been a game-changer for my crypto trading. The signals are incredibly accurate, and the automated execution means I never miss opportunities. It's like having a professional trader working 24/7.",
            author: "Alex Thompson",
            position: "Cryptocurrency Trader",
            company: "Independent Trader"
        }
    },
    'analytics-dashboard': {
        title: 'Data Analytics Dashboard',
        rating: '⭐⭐⭐⭐⭐',
        ratingText: '(5.0)',
        duration: '6 weeks',
        category: 'Web Development • Analytics',
        client: 'SaaS Company',
        industry: 'Technology',
        timeline: '6 weeks',
        team: '1 Developer',
        images: [
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Crect fill='%23ff6b35' width='600' height='400'/%3E%3Ctext fill='white' x='50%25' y='20%25' text-anchor='middle' font-family='Arial' font-size='24' font-weight='bold'%3EAnalytics Dashboard%3C/text%3E%3Crect fill='white' x='50' y='80' width='500' height='250' rx='10'/%3E%3Cpath fill='%23ff6b35' d='M80,280 L120,260 L160,240 L200,220 L240,200 L280,180 L320,200 L360,190 L400,170 L440,150 L480,160 L520,140'/%3E%3Crect fill='%23ff6b35' x='80' y='300' width='15' height='20'/%3E%3Crect fill='%23ff6b35' x='120' y='290' width='15' height='30'/%3E%3Crect fill='%23ff6b35' x='160' y='280' width='15' height='40'/%3E%3Crect fill='%23ff6b35' x='200' y='270' width='15' height='50'/%3E%3Crect fill='%23ff6b35' x='240' y='285' width='15' height='35'/%3E%3C/svg%3E"
        ],
        overview: `
            <p>A comprehensive business intelligence dashboard that transforms raw data into actionable insights. Built for a SaaS company to track KPIs, user behavior, and business metrics in real-time.</p>
            <p>The dashboard features interactive visualizations, automated reporting, and predictive analytics to help stakeholders make data-driven decisions.</p>
        `,
        features: [
            'Real-time data visualization with interactive charts',
            'Custom KPI tracking and monitoring',
            'Automated report generation and scheduling',
            'Predictive analytics and forecasting',
            'User behavior analysis and cohort tracking',
            'Multi-source data integration',
            'Role-based access control',
            'Mobile-responsive design',
            'Data export and sharing capabilities',
            'Alert system for threshold breaches'
        ],
        techStack: [
            { name: 'Python', color: '#3776ab' },
            { name: 'Dash/Plotly', color: '#119DFF' },
            { name: 'PostgreSQL', color: '#336791' },
            { name: 'Redis', color: '#DC382D' },
            { name: 'Docker', color: '#2496ED' },
            { name: 'Celery', color: '#37B24D' }
        ],
        results: `
            <p><strong>Decision Speed:</strong> Reduced time to insights from days to minutes with real-time dashboards.</p>
            <p><strong>Data Accuracy:</strong> Eliminated manual reporting errors with automated data pipeline.</p>
            <p><strong>User Adoption:</strong> 95% of stakeholders actively use the dashboard for decision making.</p>
            <p><strong>Business Impact:</strong> Identified optimization opportunities that increased revenue by 18%.</p>
        `,
        testimonial: {
            text: "This analytics dashboard has revolutionized how we make decisions. Having all our KPIs in one place with real-time updates has made us much more agile and data-driven. The predictive analytics feature alone has helped us avoid several potential issues.",
            author: "Jennifer Walsh",
            position: "VP of Operations",
            company: "CloudTech Solutions"
        }
    },
    'ecommerce-scraper': {
        title: 'E-commerce Price Scraper',
        rating: '⭐⭐⭐⭐⭐',
        ratingText: '(5.0)',
        duration: '3 weeks',
        category: 'Python • Web Scraping',
        client: 'Price Comparison Site',
        industry: 'E-commerce',
        timeline: '3 weeks',
        team: '1 Developer',
        images: [
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Crect fill='%236f42c1' width='600' height='400'/%3E%3Ctext fill='white' x='50%25' y='20%25' text-anchor='middle' font-family='Arial' font-size='22' font-weight='bold'%3EPrice Monitoring System%3C/text%3E%3Crect fill='white' x='50' y='80' width='500' height='250' rx='10'/%3E%3Ctext fill='%236f42c1' x='70' y='110' font-family='Arial' font-size='16' font-weight='bold'%3EProduct: iPhone 15 Pro%3C/text%3E%3Ctext fill='%23000' x='70' y='140' font-family='Arial' font-size='14'%3EAmazon: $999.99 ↓ (-$50)%3C/text%3E%3Ctext fill='%23000' x='70' y='165' font-family='Arial' font-size='14'%3EBest Buy: $1,049.99 ↑ (+$20)%3C/text%3E%3Ctext fill='%23000' x='70' y='190' font-family='Arial' font-size='14'%3EWalmart: $1,029.99 — (No change)%3C/text%3E%3Crect fill='%2328a745' x='70' y='210' width='100' height='25' rx='5'/%3E%3Ctext fill='white' x='120' y='227' text-anchor='middle' font-size='12'%3EBest Price Alert%3C/text%3E%3C/svg%3E"
        ],
        overview: `
            <p>A comprehensive price monitoring system that tracks product prices across multiple e-commerce platforms. Built for a price comparison website to provide real-time pricing data and alerts to consumers.</p>
            <p>The system monitors thousands of products simultaneously and provides historical pricing data, trends, and automated alerts when prices drop below specified thresholds.</p>
        `,
        features: [
            'Multi-platform price monitoring (Amazon, eBay, Walmart, etc.)',
            'Real-time price tracking and updates',
            'Historical price data and trend analysis',
            'Automated price drop alerts',
            'Product availability monitoring',
            'Competitor price analysis',
            'API for third-party integrations',
            'Bulk product management',
            'Custom alert thresholds',
            'Price prediction algorithms'
        ],
        techStack: [
            { name: 'Python', color: '#3776ab' },
            { name: 'Scrapy', color: '#60A839' },
            { name: 'Selenium', color: '#43B02A' },
            { name: 'MongoDB', color: '#4DB33D' },
            { name: 'Celery', color: '#37B24D' },
            { name: 'Redis', color: '#DC382D' }
        ],
        results: `
            <p><strong>Product Coverage:</strong> Successfully monitors 50,000+ products across 15 major e-commerce platforms.</p>
            <p><strong>Data Accuracy:</strong> Achieved 99.5% accuracy in price tracking with built-in validation systems.</p>
            <p><strong>User Engagement:</strong> Price alerts increased user engagement by 45% and return visits by 60%.</p>
            <p><strong>Revenue Impact:</strong> Helped users save an average of $127 per purchase through price optimization.</p>
        `,
        testimonial: {
            text: "The price scraper has been fundamental to our business success. The accuracy and speed of data collection is exceptional, and our users love the automated alerts. It's helped us become the go-to price comparison platform in our niche.",
            author: "Ryan Martinez",
            position: "CTO",
            company: "PriceWise Comparison"
        }
    }
};

// Get project keys for navigation
const projectKeys = Object.keys(portfolioProjects);

// Load project details on page load
document.addEventListener('DOMContentLoaded', () => {
    const currentProjectId = localStorage.getItem('currentProject') || 'email-scraper';
    loadProjectDetails(currentProjectId);
});

// Function to load project details
function loadProjectDetails(projectId) {
    const project = portfolioProjects[projectId];
    
    if (!project) {
        console.error('Project not found:', projectId);
        return;
    }

    // Update page title and meta info
    document.title = `${project.title} - Droptechify Portfolio`;
    document.getElementById('project-title').textContent = `${project.title} - Droptechify`;
    
    // Update breadcrumb
    document.getElementById('breadcrumb-title').textContent = project.title;
    
    // Update header content
    document.getElementById('detail-project-title').textContent = project.title;
    document.getElementById('detail-project-rating').textContent = project.rating;
    document.getElementById('detail-rating-text').textContent = project.ratingText;
    document.getElementById('detail-project-duration').innerHTML = `<i class="fas fa-clock"></i> ${project.duration}`;
    document.getElementById('detail-project-category').textContent = project.category;
    
    // Update sidebar details  
    document.getElementById('detail-client').textContent = project.client;
    document.getElementById('detail-industry').textContent = project.industry;
    document.getElementById('detail-timeline').textContent = project.timeline;
    document.getElementById('detail-team').textContent = project.team;
    
    // Update main image
    const mainImage = document.getElementById('main-project-image');
    mainImage.src = project.images[0];
    mainImage.alt = project.title;
    
    // Update gallery thumbnails
    const thumbnailsContainer = document.getElementById('image-thumbnails');
    thumbnailsContainer.innerHTML = '';
    
    project.images.forEach((image, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = image;
        thumbnail.alt = `${project.title} - Image ${index + 1}`;
        thumbnail.className = 'thumbnail';
        if (index === 0) thumbnail.classList.add('active');
        
        thumbnail.addEventListener('click', () => {
            mainImage.src = image;
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumbnail.classList.add('active');
        });
        
        thumbnailsContainer.appendChild(thumbnail);
    });
    
    // Update project content
    document.getElementById('project-overview').innerHTML = project.overview;
    
    // Update features list
    const featuresList = document.getElementById('project-features');
    featuresList.innerHTML = '';
    project.features.forEach(feature => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-check"></i> ${feature}`;
        featuresList.appendChild(li);
    });
    
    // Update tech stack
    const techStackContainer = document.getElementById('tech-stack-detail');
    techStackContainer.innerHTML = '';
    project.techStack.forEach(tech => {
        const badge = document.createElement('span');
        badge.className = 'tech-badge-large';
        badge.style.backgroundColor = tech.color;
        badge.textContent = tech.name;
        techStackContainer.appendChild(badge);
    });
    
    // Update sidebar tech list
    const sidebarTechList = document.getElementById('sidebar-tech-list');
    sidebarTechList.innerHTML = '';
    project.techStack.forEach(tech => {
        const item = document.createElement('div');
        item.className = 'tech-item';
        item.innerHTML = `
            <span class="tech-dot" style="background-color: ${tech.color}"></span>
            <span class="tech-name">${tech.name}</span>
        `;
        sidebarTechList.appendChild(item);
    });
    
    // Update results
    document.getElementById('project-results').innerHTML = project.results;
    
    // Update testimonial
    if (project.testimonial) {
        const testimonialContainer = document.getElementById('client-testimonial');
        testimonialContainer.innerHTML = `
            <div class="testimonial-content">
                <div class="testimonial-quote">
                    <i class="fas fa-quote-left"></i>
                    <p>${project.testimonial.text}</p>
                    <i class="fas fa-quote-right"></i>
                </div>
                <div class="testimonial-author">
                    <strong>${project.testimonial.author}</strong>
                    <span>${project.testimonial.position}</span>
                    <span class="company">${project.testimonial.company}</span>
                </div>
            </div>
        `;
        document.getElementById('client-feedback-section').style.display = 'block';
    } else {
        document.getElementById('client-feedback-section').style.display = 'none';
    }
    
    // Update navigation
    updateProjectNavigation(projectId);
    
    // Store current project
    localStorage.setItem('currentProject', projectId);
}

// Function to update project navigation
function updateProjectNavigation(currentProjectId) {
    const currentIndex = projectKeys.indexOf(currentProjectId);
    const prevProject = projectKeys[currentIndex - 1];
    const nextProject = projectKeys[currentIndex + 1];
    
    const prevBtn = document.getElementById('prev-project');
    const nextBtn = document.getElementById('next-project');
    const prevTitle = document.getElementById('prev-project-title');
    const nextTitle = document.getElementById('next-project-title');
    
    if (prevProject) {
        prevBtn.style.display = 'flex';
        prevTitle.textContent = portfolioProjects[prevProject].title;
        prevBtn.setAttribute('data-project', prevProject);
    } else {
        prevBtn.style.display = 'none';
    }
    
    if (nextProject) {
        nextBtn.style.display = 'flex';
        nextTitle.textContent = portfolioProjects[nextProject].title;
        nextBtn.setAttribute('data-project', nextProject);
    } else {
        nextBtn.style.display = 'none';
    }
}

// Function to navigate between projects
function navigateProject(direction) {
    const currentProjectId = localStorage.getItem('currentProject');
    const currentIndex = projectKeys.indexOf(currentProjectId);
    
    let newIndex;
    if (direction === 'prev') {
        newIndex = currentIndex - 1;
    } else {
        newIndex = currentIndex + 1;
    }
    
    if (newIndex >= 0 && newIndex < projectKeys.length) {
        const newProjectId = projectKeys[newIndex];
        loadProjectDetails(newProjectId);
        
        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Gallery functionality
function openGallery(imageIndex) {
    // This could be expanded to show a full-screen gallery
    console.log('Opening gallery at index:', imageIndex);
}

console.log('📄 Project detail page loaded successfully!');
