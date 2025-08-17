/**
 * Account System for Driizzyy Boosts
 * Customer login and order management
 */

class AccountSystem {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.isAdmin = false;
        this.init();
    }

    init() {
        this.checkExistingSession();
        this.createLoginInterface();
        this.setupEventListeners();
    }

    checkExistingSession() {
        const sessionData = localStorage.getItem('driizzyy_session');
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                if (session.expiry > Date.now()) {
                    this.currentUser = session.user;
                    this.isLoggedIn = true;
                    this.isAdmin = session.isAdmin || false;
                    this.showAccountDashboard();
                }
            } catch (error) {
                localStorage.removeItem('driizzyy_session');
            }
        }
    }

    createLoginInterface() {
        // Replace the order tracking section with login/account interface
        const trackingSection = document.querySelector('.order-tracking-section');
        if (trackingSection) {
            trackingSection.className = 'account-section';
            trackingSection.innerHTML = `
                <div class="container">
                    <h2 class="section-title">👤 Account Login</h2>
                    <div id="login-container" class="account-container">
                        <div class="login-form">
                            <div class="login-tabs">
                                <button class="tab-btn active" data-tab="customer">Customer Login</button>
                                <button class="tab-btn" data-tab="admin">Admin Login</button>
                            </div>
                            
                            <div class="tab-content" id="customer-tab">
                                <h3>🔐 Customer Account Access</h3>
                                <p>Login with your order information to track all your orders</p>
                                <div class="form-group">
                                    <label>Login Method:</label>
                                    <select id="customer-login-method">
                                        <option value="order-id">Order ID</option>
                                        <option value="discord">Discord Username</option>
                                        <option value="email">Email Address</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <input type="text" id="customer-login-value" placeholder="Enter your Order ID, Discord username, or email">
                                </div>
                                <button class="btn btn-primary" id="customer-login-btn">Login to Account</button>
                            </div>
                            
                            <div class="tab-content hidden" id="admin-tab">
                                <h3>🛡️ Admin Panel Access</h3>
                                <p>Administrative access for order management and live support</p>
                                <div class="form-group">
                                    <label>Admin Access Code:</label>
                                    <input type="password" id="admin-password" placeholder="Enter admin access code">
                                </div>
                                <button class="btn btn-admin" id="admin-login-btn">Access Admin Panel</button>
                            </div>
                            
                            <div id="login-status" class="login-status"></div>
                        </div>
                    </div>
                    
                    <div id="dashboard-container" class="account-container hidden">
                        <!-- Dashboard content will be populated here -->
                    </div>
                </div>
            `;
        }
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab(btn.dataset.tab);
            });
        });

        // Customer login
        document.getElementById('customer-login-btn').addEventListener('click', () => {
            this.handleCustomerLogin();
        });

        // Admin login
        document.getElementById('admin-login-btn').addEventListener('click', () => {
            this.handleAdminLogin();
        });

        // Enter key support
        document.getElementById('customer-login-value').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleCustomerLogin();
        });

        document.getElementById('admin-password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleAdminLogin();
        });
    }

    switchTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Show/hide tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('hidden', content.id !== `${tabName}-tab`);
        });

        // Clear status
        document.getElementById('login-status').innerHTML = '';
    }

    async handleCustomerLogin() {
        const method = document.getElementById('customer-login-method').value;
        const value = document.getElementById('customer-login-value').value.trim();
        const statusDiv = document.getElementById('login-status');

        if (!value) {
            this.showStatus('Please enter your login information', 'error');
            return;
        }

        statusDiv.innerHTML = 'Verifying account...';
        statusDiv.className = 'login-status loading';

        try {
            const userData = await this.findCustomerAccount(method, value);
            
            if (userData) {
                this.loginUser(userData, false);
                this.showAccountDashboard();
            } else {
                this.showStatus('Account not found. Please check your information or place an order first.', 'error');
            }
        } catch (error) {
            this.showStatus('Login failed. Please try again.', 'error');
        }
    }

    async handleAdminLogin() {
        const password = document.getElementById('admin-password').value;
        const statusDiv = document.getElementById('login-status');

        if (password !== 'DriizzyyBoostsAdmin') {
            this.showStatus('Invalid admin access code', 'error');
            return;
        }

        statusDiv.innerHTML = 'Accessing admin panel...';
        statusDiv.className = 'login-status loading';

        // Create admin user
        const adminUser = {
            id: 'admin',
            name: 'Administrator',
            role: 'admin',
            permissions: ['view_all_orders', 'update_orders', 'live_chat']
        };

        this.loginUser(adminUser, true);
        this.showAdminDashboard();
    }

    async findCustomerAccount(method, value) {
        try {
            const orders = JSON.parse(localStorage.getItem('driizzyy_orders') || '[]');
            
            let foundOrder = null;
            
            switch (method) {
                case 'order-id':
                    foundOrder = orders.find(order => order.orderId === value);
                    break;
                case 'discord':
                    foundOrder = orders.find(order => 
                        order.discord.toLowerCase().includes(value.toLowerCase())
                    );
                    break;
                case 'email':
                    foundOrder = orders.find(order => 
                        order.email.toLowerCase() === value.toLowerCase()
                    );
                    break;
            }

            if (foundOrder) {
                // Get all orders for this customer
                const customerOrders = orders.filter(order => 
                    order.discord === foundOrder.discord || order.email === foundOrder.email
                );

                return {
                    id: foundOrder.discord,
                    name: foundOrder.discord.split('#')[0],
                    discord: foundOrder.discord,
                    email: foundOrder.email,
                    orders: customerOrders,
                    joinDate: Math.min(...customerOrders.map(o => new Date(o.timestamp).getTime()))
                };
            }

            return null;
        } catch (error) {
            console.error('Error finding customer account:', error);
            return null;
        }
    }

    loginUser(userData, isAdmin = false) {
        this.currentUser = userData;
        this.isLoggedIn = true;
        this.isAdmin = isAdmin;

        // Store session
        const sessionData = {
            user: userData,
            isAdmin: isAdmin,
            expiry: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };
        localStorage.setItem('driizzyy_session', JSON.stringify(sessionData));

        // Hide login form
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('dashboard-container').classList.remove('hidden');

        this.showStatus('Login successful!', 'success');
    }

    showAccountDashboard() {
        const dashboardContainer = document.getElementById('dashboard-container');
        const user = this.currentUser;

        dashboardContainer.innerHTML = `
            <div class="account-header">
                <div class="user-info">
                    <div class="avatar">👤</div>
                    <div class="user-details">
                        <h3>Welcome back, ${user.name}!</h3>
                        <p>Discord: ${user.discord}</p>
                        <p>Email: ${user.email}</p>
                    </div>
                </div>
                <button class="btn btn-secondary" id="logout-btn">Logout</button>
            </div>
            
            <div class="account-stats">
                <div class="stat-card">
                    <h4>${user.orders.length}</h4>
                    <p>Total Orders</p>
                </div>
                <div class="stat-card">
                    <h4>${user.orders.filter(o => o.status === 'completed').length}</h4>
                    <p>Completed</p>
                </div>
                <div class="stat-card">
                    <h4>$${user.orders.reduce((sum, o) => sum + (parseFloat(o.price) || 0), 0).toFixed(2)}</h4>
                    <p>Total Spent</p>
                </div>
            </div>
            
            <div class="orders-section">
                <h3>📦 Your Orders</h3>
                <div class="orders-list">
                    ${this.renderOrdersList(user.orders)}
                </div>
            </div>
        `;

        this.setupDashboardEvents();
    }

    showAdminDashboard() {
        const dashboardContainer = document.getElementById('dashboard-container');
        
        dashboardContainer.innerHTML = `
            <div class="admin-header">
                <div class="admin-info">
                    <div class="avatar">🛡️</div>
                    <div class="admin-details">
                        <h3>Admin Panel</h3>
                        <p>Order Management & Live Support</p>
                    </div>
                </div>
                <button class="btn btn-secondary" id="logout-btn">Logout</button>
            </div>
            
            <div class="admin-tabs">
                <button class="admin-tab-btn active" data-tab="orders">📦 Orders</button>
                <button class="admin-tab-btn" data-tab="live-chat">💬 Live Chat</button>
                <button class="admin-tab-btn" data-tab="analytics">📊 Analytics</button>
            </div>
            
            <div class="admin-content">
                <div class="admin-tab-content" id="admin-orders-tab">
                    ${this.renderAdminOrdersTab()}
                </div>
                
                <div class="admin-tab-content hidden" id="admin-live-chat-tab">
                    ${this.renderAdminChatTab()}
                </div>
                
                <div class="admin-tab-content hidden" id="admin-analytics-tab">
                    ${this.renderAdminAnalyticsTab()}
                </div>
            </div>
        `;

        this.setupAdminEvents();
        this.startLiveChatMonitoring();
    }

    renderOrdersList(orders) {
        if (orders.length === 0) {
            return '<div class="no-orders">No orders found. <a href="#pricing">Place your first order!</a></div>';
        }

        return orders.map(order => {
            const timeAgo = this.getTimeAgo(order.timestamp);
            const statusClass = this.getStatusClass(order.status || 'pending');
            
            return `
                <div class="order-item">
                    <div class="order-header">
                        <div class="order-id">
                            <strong>${order.orderId}</strong>
                            <span class="order-status ${statusClass}">${(order.status || 'pending').toUpperCase()}</span>
                        </div>
                        <div class="order-time">${timeAgo}</div>
                    </div>
                    <div class="order-details">
                        <div class="order-package">${order.package}</div>
                        <div class="order-price">$${(parseFloat(order.price) || 0).toFixed(2)}</div>
                    </div>
                    <div class="order-progress">
                        ${this.renderOrderProgress(order.status || 'pending')}
                    </div>
                </div>
            `;
        }).join('');
    }

    renderAdminOrdersTab() {
        const allOrders = JSON.parse(localStorage.getItem('driizzyy_orders') || '[]');
        
        return `
            <div class="admin-orders-header">
                <h3>All Orders (${allOrders.length})</h3>
                <div class="order-filters">
                    <select id="status-filter">
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <input type="text" id="order-search" placeholder="Search orders...">
                </div>
            </div>
            <div class="admin-orders-list">
                ${this.renderAdminOrdersList(allOrders)}
            </div>
        `;
    }

    renderAdminOrdersList(orders) {
        if (orders.length === 0) {
            return '<div class="no-orders">No orders found.</div>';
        }

        return orders.map(order => {
            const timeAgo = this.getTimeAgo(order.timestamp);
            const statusClass = this.getStatusClass(order.status || 'pending');
            
            return `
                <div class="admin-order-item" data-order-id="${order.orderId}">
                    <div class="admin-order-header">
                        <div class="order-info">
                            <strong>${order.orderId}</strong>
                            <span class="customer-info">${order.discord}</span>
                        </div>
                        <div class="order-actions">
                            <select class="status-select" data-order-id="${order.orderId}">
                                <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                                <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                                <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                                <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                            </select>
                            <button class="btn btn-sm btn-primary update-order-btn" data-order-id="${order.orderId}">Update</button>
                        </div>
                    </div>
                    <div class="admin-order-details">
                        <div class="detail-grid">
                            <div><strong>Package:</strong> ${order.package}</div>
                            <div><strong>Price:</strong> $${(parseFloat(order.price) || 0).toFixed(2)}</div>
                            <div><strong>Email:</strong> ${order.email}</div>
                            <div><strong>Time:</strong> ${timeAgo}</div>
                        </div>
                        <div class="order-status-badge ${statusClass}">${(order.status || 'pending').toUpperCase()}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderAdminChatTab() {
        return `
            <div class="live-chat-admin">
                <div class="chat-header">
                    <h3>💬 Live Chat Support</h3>
                    <div class="chat-status">
                        <span class="status-dot online"></span>
                        <span>Online & Ready</span>
                    </div>
                </div>
                
                <div class="chat-sessions">
                    <div class="active-chats" id="active-chat-sessions">
                        <div class="no-chats">No active chat sessions</div>
                    </div>
                </div>
                
                <div class="chat-window hidden" id="admin-chat-window">
                    <div class="chat-window-header">
                        <h4 id="chat-user-name">Customer Chat</h4>
                        <button class="close-chat-btn">×</button>
                    </div>
                    <div class="chat-messages" id="admin-chat-messages"></div>
                    <div class="chat-input-area">
                        <input type="text" id="admin-chat-input" placeholder="Type your response...">
                        <button id="admin-chat-send">Send</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderAdminAnalyticsTab() {
        const orders = JSON.parse(localStorage.getItem('driizzyy_orders') || '[]');
        const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(order.price) || 0), 0);
        const completedOrders = orders.filter(o => o.status === 'completed').length;
        const conversionRate = orders.length > 0 ? (completedOrders / orders.length * 100).toFixed(1) : 0;
        
        return `
            <div class="analytics-dashboard">
                <h3>📊 Business Analytics</h3>
                
                <div class="analytics-stats">
                    <div class="stat-card">
                        <h4>$${totalRevenue.toFixed(2)}</h4>
                        <p>Total Revenue</p>
                    </div>
                    <div class="stat-card">
                        <h4>${orders.length}</h4>
                        <p>Total Orders</p>
                    </div>
                    <div class="stat-card">
                        <h4>${completedOrders}</h4>
                        <p>Completed Orders</p>
                    </div>
                    <div class="stat-card">
                        <h4>${conversionRate}%</h4>
                        <p>Completion Rate</p>
                    </div>
                </div>
                
                <div class="analytics-charts">
                    <div class="chart-section">
                        <h4>Recent Order Activity</h4>
                        <div class="activity-list">
                            ${this.renderRecentActivity(orders)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupDashboardEvents() {
        // Logout button
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });
    }

    setupAdminEvents() {
        // Logout button
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });

        // Admin tab switching
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchAdminTab(btn.dataset.tab);
            });
        });

        // Order status updates
        document.querySelectorAll('.update-order-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.updateOrderStatus(e.target.dataset.orderId);
            });
        });

        // Order search and filtering
        const searchInput = document.getElementById('order-search');
        const statusFilter = document.getElementById('status-filter');
        
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterOrders());
        }
        
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterOrders());
        }
    }

    switchAdminTab(tabName) {
        // Update active tab
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Show/hide content
        document.querySelectorAll('.admin-tab-content').forEach(content => {
            content.classList.toggle('hidden', content.id !== `admin-${tabName}-tab`);
        });
    }

    async updateOrderStatus(orderId) {
        const statusSelect = document.querySelector(`select[data-order-id="${orderId}"]`);
        const newStatus = statusSelect.value;
        
        try {
            // Update local storage
            const orders = JSON.parse(localStorage.getItem('driizzyy_orders') || '[]');
            const orderIndex = orders.findIndex(order => order.orderId === orderId);
            
            if (orderIndex !== -1) {
                orders[orderIndex].status = newStatus;
                orders[orderIndex].lastUpdated = new Date().toISOString();
                localStorage.setItem('driizzyy_orders', JSON.stringify(orders));
                
                // Send Discord update
                await this.sendOrderUpdateToDiscord(orders[orderIndex]);
                
                this.showStatus(`Order ${orderId} updated to ${newStatus}`, 'success');
                
                // Refresh the orders list
                setTimeout(() => {
                    this.refreshAdminOrdersList();
                }, 1000);
            }
        } catch (error) {
            this.showStatus('Failed to update order', 'error');
        }
    }

    async sendOrderUpdateToDiscord(order) {
        try {
            const siteData = await this.loadSiteConfiguration();
            if (!siteData?.shop?.webhook_url) return;

            const statusColors = {
                pending: 16776960,    // Yellow
                processing: 3447003,  // Blue
                completed: 3066993,   // Green
                cancelled: 15158332   // Red
            };

            const embed = {
                title: "📋 Order Status Update",
                color: statusColors[order.status] || 16776960,
                fields: [
                    { name: "🆔 Order ID", value: `\`${order.orderId}\``, inline: true },
                    { name: "📊 Status", value: order.status.toUpperCase(), inline: true },
                    { name: "👤 Customer", value: order.discord, inline: true },
                    { name: "📦 Package", value: order.package, inline: true },
                    { name: "💰 Price", value: `$${(parseFloat(order.price) || 0).toFixed(2)}`, inline: true },
                    { name: "⏰ Updated", value: new Date().toLocaleString(), inline: true }
                ],
                footer: { text: "Driizzyy Boosts - Admin Update" }
            };

            await fetch(siteData.shop.webhook_url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: "Driizzyy Boosts - Admin",
                    embeds: [embed]
                })
            });
        } catch (error) {
            console.error('Failed to send Discord update:', error);
        }
    }

    async loadSiteConfiguration() {
        try {
            const response = await fetch('config/site.json');
            return await response.json();
        } catch (error) {
            return null;
        }
    }

    filterOrders() {
        const searchTerm = document.getElementById('order-search')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('status-filter')?.value || 'all';
        
        const orderItems = document.querySelectorAll('.admin-order-item');
        
        orderItems.forEach(item => {
            const orderText = item.textContent.toLowerCase();
            const orderStatus = item.querySelector('.status-select').value;
            
            const matchesSearch = orderText.includes(searchTerm);
            const matchesStatus = statusFilter === 'all' || orderStatus === statusFilter;
            
            item.style.display = matchesSearch && matchesStatus ? 'block' : 'none';
        });
    }

    refreshAdminOrdersList() {
        const ordersTab = document.getElementById('admin-orders-tab');
        if (ordersTab) {
            ordersTab.innerHTML = this.renderAdminOrdersTab();
            this.setupAdminEvents();
        }
    }

    startLiveChatMonitoring() {
        // Monitor for new chat messages from customers
        this.chatMonitorInterval = setInterval(() => {
            this.checkForNewChatMessages();
        }, 2000);
    }

    checkForNewChatMessages() {
        // This would integrate with the live chat system
        // For now, simulate checking for messages
        const activeSessions = this.getActiveChatSessions();
        this.updateActiveChatsList(activeSessions);
    }

    getActiveChatSessions() {
        // Get chat sessions from localStorage or other storage
        return JSON.parse(localStorage.getItem('driizzyy_chat_sessions') || '[]');
    }

    updateActiveChatsList(sessions) {
        const activeChatsDiv = document.getElementById('active-chat-sessions');
        if (!activeChatsDiv) return;

        if (sessions.length === 0) {
            activeChatsDiv.innerHTML = '<div class="no-chats">No active chat sessions</div>';
            return;
        }

        activeChatsDiv.innerHTML = sessions.map(session => `
            <div class="chat-session" data-session-id="${session.id}">
                <div class="session-info">
                    <strong>${session.customerName || 'Anonymous'}</strong>
                    <span class="message-count">${session.messageCount} messages</span>
                </div>
                <div class="last-message">${session.lastMessage}</div>
                <button class="btn btn-sm join-chat-btn" data-session-id="${session.id}">Join Chat</button>
            </div>
        `).join('');

        // Setup join chat buttons
        document.querySelectorAll('.join-chat-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.joinChatSession(e.target.dataset.sessionId);
            });
        });
    }

    joinChatSession(sessionId) {
        // Show chat window and load conversation
        const chatWindow = document.getElementById('admin-chat-window');
        chatWindow.classList.remove('hidden');
        
        // Load chat history and setup real-time messaging
        this.loadChatHistory(sessionId);
        this.setupAdminChatInput(sessionId);
    }

    loadChatHistory(sessionId) {
        // Load existing chat messages
        const messages = this.getChatMessages(sessionId);
        const messagesDiv = document.getElementById('admin-chat-messages');
        
        messagesDiv.innerHTML = messages.map(msg => `
            <div class="message ${msg.sender}-message">
                <strong>${msg.sender === 'customer' ? 'Customer' : 'Support'}</strong>
                <p>${msg.text}</p>
                <small>${new Date(msg.timestamp).toLocaleTimeString()}</small>
            </div>
        `).join('');
        
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    getChatMessages(sessionId) {
        // Get messages for specific session
        const allMessages = JSON.parse(localStorage.getItem('driizzyy_chat_messages') || '[]');
        return allMessages.filter(msg => msg.sessionId === sessionId);
    }

    setupAdminChatInput(sessionId) {
        const chatInput = document.getElementById('admin-chat-input');
        const sendBtn = document.getElementById('admin-chat-send');
        
        const sendMessage = () => {
            const message = chatInput.value.trim();
            if (message) {
                this.sendAdminChatMessage(sessionId, message);
                chatInput.value = '';
            }
        };
        
        sendBtn.onclick = sendMessage;
        chatInput.onkeypress = (e) => {
            if (e.key === 'Enter') sendMessage();
        };
    }

    sendAdminChatMessage(sessionId, message) {
        // Add message to storage
        const messages = JSON.parse(localStorage.getItem('driizzyy_chat_messages') || '[]');
        messages.push({
            sessionId: sessionId,
            sender: 'admin',
            text: message,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('driizzyy_chat_messages', JSON.stringify(messages));
        
        // Update UI
        this.loadChatHistory(sessionId);
        
        // Send to customer (integrate with live chat system)
        this.notifyCustomerOfResponse(sessionId, message);
    }

    notifyCustomerOfResponse(sessionId, message) {
        // This would send the message to the customer's chat interface
        // For now, simulate by updating the chat widget
        window.dispatchEvent(new CustomEvent('admin-message', {
            detail: { sessionId, message, sender: 'admin' }
        }));
    }

    renderRecentActivity(orders) {
        const recent = orders.slice(-10).reverse();
        return recent.map(order => {
            const timeAgo = this.getTimeAgo(order.timestamp);
            return `
                <div class="activity-item">
                    <div class="activity-info">
                        <strong>${order.orderId}</strong> - ${order.package}
                        <span class="activity-status ${this.getStatusClass(order.status || 'pending')}">
                            ${(order.status || 'pending').toUpperCase()}
                        </span>
                    </div>
                    <div class="activity-time">${timeAgo}</div>
                </div>
            `;
        }).join('');
    }

    renderOrderProgress(status) {
        const steps = ['pending', 'processing', 'completed'];
        const currentIndex = steps.indexOf(status) + 1;
        const progress = Math.min((currentIndex / steps.length) * 100, 100);
        
        return `
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
        `;
    }

    getStatusClass(status) {
        const classes = {
            pending: 'status-pending',
            processing: 'status-processing', 
            completed: 'status-completed',
            cancelled: 'status-cancelled'
        };
        return classes[status] || 'status-pending';
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const orderTime = new Date(timestamp);
        const diffMs = now - orderTime;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        return 'Just now';
    }

    showStatus(message, type) {
        const statusDiv = document.getElementById('login-status');
        statusDiv.innerHTML = message;
        statusDiv.className = `login-status ${type}`;
    }

    logout() {
        localStorage.removeItem('driizzyy_session');
        this.currentUser = null;
        this.isLoggedIn = false;
        this.isAdmin = false;
        
        // Clear chat monitoring
        if (this.chatMonitorInterval) {
            clearInterval(this.chatMonitorInterval);
        }
        
        // Show login form again
        document.getElementById('login-container').classList.remove('hidden');
        document.getElementById('dashboard-container').classList.add('hidden');
        
        // Clear form fields
        document.getElementById('customer-login-value').value = '';
        document.getElementById('admin-password').value = '';
        document.getElementById('login-status').innerHTML = '';
    }
}

// Initialize account system
document.addEventListener('DOMContentLoaded', () => {
    new AccountSystem();
});
