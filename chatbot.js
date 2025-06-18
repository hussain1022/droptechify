
// DropTechify Professional Chatbot
class DropTechifyChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;
        this.init();
    }

    init() {
        this.createChatWidget();
        this.addEventListeners();
        setTimeout(() => {
            this.showWelcomeMessage();
        }, 2000);
    }

    createChatWidget() {
        const chatWidget = document.createElement('div');
        chatWidget.innerHTML = `
            <!-- Chat Button -->
            <div id="chat-button" class="chat-button">
                <i class="fas fa-comments"></i>
                <div class="chat-notification" id="chat-notification">1</div>
            </div>

            <!-- Chat Window -->
            <div id="chat-window" class="chat-window">
                <div class="chat-header">
                    <div class="chat-header-info">
                        <div class="agent-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="agent-details">
                            <h4>DropTechify Assistant</h4>
                            <span class="status">🟢 Online - Ready to Help!</span>
                        </div>
                    </div>
                    <button id="chat-close" class="chat-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div id="chat-messages" class="chat-messages">
                    <!-- Messages will be added here dynamically -->
                </div>

                <div class="chat-input-container">
                    <div id="typing-indicator" class="typing-indicator" style="display: none;">
                        <div class="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <span>Assistant is typing...</span>
                    </div>
                    <div class="chat-input-wrapper">
                        <input type="text" id="chat-input" placeholder="Ask me anything about DropTechify..." maxlength="500">
                        <button id="chat-send" class="chat-send-btn">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add styles
        const styles = `
            <style>
                .chat-button {
                    position: fixed;
                    bottom: 25px;
                    right: 25px;
                    width: 65px;
                    height: 65px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
                    z-index: 9998;
                    transition: all 0.3s ease;
                    animation: pulse 2s infinite;
                }

                .chat-button:hover {
                    transform: scale(1.1);
                    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.6);
                }

                .chat-button i {
                    color: white;
                    font-size: 26px;
                }

                .chat-notification {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #ff4757;
                    color: white;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: 600;
                    animation: bounce 1s infinite;
                    border: 2px solid white;
                }

                @keyframes pulse {
                    0% { box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4); }
                    50% { box-shadow: 0 8px 40px rgba(102, 126, 234, 0.7); }
                    100% { box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4); }
                }

                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-5px); }
                    60% { transform: translateY(-3px); }
                }

                .chat-window {
                    position: fixed;
                    bottom: 25px;
                    right: 25px;
                    width: 380px;
                    height: 550px;
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
                    z-index: 9999;
                    display: none;
                    flex-direction: column;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                    border: 1px solid #e0e0e0;
                    overflow: hidden;
                }

                .chat-window.open {
                    display: flex;
                    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .chat-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .chat-header-info {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .agent-avatar {
                    width: 45px;
                    height: 45px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                }

                .agent-details h4 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                }

                .status {
                    font-size: 12px;
                    opacity: 0.9;
                    margin-top: 2px;
                }

                .chat-close {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 8px;
                    transition: background 0.2s;
                }

                .chat-close:hover {
                    background: rgba(255, 255, 255, 0.1);
                }

                .chat-close i {
                    font-size: 18px;
                }

                .chat-messages {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    max-height: 380px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .chat-messages::-webkit-scrollbar {
                    width: 6px;
                }

                .chat-messages::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 3px;
                }

                .chat-messages::-webkit-scrollbar-thumb {
                    background: #667eea;
                    border-radius: 3px;
                }

                .message {
                    display: flex;
                    margin-bottom: 15px;
                    animation: fadeIn 0.4s ease-in;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .message.bot {
                    justify-content: flex-start;
                }

                .message.user {
                    justify-content: flex-end;
                }

                .message-content {
                    max-width: 85%;
                    padding: 15px 18px;
                    border-radius: 20px;
                    font-size: 14px;
                    line-height: 1.5;
                    word-wrap: break-word;
                }

                .message.bot .message-content {
                    background: #f8f9fa;
                    color: #333;
                    border-bottom-left-radius: 6px;
                }

                .message.user .message-content {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-bottom-right-radius: 6px;
                }

                .quick-replies {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-top: 15px;
                }

                .quick-reply {
                    background: white;
                    border: 2px solid #667eea;
                    color: #667eea;
                    padding: 10px 18px;
                    border-radius: 25px;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-weight: 500;
                }

                .quick-reply:hover {
                    background: #667eea;
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                }

                .chat-input-container {
                    border-top: 1px solid #e0e0e0;
                    padding: 20px;
                }

                .typing-indicator {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 15px;
                    font-size: 13px;
                    color: #666;
                }

                .typing-dots {
                    display: flex;
                    gap: 4px;
                }

                .typing-dots span {
                    width: 8px;
                    height: 8px;
                    background: #667eea;
                    border-radius: 50%;
                    animation: typing 1.4s infinite ease-in-out;
                }

                .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
                .typing-dots span:nth-child(2) { animation-delay: -0.16s; }

                @keyframes typing {
                    0%, 80%, 100% {
                        transform: scale(0.8);
                        opacity: 0.5;
                    }
                    40% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                .chat-input-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                #chat-input {
                    flex: 1;
                    padding: 15px 20px;
                    border: 2px solid #e0e0e0;
                    border-radius: 30px;
                    font-size: 14px;
                    outline: none;
                    transition: border-color 0.3s;
                    font-family: inherit;
                }

                #chat-input:focus {
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }

                .chat-send-btn {
                    width: 45px;
                    height: 45px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    border-radius: 50%;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.2s;
                }

                .chat-send-btn:hover {
                    transform: scale(1.05);
                }

                .chat-send-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                .contact-links {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-top: 15px;
                }

                .contact-link {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    background: #f8f9fa;
                    border-radius: 12px;
                    color: #333;
                    text-decoration: none;
                    font-size: 14px;
                    transition: all 0.3s;
                    border: 1px solid #e9ecef;
                }

                .contact-link:hover {
                    background: #667eea;
                    color: white;
                    transform: translateX(5px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
                }

                .contact-link i {
                    width: 18px;
                    text-align: center;
                    font-size: 16px;
                }

                @media (max-width: 480px) {
                    .chat-window {
                        width: calc(100vw - 20px);
                        height: calc(100vh - 120px);
                        bottom: 10px;
                        right: 10px;
                        left: 10px;
                        border-radius: 15px;
                    }

                    .chat-button {
                        bottom: 20px;
                        right: 20px;
                        width: 60px;
                        height: 60px;
                    }

                    .chat-button i {
                        font-size: 24px;
                    }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
        document.body.appendChild(chatWidget);
    }

    addEventListeners() {
        const chatButton = document.getElementById('chat-button');
        const chatWindow = document.getElementById('chat-window');
        const chatClose = document.getElementById('chat-close');
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');

        chatButton.addEventListener('click', () => this.toggleChat());
        chatClose.addEventListener('click', () => this.closeChat());
        chatSend.addEventListener('click', () => this.sendMessage());
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Handle quick replies
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-reply')) {
                this.handleQuickReply(e.target.textContent);
            }
        });
    }

    toggleChat() {
        const chatWindow = document.getElementById('chat-window');
        const chatNotification = document.getElementById('chat-notification');
        
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
            chatNotification.style.display = 'none';
        }
    }

    openChat() {
        const chatWindow = document.getElementById('chat-window');
        chatWindow.classList.add('open');
        this.isOpen = true;
        
        // Focus input
        setTimeout(() => {
            document.getElementById('chat-input').focus();
        }, 400);
    }

    closeChat() {
        const chatWindow = document.getElementById('chat-window');
        chatWindow.classList.remove('open');
        this.isOpen = false;
    }

    showWelcomeMessage() {
        this.addBotMessage(`Hi there! I'm here to help you with any questions about DropTechify.

🔥 **LIMITED TIME: 30% OFF for First 10 Projects!**

We build custom software, websites, mobile apps, automation tools, and more!

**Owner**: Abdul Kabeer (Founder)
**Company**: DropTechify

How can I help you today?`, [
                'Our Services',
                'Discount Offer',
                'How to Claim',
                'Get Quote',
                'Contact Us'
            ]);
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;

        this.addUserMessage(message);
        input.value = '';
        
        // Show typing indicator
        this.showTyping();
        
        // Process message and respond
        setTimeout(() => {
            this.hideTyping();
            this.processMessage(message);
        }, 1000 + Math.random() * 1000);
    }

    addUserMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user';
        messageDiv.innerHTML = `<div class="message-content">${this.escapeHtml(message)}</div>`;
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addBotMessage(message, quickReplies = []) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot';
        
        let quickRepliesHtml = '';
        if (quickReplies.length > 0) {
            quickRepliesHtml = `
                <div class="quick-replies">
                    ${quickReplies.map(reply => `<button class="quick-reply">${reply}</button>`).join('')}
                </div>
            `;
        }
        
        messageDiv.innerHTML = `
            <div class="message-content">${this.formatMessage(message)}</div>
            ${quickRepliesHtml}
        `;
        
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addContactMessage() {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot';
        
        messageDiv.innerHTML = `
            <div class="message-content">
                📞 **Best ways to reach Abdul Kabeer (Owner):**
                <div class="contact-links">
                    <a href="mailto:droptechify@gmail.com" class="contact-link">
                        <i class="fas fa-envelope"></i>
                        droptechify@gmail.com
                    </a>
                    <a href="https://wa.me/923030273718?text=Hi%20Abdul%20Kabeer!%20I%27m%20interested%20in%20DropTechify%20services." target="_blank" class="contact-link">
                        <i class="fab fa-whatsapp"></i>
                        +92 303 027 3718
                    </a>
                    <a href="https://www.linkedin.com/in/abdul-kabeer-mughal-003902246" target="_blank" class="contact-link">
                        <i class="fab fa-linkedin"></i>
                        Abdul Kabeer - LinkedIn
                    </a>
                </div>
                
                🛠️ **Need a custom project?** Let's talk — we'll reply ASAP!
                
                ⭐ **We accept international clients worldwide!**
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    processMessage(message) {
        const lowerMessage = message.toLowerCase();
        let response = '';
        let quickReplies = [];

        // Services related
        if (lowerMessage.includes('service') || lowerMessage.includes('what do you do') || lowerMessage.includes('help')) {
            response = `**DropTechify Services:**

• **Web Scraping & Automation** - Smart bots that extract and organize data
• **Web Development** - Custom websites using Python, Django, Flask
• **Mobile Apps** - Android/iOS applications
• **AI & Chatbot Integration** - Intelligent automation solutions
• **Custom Software** - Desktop/web applications tailored to your needs

Which service interests you most?`;
            quickReplies = ['Web Scraping', 'Web Development', 'Mobile Apps', 'Custom Project'];
        }
        
        // Experience related
        else if (lowerMessage.includes('experience') || lowerMessage.includes('how long') || lowerMessage.includes('years')) {
            response = `**Our Experience:**

We have 5-6 years of experience delivering high-quality digital solutions to clients worldwide.

Our team has successfully completed numerous projects across various industries, ensuring reliable and efficient solutions for every client.`;
            quickReplies = ['Our Services', 'Delivery Time', 'Contact Us'];
        }
        
        // Delivery time related
        else if (lowerMessage.includes('delivery') || lowerMessage.includes('time') || lowerMessage.includes('how fast') || lowerMessage.includes('timeline')) {
            response = `**Delivery Time:**

We aim to deliver as fast as possible depending on your project scope. Please share your requirements with the owner for an accurate timeline.

Typical delivery times:
• Simple scripts: 1-3 days
• Web applications: 1-3 weeks
• Complex projects: 2-6 weeks

Contact us to discuss your specific project timeline.`;
            quickReplies = ['Contact Us', 'Our Services', 'Pricing Info'];
        }
        
        // Discount/Offer related
        else if (lowerMessage.includes('discount') || lowerMessage.includes('offer') || lowerMessage.includes('30%') || lowerMessage.includes('30 percent')) {
            response = `🔥 **Yes! Limited-Time 30% OFF Offer!**

We are currently offering a 30% discount for all new clients on their first 10 projects. This offer is valid for the next 15 days only — don't miss it!

This is an exclusive opportunity to get premium quality work at a reduced price.`;
            quickReplies = ['How to Claim', 'What Will I Get', 'Contact Owner'];
        }
        
        // Pricing related
        else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('quote') || lowerMessage.includes('budget') || lowerMessage.includes('charge') || lowerMessage.includes('package')) {
            response = `**Custom Pricing & Quotes:**

We don't list fixed prices publicly. Every project is custom — we'll give you the best quote based on your goals and budget.

Plus, with our current 30% discount offer, you'll get even better value! Just contact the owner directly for your personalized quote.`;
            quickReplies = ['Claim Discount', 'Contact Owner', 'Our Services'];
        }
        
        // What will I get from discount
        else if (lowerMessage.includes('what will i get') || lowerMessage.includes('what do i get') || lowerMessage.includes('discount benefit')) {
            response = `**30% Discount Benefits:**

You'll receive premium quality work, handled by our expert team, with a 30% discount on your first 10 projects. This means:

• More value at a lower price
• Same high-quality standards
• Professional service from Abdul Kabeer's team
• Significant savings on multiple projects

This offer is only available for the next 15 days!`;
            quickReplies = ['How to Claim', 'Contact Owner', 'Our Services'];
        }
        
        // How to claim offer
        else if (lowerMessage.includes('how to claim') || lowerMessage.includes('claim offer') || lowerMessage.includes('get discount')) {
            response = `**How to Claim Your 30% Discount:**

Just contact us within the next 15 days and mention you saw our discount offer. We'll apply the discount automatically to your first 10 projects.

Steps:
1. Contact via WhatsApp or Email
2. Mention "30% discount offer"
3. Share your project requirements
4. Get your discounted quote instantly!`;
            quickReplies = ['Contact Now', 'WhatsApp Owner', 'Email Owner'];
        }
        
        // What kind of work
        else if (lowerMessage.includes('what kind of work') || lowerMessage.includes('what do you do') || lowerMessage.includes('type of work')) {
            response = `**DropTechify Services:**

We specialize in:
• **Web Development** - Custom websites and web applications
• **Automation Tools** - Streamline your business processes
• **Data Scraping** - Extract data from any website efficiently
• **AI Bots** - Intelligent chatbots and automation
• **Custom Software** - Tailored solutions for your needs

Want something unique? Tell us your idea! We can build almost anything.`;
            quickReplies = ['Get Quote', 'Claim Discount', 'Contact Owner'];
        }
        
        // Owner/Team info
        else if (lowerMessage.includes('owner') || lowerMessage.includes('team') || lowerMessage.includes('founder') || lowerMessage.includes('who is')) {
            response = `**About Our Team:**

DropTechify is founded by **Abdul Kabeer**, with a professional team behind every project. You're in trusted hands.

• **Founder**: Abdul Kabeer
• **Experience**: 5-6 years in the industry
• **Team**: Expert developers and designers
• **Focus**: High-quality, reliable solutions

We personally handle each project to ensure excellence.`;
            quickReplies = ['Our Experience', 'Contact Abdul', 'Get Quote'];
        }
        
        // Experience
        else if (lowerMessage.includes('experienced') || lowerMessage.includes('experience') || lowerMessage.includes('how long')) {
            response = `**Our Experience:**

We have 5-6 years of industry experience delivering high-quality solutions to clients worldwide.

Our track record includes:
• 50+ successful projects completed
• 98% client satisfaction rate
• International client base
• Expertise across multiple technologies

Plus, get 30% off your first 10 projects with our current offer!`;
            quickReplies = ['View Portfolio', 'Claim Discount', 'Contact Us'];
        }
        
        // Delivery time
        else if (lowerMessage.includes('delivery') || lowerMessage.includes('how long') || lowerMessage.includes('timeline')) {
            response = `**Delivery Timeline:**

It depends on your project scope — but we aim to deliver as quickly as possible, often within a few days.

Typical timelines:
• Simple scripts: 1-3 days
• Web applications: 1-3 weeks  
• Complex projects: 2-6 weeks

With our 30% discount, you get faster delivery at a lower price!`;
            quickReplies = ['Get Quote', 'Contact Owner', 'Claim Discount'];
        }
        
        // Contact info
        else if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('email') || lowerMessage.includes('whatsapp')) {
            response = `**Contact Information:**

You can email us at **droptechify@gmail.com** or message us on WhatsApp. We respond fast!

• **Email**: droptechify@gmail.com
• **WhatsApp**: +923030273718
• **Owner**: Abdul Kabeer

Mention our 30% discount offer when you contact us!`;
            quickReplies = ['WhatsApp Now', 'Send Email', 'Claim Discount'];
        }
        
        // Custom project related
        else if (lowerMessage.includes('custom') || lowerMessage.includes('project') || lowerMessage.includes('specific') || lowerMessage.includes('tailored')) {
            response = `**Custom Projects:**

Sure, we can handle custom projects. Kindly share the details with us.

We specialize in creating tailored solutions that meet your specific requirements. Our team will work closely with you to understand your needs and deliver exactly what you're looking for.

Don't forget about our 30% discount on your first 10 projects!`;
            quickReplies = ['Contact Us', 'Claim Discount', 'Our Services'];
        }
        
        // Portfolio related
        else if (lowerMessage.includes('portfolio') || lowerMessage.includes('work') || lowerMessage.includes('project') || lowerMessage.includes('example')) {
            response = `📁 **DropTechify Portfolio (by Abdul Kabeer):**

• **50+ Completed Projects**
• **98% Client Satisfaction Rate**
• **Real-time solutions** for businesses worldwide

**Recent Projects:**
✅ Email scrapers for lead generation
✅ Trading bots for crypto/forex
✅ Inventory management systems
✅ Custom web applications with admin panels
✅ Mobile apps for iOS/Android

**We accept international clients!**`;
            quickReplies = ['View Live Projects', 'Client Reviews', 'Contact Owner'];
        }
        
        // Contact related
        else if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('talk') || lowerMessage.includes('abdul') || lowerMessage.includes('owner')) {
            response = `**Contact Information:**

You can message us on WhatsApp or email us at:

**Email**: contact@droptechify.com
**WhatsApp**: +923030273718
**Owner**: Abdul Kabeer

We typically respond within a few hours during business hours. Feel free to reach out with any questions or project requirements.`;
            quickReplies = ['Our Services', 'Custom Project', 'Pricing Info'];
        }

        // International clients
        else if (lowerMessage.includes('international') || lowerMessage.includes('worldwide') || lowerMessage.includes('global')) {
            response = `🌍 **Yes, we accept international clients!**

**DropTechify** works with clients from:
• United States 🇺🇸
• United Kingdom 🇬🇧
• Canada 🇨🇦
• Australia 🇦🇺
• Germany 🇩🇪
• And many more countries!

**Owner**: Abdul Kabeer handles all international projects personally.

**Communication**: English, Video calls, WhatsApp, Email
**Payment**: PayPal, Wise, Bank Transfer

Ready to start your project?`;
            quickReplies = ['Contact Owner', 'Get Quote', 'WhatsApp Now'];
        }

        // Web scraping specific
        else if (lowerMessage.includes('scraping') || lowerMessage.includes('scrape') || lowerMessage.includes('data')) {
            response = `🕷️ **Web Scraping Solutions by Abdul Kabeer:**

• Email extraction from websites/social media
• E-commerce data scraping (prices, products)
• Real estate listings automation
• Job postings aggregation
• Social media data collection
• Custom scraping for any website

**We handle JavaScript-heavy sites, CAPTCHAs, and large-scale operations!**

**Technologies**: Python, Selenium, BeautifulSoup, Scrapy`;
            quickReplies = ['Get Scraping Quote', 'Contact Abdul', 'See Examples'];
        }

        // Web development specific
        else if (lowerMessage.includes('website') || lowerMessage.includes('web dev') || lowerMessage.includes('django')) {
            response = `💻 **Web Development by Abdul Kabeer:**

• **Backend**: Python, Django, Flask, Node.js
• **Frontend**: HTML5, CSS3, JavaScript, React
• **Database**: PostgreSQL, MySQL, MongoDB
• **Deployment**: AWS, Heroku, DigitalOcean

**From simple sites to complex web applications with admin panels!**

**Recent Projects**: E-commerce sites, Admin dashboards, API development`;
            quickReplies = ['See Web Projects', 'Get Web Quote', 'Contact Abdul'];
        }

        // Mobile apps
        else if (lowerMessage.includes('mobile') || lowerMessage.includes('app') || lowerMessage.includes('android') || lowerMessage.includes('ios')) {
            response = `📱 **Mobile App Development by Abdul Kabeer:**

• **Android Apps** - Native Java/Kotlin
• **iOS Apps** - Swift/Objective-C
• **Cross-platform** - React Native, Flutter
• **Backend Integration** - APIs, databases
• **Play Store/App Store** - Publishing assistance

**We build custom mobile apps, automation tools, and more!**

Ready to discuss your mobile app idea?`;
            quickReplies = ['App Quote', 'Contact Abdul', 'See App Examples'];
        }

        // Thank you/positive responses
        else if (lowerMessage.includes('thank') || lowerMessage.includes('great') || lowerMessage.includes('awesome') || lowerMessage.includes('good')) {
            response = `😊 **You're welcome!** 

Abdul Kabeer and the DropTechify team are here to help.

Is there anything specific you'd like to know about our services or do you have a project in mind?

**Remember**: We accept international clients and provide free quotes!`;
            quickReplies = ['Start Project', 'Get Free Quote', 'Contact Abdul'];
        }

        // Default response
        else {
            response = `**Hi! I'm the DropTechify Assistant**

🔥 **Special Offer**: 30% OFF for first 10 projects (15 days only!)

**Owner**: Abdul Kabeer
**Company**: DropTechify

I can help you with:
• Information about our services
• Discount offer details
• Project quotes and pricing
• Contact information

We accept international clients worldwide!

What would you like to know more about?`;
            quickReplies = ['Discount Offer', 'Our Services', 'Get Quote', 'Contact Us'];
        }

        this.addBotMessage(response, quickReplies);
    }

    handleQuickReply(reply) {
        this.addUserMessage(reply);
        
        // Show typing indicator
        this.showTyping();
        
        setTimeout(() => {
            this.hideTyping();
            this.processMessage(reply);
        }, 800);
    }

    showTyping() {
        document.getElementById('typing-indicator').style.display = 'flex';
        this.isTyping = true;
        this.scrollToBottom();
    }

    hideTyping() {
        document.getElementById('typing-indicator').style.display = 'none';
        this.isTyping = false;
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chat-messages');
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 100);
    }

    formatMessage(message) {
        return message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .replace(/•/g, '<span style="color: #667eea;">•</span>');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Multiple initialization methods to ensure chatbot loads
function initializeChatbot() {
    if (!document.getElementById('chat-button')) {
        console.log('🤖 Initializing DropTechify Chatbot...');
        new DropTechifyChatbot();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeChatbot);
} else {
    initializeChatbot();
}

// Backup initialization
setTimeout(initializeChatbot, 1000);
setTimeout(initializeChatbot, 3000);

console.log('🤖 DropTechify Chatbot script loaded!');
