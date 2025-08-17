/**
 * Enhanced Features for Driizzyy Boosts Website
 * Additional functionality to improve user experience
 */

class EnhancedFeatures {
    constructor() {
        this.init();
    }

    init() {
        this.setupLiveChat();
        this.setupPriceCalculator();
        this.setupTestimonials();
        this.setupFAQSystem();
        this.setupDiscordStatusChecker();
        this.setupCouponSystem();
    }

    // ===== LIVE CHAT WIDGET ===== //
    setupLiveChat() {
        const chatWidget = document.createElement('div');
        chatWidget.className = 'live-chat-widget';
        chatWidget.innerHTML = `
            <div class="chat-toggle" id="chat-toggle">
                <i class="fas fa-comments"></i>
                <span class="chat-notification">1</span>
            </div>
            <div class="chat-panel" id="chat-panel" style="display: none;">
                <div class="chat-header">
                    <h4>💬 Live Support</h4>
                    <div class="chat-status">
                        <span class="status-dot online"></span>
                        <span>Online</span>
                    </div>
                    <span class="chat-close" id="chat-close">×</span>
                </div>
                <div class="chat-content">
                    <div class="chat-messages" id="chat-messages">
                        <div class="message bot-message">
                            <div class="message-avatar">🤖</div>
                            <div class="message-content">
                                <strong>Driizzyy Support</strong>
                                <p>Hi! 👋 Need help with Discord boosting? We're online and ready to assist!</p>
                                <small>Usually responds in ~5 minutes</small>
                            </div>
                        </div>
                    </div>
                    <div class="typing-indicator hidden" id="typing-indicator">
                        <div class="typing-dots">
                            <span></span><span></span><span></span>
                        </div>
                        <span>Support is typing...</span>
                    </div>
                    <div class="chat-quick-actions">
                        <button class="quick-btn" data-message="What packages do you recommend?">📦 Packages</button>
                        <button class="quick-btn" data-message="How fast is delivery?">⚡ Delivery</button>
                        <button class="quick-btn" data-message="Is this safe for my server?">🔒 Safety</button>
                    </div>
                    <div class="chat-input-area">
                        <input type="text" id="chat-input" placeholder="Type your message..." maxlength="500">
                        <button id="chat-send">Send</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(chatWidget);

        // Initialize chat session
        this.initializeChatSession();

        // Listen for admin messages
        this.setupAdminMessageListener();

        // Chat functionality
        const chatToggle = document.getElementById('chat-toggle');
        const chatPanel = document.getElementById('chat-panel');
        const chatClose = document.getElementById('chat-close');
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');
        const chatMessages = document.getElementById('chat-messages');

        chatToggle.addEventListener('click', () => {
            chatPanel.style.display = chatPanel.style.display === 'none' ? 'block' : 'none';
            document.querySelector('.chat-notification').style.display = 'none';
        });

        chatClose.addEventListener('click', () => {
            chatPanel.style.display = 'none';
        });

        // Quick action buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.dataset.message;
                this.sendChatMessage(message, 'user');
                this.simulateBotResponse(message);
            });
        });

        // Send message functionality
        const sendMessage = () => {
            const message = chatInput.value.trim();
            if (message) {
                this.sendChatMessage(message, 'user');
                chatInput.value = '';
                this.simulateBotResponse(message);
            }
        };

        chatSend.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    sendChatMessage(message, sender) {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        if (sender === 'user') {
            messageDiv.innerHTML = `
                <strong>You</strong>
                <p>${message}</p>
                <small>${new Date().toLocaleTimeString()}</small>
            `;
        } else {
            messageDiv.innerHTML = `
                <strong>Driizzyy Support</strong>
                <p>${message}</p>
                <small>${new Date().toLocaleTimeString()}</small>
            `;
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    simulateBotResponse(userMessage) {
        const responses = {
            'What packages do you recommend?': 'For most servers, I recommend our 14x Server Boosts (1 Month) package for $8. It unlocks Level 2-3 features including premium audio quality and custom emojis! 🚀',
            'How fast is delivery?': 'We offer instant delivery! Your boosts will be applied within 5 minutes of payment confirmation. No waiting around! ⚡',
            'Is this safe for my server?': 'Absolutely! All our services are 100% Discord ToS compliant. We use legitimate Discord Nitro accounts for boosting. Your server is completely safe! 🔒',
            'default': 'Thanks for your message! For immediate assistance, please join our Discord support server by clicking any "Order Now" button. Our team will help you right away! 💜'
        };

        const response = responses[userMessage] || responses['default'];
        
        // Store message in chat session for admin view
        this.storeChatMessage(userMessage, 'customer');
        
        setTimeout(() => {
            this.sendChatMessage(response, 'bot');
            this.storeChatMessage(response, 'bot');
        }, 1500);
    }

    initializeChatSession() {
        // Create unique session ID if not exists
        if (!localStorage.getItem('driizzyy_chat_session_id')) {
            const sessionId = 'chat_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('driizzyy_chat_session_id', sessionId);
            
            // Create session record
            const sessions = JSON.parse(localStorage.getItem('driizzyy_chat_sessions') || '[]');
            sessions.push({
                id: sessionId,
                customerName: 'Anonymous Customer',
                startTime: new Date().toISOString(),
                messageCount: 0,
                lastMessage: 'Chat session started',
                isActive: true
            });
            localStorage.setItem('driizzyy_chat_sessions', JSON.stringify(sessions));
        }
    }

    storeChatMessage(message, sender) {
        const sessionId = localStorage.getItem('driizzyy_chat_session_id');
        if (!sessionId) return;

        // Store message
        const messages = JSON.parse(localStorage.getItem('driizzyy_chat_messages') || '[]');
        messages.push({
            sessionId: sessionId,
            sender: sender,
            text: message,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('driizzyy_chat_messages', JSON.stringify(messages));

        // Update session
        const sessions = JSON.parse(localStorage.getItem('driizzyy_chat_sessions') || '[]');
        const sessionIndex = sessions.findIndex(s => s.id === sessionId);
        if (sessionIndex !== -1) {
            sessions[sessionIndex].messageCount++;
            sessions[sessionIndex].lastMessage = message.substring(0, 50) + '...';
            sessions[sessionIndex].lastActivity = new Date().toISOString();
            localStorage.setItem('driizzyy_chat_sessions', JSON.stringify(sessions));
        }
    }

    setupAdminMessageListener() {
        // Listen for admin responses
        window.addEventListener('admin-message', (event) => {
            const { sessionId, message, sender } = event.detail;
            const currentSessionId = localStorage.getItem('driizzyy_chat_session_id');
            
            if (sessionId === currentSessionId && sender === 'admin') {
                this.showTypingIndicator();
                setTimeout(() => {
                    this.hideTypingIndicator();
                    this.sendChatMessage(message, 'admin');
                }, 2000);
            }
        });
    }

    showTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.classList.remove('hidden');
            const chatMessages = document.getElementById('chat-messages');
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.classList.add('hidden');
        }
    }

    // ===== PRICE CALCULATOR ===== //
    setupPriceCalculator() {
        const calculatorSection = document.createElement('section');
        calculatorSection.className = 'price-calculator-section';
        calculatorSection.innerHTML = `
            <div class="container">
                <h2 class="section-title">💰 Price Calculator</h2>
                <div class="calculator-wrapper">
                    <div class="calculator-form">
                        <div class="form-group">
                            <label>Number of Boosts Needed:</label>
                            <select id="boost-amount">
                                <option value="7">7 Boosts (Level 1-2)</option>
                                <option value="14" selected>14 Boosts (Level 2-3)</option>
                                <option value="20">20+ Boosts (Level 3)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Duration:</label>
                            <select id="boost-duration">
                                <option value="1">1 Month</option>
                                <option value="3">3 Months</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Quantity:</label>
                            <input type="number" id="boost-quantity" min="1" max="10" value="1">
                        </div>
                    </div>
                    <div class="calculator-result">
                        <div class="price-display">
                            <span class="price-label">Total Price:</span>
                            <span class="price-amount" id="calculated-price">$8.00</span>
                        </div>
                        <div class="price-breakdown">
                            <div class="breakdown-item">
                                <span>Package: <span id="package-name">14x Boosts (1 Month)</span></span>
                            </div>
                            <div class="breakdown-item">
                                <span>Unit Price: <span id="unit-price">$8.00</span></span>
                            </div>
                            <div class="breakdown-item">
                                <span>Quantity: <span id="quantity-display">1</span></span>
                            </div>
                        </div>
                        <button class="btn btn-primary calculator-order">Order This Package</button>
                    </div>
                </div>
            </div>
        `;

        // Insert after pricing section
        const pricingSection = document.querySelector('#pricing');
        pricingSection.parentNode.insertBefore(calculatorSection, pricingSection.nextSibling);

        // Calculator functionality
        const updateCalculation = () => {
            const boosts = document.getElementById('boost-amount').value;
            const duration = document.getElementById('boost-duration').value;
            const quantity = parseInt(document.getElementById('boost-quantity').value);

            // Price lookup table
            const prices = {
                '7-1': 5, '14-1': 8, '20-1': 12,
                '7-3': 12, '14-3': 20, '20-3': 28
            };

            const priceKey = `${boosts}-${duration}`;
            const unitPrice = prices[priceKey] || 8;
            const totalPrice = unitPrice * quantity;

            document.getElementById('calculated-price').textContent = `$${totalPrice.toFixed(2)}`;
            document.getElementById('unit-price').textContent = `$${unitPrice.toFixed(2)}`;
            document.getElementById('quantity-display').textContent = quantity;
            document.getElementById('package-name').textContent = `${boosts}x Boosts (${duration} Month${duration > 1 ? 's' : ''})`;
        };

        // Event listeners
        document.getElementById('boost-amount').addEventListener('change', updateCalculation);
        document.getElementById('boost-duration').addEventListener('change', updateCalculation);
        document.getElementById('boost-quantity').addEventListener('input', updateCalculation);

        document.querySelector('.calculator-order').addEventListener('click', () => {
            const packageName = document.getElementById('package-name').textContent;
            const price = document.getElementById('calculated-price').textContent.replace('$', '');
            
            // Trigger existing order modal or create new one
            if (window.driizzyApp && window.driizzyApp.openOrderModal) {
                window.driizzyApp.openOrderModal(packageName, parseFloat(price));
            } else {
                this.openOrderModal(packageName, parseFloat(price));
            }
        });
    }

    // ===== TESTIMONIALS CAROUSEL ===== //
    setupTestimonials() {
        const testimonialsSection = document.createElement('section');
        testimonialsSection.className = 'testimonials-section';
        testimonialsSection.innerHTML = `
            <div class="container">
                <h2 class="section-title">⭐ What Our Customers Say</h2>
                <div class="testimonials-carousel">
                    <div class="testimonial-track" id="testimonial-track">
                        <div class="testimonial active">
                            <div class="testimonial-content">
                                <p>"Amazing service! Got my server to Level 3 instantly. The boost quality is top-notch and customer support is incredible!"</p>
                            </div>
                            <div class="testimonial-author">
                                <div class="author-avatar">🎮</div>
                                <div class="author-info">
                                    <strong>GamerKing#1337</strong>
                                    <span>Gaming Community Owner</span>
                                </div>
                            </div>
                            <div class="testimonial-rating">
                                ⭐⭐⭐⭐⭐
                            </div>
                        </div>
                        <div class="testimonial">
                            <div class="testimonial-content">
                                <p>"Been using Driizzyy Boosts for 6 months. Never had any issues, always instant delivery. Highly recommended!"</p>
                            </div>
                            <div class="testimonial-author">
                                <div class="author-avatar">💼</div>
                                <div class="author-info">
                                    <strong>BusinessPro#2021</strong>
                                    <span>Business Server Admin</span>
                                </div>
                            </div>
                            <div class="testimonial-rating">
                                ⭐⭐⭐⭐⭐
                            </div>
                        </div>
                        <div class="testimonial">
                            <div class="testimonial-content">
                                <p>"Affordable prices, excellent quality, and super fast support. This is the only boosting service I trust!"</p>
                            </div>
                            <div class="testimonial-author">
                                <div class="author-avatar">🎨</div>
                                <div class="author-info">
                                    <strong>ArtistHub#0420</strong>
                                    <span>Creative Community</span>
                                </div>
                            </div>
                            <div class="testimonial-rating">
                                ⭐⭐⭐⭐⭐
                            </div>
                        </div>
                    </div>
                    <div class="testimonial-dots">
                        <span class="dot active" data-slide="0"></span>
                        <span class="dot" data-slide="1"></span>
                        <span class="dot" data-slide="2"></span>
                    </div>
                </div>
            </div>
        `;

        // Insert before about section
        const aboutSection = document.querySelector('#about');
        aboutSection.parentNode.insertBefore(testimonialsSection, aboutSection);

        // Carousel functionality
        let currentSlide = 0;
        const testimonials = document.querySelectorAll('.testimonial');
        const dots = document.querySelectorAll('.dot');

        const showSlide = (index) => {
            testimonials.forEach(t => t.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            
            testimonials[index].classList.add('active');
            dots[index].classList.add('active');
        };

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });

        // Auto-rotate testimonials
        setInterval(() => {
            currentSlide = (currentSlide + 1) % testimonials.length;
            showSlide(currentSlide);
        }, 5000);
    }

    // ===== FAQ SYSTEM ===== //
    setupFAQSystem() {
        const faqSection = document.createElement('section');
        faqSection.className = 'faq-section';
        faqSection.innerHTML = `
            <div class="container">
                <h2 class="section-title">❓ Frequently Asked Questions</h2>
                <div class="faq-container">
                    <div class="faq-item">
                        <div class="faq-question">
                            <h3>Is Discord boosting safe for my server?</h3>
                            <span class="faq-toggle">+</span>
                        </div>
                        <div class="faq-answer">
                            <p>Yes! Our boosting service is 100% safe and Discord ToS compliant. We use legitimate Discord Nitro accounts to boost your server, ensuring no risk to your community.</p>
                        </div>
                    </div>
                    <div class="faq-item">
                        <div class="faq-question">
                            <h3>How fast is the delivery?</h3>
                            <span class="faq-toggle">+</span>
                        </div>
                        <div class="faq-answer">
                            <p>We offer instant delivery! Your server boosts will be applied within 5 minutes of payment confirmation. No waiting periods.</p>
                        </div>
                    </div>
                    <div class="faq-item">
                        <div class="faq-question">
                            <h3>What payment methods do you accept?</h3>
                            <span class="faq-toggle">+</span>
                        </div>
                        <div class="faq-answer">
                            <p>We accept PayPal, Credit/Debit Cards, and Cryptocurrency. All payments are processed securely through our Discord support server.</p>
                        </div>
                    </div>
                    <div class="faq-item">
                        <div class="faq-question">
                            <h3>Do you offer refunds?</h3>
                            <span class="faq-toggle">+</span>
                        </div>
                        <div class="faq-answer">
                            <p>All sales are final with no refunds. However, we guarantee our service quality and offer full support if any issues arise.</p>
                        </div>
                    </div>
                    <div class="faq-item">
                        <div class="faq-question">
                            <h3>How long do the boosts last?</h3>
                            <span class="faq-toggle">+</span>
                        </div>
                        <div class="faq-answer">
                            <p>Our boosts last for the full duration purchased (1 month or 3 months). We monitor all boosts and provide replacements if any drop early.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert before the about section
        const aboutSection = document.querySelector('#about');
        aboutSection.parentNode.insertBefore(faqSection, aboutSection);

        // FAQ functionality
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.parentElement;
                const answer = faqItem.querySelector('.faq-answer');
                const toggle = question.querySelector('.faq-toggle');

                faqItem.classList.toggle('active');
                if (faqItem.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    toggle.textContent = '−';
                } else {
                    answer.style.maxHeight = '0';
                    toggle.textContent = '+';
                }
            });
        });
    }

    // ===== DISCORD STATUS CHECKER ===== //
    setupDiscordStatusChecker() {
        const statusWidget = document.createElement('div');
        statusWidget.className = 'discord-status-widget';
        statusWidget.innerHTML = `
            <div class="status-indicator">
                <div class="status-dot online"></div>
                <span>Discord Services: Online</span>
            </div>
        `;
        
        // Add to navigation or hero section
        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) {
            heroStats.appendChild(statusWidget);
        }

        // Check Discord status (simplified)
        this.checkDiscordStatus();
    }

    async checkDiscordStatus() {
        try {
            // Simplified status check
            const statusDot = document.querySelector('.status-dot');
            const statusText = document.querySelector('.discord-status-widget span');
            
            // For demo purposes, always show online
            statusDot.className = 'status-dot online';
            statusText.textContent = 'Discord Services: Online ✅';
        } catch (error) {
            console.log('Status check failed, showing default');
        }
    }

    // ===== COUPON SYSTEM ===== //
    setupCouponSystem() {
        // Add coupon field to order modal
        const modal = document.querySelector('#checkout-modal .modal-content');
        if (modal) {
            const couponField = document.createElement('div');
            couponField.className = 'modal-row coupon-row';
            couponField.innerHTML = `
                <label>Coupon Code (Optional)</label>
                <div class="coupon-input-group">
                    <input type="text" id="coupon-code" placeholder="Enter coupon code">
                    <button type="button" id="apply-coupon">Apply</button>
                </div>
                <div id="coupon-status"></div>
            `;
            
            // Insert before the finalize button
            const finalizeBtn = modal.querySelector('.btn.btn-primary');
            finalizeBtn.parentNode.insertBefore(couponField, finalizeBtn);

            // Coupon functionality
            document.getElementById('apply-coupon').addEventListener('click', () => {
                this.applyCoupon();
            });
        }
    }

    applyCoupon() {
        const couponCode = document.getElementById('coupon-code').value.trim().toUpperCase();
        const statusDiv = document.getElementById('coupon-status');
        
        // Sample coupon codes
        const coupons = {
            'FIRST10': { discount: 10, type: 'percentage', description: '10% off first order' },
            'BOOST5': { discount: 5, type: 'percentage', description: '5% off any boost package' },
            'WELCOME': { discount: 2, type: 'fixed', description: '$2 off your order' }
        };

        if (coupons[couponCode]) {
            const coupon = coupons[couponCode];
            statusDiv.innerHTML = `✅ Coupon applied: ${coupon.description}`;
            statusDiv.style.color = 'green';
            
            // Update price display
            const priceInput = document.getElementById('modal-price');
            const currentPrice = parseFloat(priceInput.value.replace('$', ''));
            let newPrice;
            
            if (coupon.type === 'percentage') {
                newPrice = currentPrice * (1 - coupon.discount / 100);
            } else {
                newPrice = currentPrice - coupon.discount;
            }
            
            priceInput.value = `$${newPrice.toFixed(2)}`;
        } else if (couponCode) {
            statusDiv.innerHTML = '❌ Invalid coupon code';
            statusDiv.style.color = 'red';
        } else {
            statusDiv.innerHTML = '';
        }
    }

    // ===== ORDER MODAL SYSTEM ===== //
    openOrderModal(packageName, price) {
        // Remove existing modal if present
        const existingModal = document.getElementById('enhanced-checkout-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'enhanced-checkout-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close" id="enhanced-modal-close">&times;</span>
                <h2>Complete Your Order</h2>
                <p style="margin-bottom:1.5rem;">All orders are processed through our Discord support server for security and instant delivery.</p>
                
                <div class="modal-row">
                    <label>Package</label>
                    <input type="text" id="enhanced-modal-package" value="${packageName}" readonly>
                </div>
                
                <div class="modal-row">
                    <label>Price</label>
                    <input type="text" id="enhanced-modal-price" value="$${price.toFixed(2)}" readonly>
                </div>
                
                <div class="modal-row">
                    <label>Discord Username *</label>
                    <input type="text" id="enhanced-discord-username" placeholder="YourUsername#1234" required>
                </div>
                
                <div class="modal-row">
                    <label>Email Address *</label>
                    <input type="email" id="enhanced-email" placeholder="your@email.com" required>
                </div>
                
                <div class="modal-row">
                    <label>Server ID (Optional)</label>
                    <input type="text" id="enhanced-server-id" placeholder="123456789012345678">
                    <small>Right-click your server → Copy Server ID</small>
                </div>
                
                <div class="modal-row coupon-row">
                    <label>Coupon Code (Optional)</label>
                    <div class="coupon-input-group">
                        <input type="text" id="enhanced-coupon-code" placeholder="Enter coupon code">
                        <button type="button" id="enhanced-apply-coupon">Apply</button>
                    </div>
                    <div id="enhanced-coupon-status"></div>
                </div>
                
                <button class="btn btn-primary" id="enhanced-modal-submit">Submit Order</button>
                <div id="enhanced-modal-status" style="margin-top:1rem;"></div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Setup event listeners
        this.setupModalEventListeners(modal, packageName, price);
    }

    setupModalEventListeners(modal, packageName, originalPrice) {
        // Close modal
        modal.querySelector('#enhanced-modal-close').onclick = () => {
            modal.remove();
            document.body.style.overflow = '';
        };

        // Click outside to close
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
                document.body.style.overflow = '';
            }
        };

        // Coupon functionality
        modal.querySelector('#enhanced-apply-coupon').onclick = () => {
            this.applyEnhancedCoupon(modal, originalPrice);
        };

        // Submit order
        modal.querySelector('#enhanced-modal-submit').onclick = () => {
            this.submitEnhancedOrder(modal, packageName);
        };
    }

    applyEnhancedCoupon(modal, originalPrice) {
        const couponCode = modal.querySelector('#enhanced-coupon-code').value.trim().toUpperCase();
        const statusDiv = modal.querySelector('#enhanced-coupon-status');
        const priceInput = modal.querySelector('#enhanced-modal-price');
        
        // Sample coupon codes
        const coupons = {
            'FIRST10': { discount: 10, type: 'percentage', description: '10% off first order' },
            'BOOST5': { discount: 5, type: 'percentage', description: '5% off any boost package' },
            'WELCOME': { discount: 2, type: 'fixed', description: '$2 off your order' },
            'SAVE20': { discount: 20, type: 'percentage', description: '20% off your order' }
        };

        if (coupons[couponCode]) {
            const coupon = coupons[couponCode];
            statusDiv.innerHTML = `✅ Coupon applied: ${coupon.description}`;
            statusDiv.style.color = '#57f287';
            
            let newPrice;
            if (coupon.type === 'percentage') {
                newPrice = originalPrice * (1 - coupon.discount / 100);
            } else {
                newPrice = originalPrice - coupon.discount;
            }
            
            newPrice = Math.max(newPrice, 1); // Minimum $1
            priceInput.value = `$${newPrice.toFixed(2)}`;
            
            // Store coupon for order submission
            modal.setAttribute('data-coupon', couponCode);
            modal.setAttribute('data-discount', coupon.discount);
            modal.setAttribute('data-discount-type', coupon.type);
        } else if (couponCode) {
            statusDiv.innerHTML = '❌ Invalid coupon code';
            statusDiv.style.color = '#ed4245';
            priceInput.value = `$${originalPrice.toFixed(2)}`;
            modal.removeAttribute('data-coupon');
        } else {
            statusDiv.innerHTML = '';
            priceInput.value = `$${originalPrice.toFixed(2)}`;
            modal.removeAttribute('data-coupon');
        }
    }

    async submitEnhancedOrder(modal, packageName) {
        const discordUsername = modal.querySelector('#enhanced-discord-username').value.trim();
        const email = modal.querySelector('#enhanced-email').value.trim();
        const serverId = modal.querySelector('#enhanced-server-id').value.trim();
        const price = modal.querySelector('#enhanced-modal-price').value.replace('$', '');
        const statusDiv = modal.querySelector('#enhanced-modal-status');
        const submitBtn = modal.querySelector('#enhanced-modal-submit');

        // Validation
        if (!discordUsername || !email) {
            statusDiv.textContent = 'Please enter your Discord username and email address.';
            statusDiv.style.color = '#ed4245';
            return;
        }

        if (!this.validateEmail(email)) {
            statusDiv.textContent = 'Please enter a valid email address.';
            statusDiv.style.color = '#ed4245';
            return;
        }

        // Generate unique order ID
        const orderId = this.generateOrderId();
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing Order...';
        statusDiv.textContent = 'Creating your order...';
        statusDiv.style.color = '#fee75c';

        try {
            // Get site configuration
            const siteData = await this.loadSiteConfiguration();
            
            if (!siteData || !siteData.shop || !siteData.shop.webhook_url) {
                throw new Error('Order system configuration not found');
            }

            // Prepare order data
            const orderData = {
                orderId: orderId,
                package: packageName,
                price: parseFloat(price),
                discord: discordUsername,
                email: email,
                serverId: serverId || 'Not provided',
                timestamp: new Date().toISOString(),
                status: 'pending',
                coupon: modal.getAttribute('data-coupon') || null
            };

            // Store order locally for tracking
            this.storeOrderLocally(orderData);

            // Send to Discord webhook
            await this.sendOrderToDiscord(orderData, siteData.shop.webhook_url);

            // Success
            statusDiv.innerHTML = `✅ Order created successfully!<br><strong>Order ID: ${orderId}</strong><br>Redirecting to support...`;
            statusDiv.style.color = '#57f287';

            setTimeout(() => {
                window.open(siteData.shop.ticket_channel || 'https://discord.com', '_blank');
                modal.remove();
                document.body.style.overflow = '';
            }, 2000);

        } catch (error) {
            console.error('Order submission failed:', error);
            statusDiv.textContent = 'Failed to create order. Please try again or contact support.';
            statusDiv.style.color = '#ed4245';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Order';
        }
    }

    generateOrderId() {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `DB-${timestamp.slice(-6)}${random}`;
    }

    async loadSiteConfiguration() {
        try {
            const response = await fetch('config/site.json');
            if (!response.ok) throw new Error('Failed to load configuration');
            return await response.json();
        } catch (error) {
            console.error('Failed to load site configuration:', error);
            return null;
        }
    }

    storeOrderLocally(orderData) {
        try {
            const existingOrders = JSON.parse(localStorage.getItem('driizzyy_orders') || '[]');
            existingOrders.push(orderData);
            
            // Keep only last 50 orders
            if (existingOrders.length > 50) {
                existingOrders.splice(0, existingOrders.length - 50);
            }
            
            localStorage.setItem('driizzyy_orders', JSON.stringify(existingOrders));
        } catch (error) {
            console.error('Failed to store order locally:', error);
        }
    }

    async sendOrderToDiscord(orderData, webhookUrl) {
        const embed = {
            title: "🛒 New Order Received",
            color: 5814783, // Discord blue
            fields: [
                {
                    name: "📦 Package",
                    value: orderData.package,
                    inline: true
                },
                {
                    name: "💰 Price",
                    value: `$${orderData.price.toFixed(2)}`,
                    inline: true
                },
                {
                    name: "🆔 Order ID",
                    value: `\`${orderData.orderId}\``,
                    inline: true
                },
                {
                    name: "👤 Discord",
                    value: orderData.discord,
                    inline: true
                },
                {
                    name: "📧 Email",
                    value: orderData.email,
                    inline: true
                },
                {
                    name: "🏠 Server ID",
                    value: `\`${orderData.serverId}\``,
                    inline: true
                }
            ],
            footer: {
                text: `Order Status: Pending • ${new Date().toLocaleString()}`
            },
            timestamp: orderData.timestamp
        };

        // Add coupon info if applied
        if (orderData.coupon) {
            embed.fields.push({
                name: "🎟️ Coupon Used",
                value: orderData.coupon,
                inline: true
            });
        }

        const payload = {
            username: "Driizzyy Boosts - Order System",
            avatar_url: "https://cdn.discordapp.com/emojis/736052317648896130.png",
            embeds: [embed]
        };

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Discord webhook failed: ${response.status}`);
        }
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}

// Initialize enhanced features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EnhancedFeatures();
});
