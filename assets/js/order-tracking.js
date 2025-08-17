/**
 * Order Tracking System for Driizzyy Boosts
 * Allows customers to track their boost orders
 */

class OrderTracker {
    constructor() {
        this.trackingEndpoint = 'https://api.driizzyboosts.com/track'; // Replace with actual API
        this.init();
    }

    init() {
        this.createTrackingInterface();
        this.setupEventListeners();
    }

    createTrackingInterface() {
        // Add tracking section to the website
        const trackingSection = document.createElement('section');
        trackingSection.className = 'order-tracking-section';
        trackingSection.innerHTML = `
            <div class="container">
                <h2 class="section-title">📦 Track Your Order</h2>
                <div class="tracking-container">
                    <div class="tracking-form">
                        <div class="form-group">
                            <label for="order-id">Order ID or Discord Username:</label>
                            <input type="text" id="order-id" placeholder="Enter your order ID or Discord username">
                        </div>
                        <button class="btn btn-primary" id="track-order">Track Order</button>
                    </div>
                    <div class="tracking-results" id="tracking-results" style="display: none;">
                        <div class="order-info">
                            <h3>Order Status</h3>
                            <div class="status-timeline">
                                <div class="status-step completed">
                                    <div class="step-icon">✅</div>
                                    <div class="step-info">
                                        <h4>Order Received</h4>
                                        <p>Your order has been received and is being processed</p>
                                        <span class="timestamp">2 minutes ago</span>
                                    </div>
                                </div>
                                <div class="status-step completed">
                                    <div class="step-icon">💳</div>
                                    <div class="step-info">
                                        <h4>Payment Confirmed</h4>
                                        <p>Payment has been successfully processed</p>
                                        <span class="timestamp">1 minute ago</span>
                                    </div>
                                </div>
                                <div class="status-step active">
                                    <div class="step-icon">🚀</div>
                                    <div class="step-info">
                                        <h4>Boosting in Progress</h4>
                                        <p>Your server is currently being boosted</p>
                                        <span class="timestamp">Processing...</span>
                                    </div>
                                </div>
                                <div class="status-step pending">
                                    <div class="step-icon">✨</div>
                                    <div class="step-info">
                                        <h4>Completed</h4>
                                        <p>Your boosts have been successfully applied</p>
                                        <span class="timestamp">Pending</span>
                                    </div>
                                </div>
                            </div>
                            <div class="order-details">
                                <h4>Order Details</h4>
                                <div class="detail-row">
                                    <span>Package:</span>
                                    <span id="order-package">14x Server Boosts (1 Month)</span>
                                </div>
                                <div class="detail-row">
                                    <span>Server ID:</span>
                                    <span id="server-id">123456789012345678</span>
                                </div>
                                <div class="detail-row">
                                    <span>ETA:</span>
                                    <span id="order-eta">2-3 minutes</span>
                                </div>
                                <div class="detail-row">
                                    <span>Support:</span>
                                    <span><a href="#" class="support-link">Contact Support</a></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert after services section
        const servicesSection = document.querySelector('#services');
        if (servicesSection) {
            servicesSection.parentNode.insertBefore(trackingSection, servicesSection.nextSibling);
        }
    }

    setupEventListeners() {
        const trackButton = document.getElementById('track-order');
        const orderIdInput = document.getElementById('order-id');

        trackButton.addEventListener('click', () => {
            this.trackOrder();
        });

        orderIdInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.trackOrder();
            }
        });
    }

    async trackOrder() {
        const orderId = document.getElementById('order-id').value.trim();
        const resultsDiv = document.getElementById('tracking-results');

        if (!orderId) {
            this.showNotification('Please enter an order ID or Discord username', 'error');
            return;
        }

        // Show loading state
        this.showLoadingState();

        try {
            // Simulate API call (replace with actual API)
            const orderData = await this.fetchOrderStatus(orderId);
            
            if (orderData) {
                this.displayOrderStatus(orderData);
                resultsDiv.style.display = 'block';
            } else {
                this.showNotification('Order not found. Please check your order ID or contact support.', 'error');
            }
        } catch (error) {
            console.error('Tracking error:', error);
            this.showNotification('Unable to track order at this time. Please try again later.', 'error');
        }
    }

    async fetchOrderStatus(orderId) {
        try {
            // First check local storage for recent orders
            const localOrder = this.findLocalOrder(orderId);
            if (localOrder) {
                return this.formatOrderData(localOrder);
            }

            // If not found locally, simulate API response for demo
            // In production, this would call your actual API
            return new Promise((resolve) => {
                setTimeout(() => {
                    // Check if the order ID looks like our format
                    if (orderId.startsWith('DB-') && orderId.length >= 10) {
                        // Mock order data based on ID
                        const mockOrder = {
                            id: orderId,
                            package: '14x Server Boosts (1 Month)',
                            serverId: '123456789012345678',
                            status: 'processing',
                            eta: '2-3 minutes',
                            discord: 'User#1234',
                            email: 'user@example.com',
                            price: 8.00,
                            timestamp: new Date().toISOString(),
                            steps: [
                                { id: 'received', completed: true, timestamp: '3 minutes ago', title: 'Order Received' },
                                { id: 'payment', completed: true, timestamp: '2 minutes ago', title: 'Payment Confirmed' },
                                { id: 'processing', completed: false, active: true, timestamp: 'Processing...', title: 'Boosting in Progress' },
                                { id: 'completed', completed: false, timestamp: 'Pending', title: 'Completed' }
                            ]
                        };
                        resolve(mockOrder);
                    } else {
                        // Try to find by Discord username or email
                        const orderByUser = this.findOrderByUserInfo(orderId);
                        if (orderByUser) {
                            resolve(this.formatOrderData(orderByUser));
                        } else {
                            resolve(null); // Order not found
                        }
                    }
                }, 1500);
            });
        } catch (error) {
            console.error('Error fetching order status:', error);
            throw error;
        }
    }

    findLocalOrder(searchTerm) {
        try {
            const orders = JSON.parse(localStorage.getItem('driizzyy_orders') || '[]');
            
            // Search by order ID, Discord username, or email
            return orders.find(order => 
                order.orderId === searchTerm ||
                order.discord.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } catch (error) {
            console.error('Error searching local orders:', error);
            return null;
        }
    }

    findOrderByUserInfo(searchTerm) {
        // This simulates finding an order by username/email in a real database
        const sampleOrders = [
            {
                orderId: 'DB-' + Date.now().toString().slice(-6) + 'SAMPLE',
                package: '14x Server Boosts (1 Month)',
                discord: 'GamerPro#1337',
                email: 'gamer@example.com',
                price: 8.00,
                serverId: '987654321098765432',
                status: 'completed',
                timestamp: new Date(Date.now() - 900000).toISOString() // 15 minutes ago
            }
        ];

        return sampleOrders.find(order => 
            order.discord.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    formatOrderData(order) {
        // Convert stored order to display format
        const timeDiff = Date.now() - new Date(order.timestamp).getTime();
        const minutesAgo = Math.floor(timeDiff / 60000);
        
        let status = 'processing';
        let eta = '2-3 minutes';
        let steps = [
            { id: 'received', completed: true, timestamp: `${minutesAgo + 2} minutes ago`, title: 'Order Received' },
            { id: 'payment', completed: true, timestamp: `${minutesAgo + 1} minutes ago`, title: 'Payment Confirmed' },
            { id: 'processing', completed: false, active: true, timestamp: 'Processing...', title: 'Boosting in Progress' },
            { id: 'completed', completed: false, timestamp: 'Pending', title: 'Completed' }
        ];

        // Update status based on time elapsed
        if (minutesAgo > 10) {
            status = 'completed';
            eta = 'Completed';
            steps = [
                { id: 'received', completed: true, timestamp: `${minutesAgo + 2} minutes ago`, title: 'Order Received' },
                { id: 'payment', completed: true, timestamp: `${minutesAgo + 1} minutes ago`, title: 'Payment Confirmed' },
                { id: 'processing', completed: true, timestamp: `${minutesAgo} minutes ago`, title: 'Boosting in Progress' },
                { id: 'completed', completed: true, active: false, timestamp: `${minutesAgo - 2} minutes ago`, title: 'Completed' }
            ];
        }

        return {
            id: order.orderId,
            package: order.package,
            serverId: order.serverId || 'Not provided',
            status: status,
            eta: eta,
            discord: order.discord,
            email: order.email,
            price: order.price,
            steps: steps
        };
    }

    showLoadingState() {
        const trackButton = document.getElementById('track-order');
        const originalText = trackButton.textContent;
        
        trackButton.textContent = 'Tracking...';
        trackButton.disabled = true;
        
        setTimeout(() => {
            trackButton.textContent = originalText;
            trackButton.disabled = false;
        }, 2000);
    }

    displayOrderStatus(orderData) {
        // Update order details
        document.getElementById('order-package').textContent = orderData.package;
        document.getElementById('server-id').textContent = orderData.serverId;
        document.getElementById('order-eta').textContent = orderData.eta;

        // Add additional order details
        const orderDetailsDiv = document.querySelector('.order-details');
        
        // Clear existing extra details
        const existingExtraDetails = orderDetailsDiv.querySelectorAll('.extra-detail');
        existingExtraDetails.forEach(detail => detail.remove());

        // Add new details
        const extraDetails = [
            { label: 'Order ID', value: orderData.id, className: 'order-id-detail' },
            { label: 'Discord User', value: orderData.discord || 'Not provided' },
            { label: 'Email', value: orderData.email || 'Not provided' },
            { label: 'Price', value: `$${orderData.price ? orderData.price.toFixed(2) : 'N/A'}` }
        ];

        extraDetails.forEach(detail => {
            const detailRow = document.createElement('div');
            detailRow.className = `detail-row extra-detail ${detail.className || ''}`;
            detailRow.innerHTML = `
                <span>${detail.label}:</span>
                <span>${detail.value}</span>
            `;
            
            // Insert before support link
            const supportRow = orderDetailsDiv.querySelector('.detail-row:last-child');
            orderDetailsDiv.insertBefore(detailRow, supportRow);
        });

        // Update status timeline
        const steps = document.querySelectorAll('.status-step');
        
        if (orderData.steps && orderData.steps.length === steps.length) {
            steps.forEach((step, index) => {
                const stepData = orderData.steps[index];
                
                // Reset classes
                step.classList.remove('completed', 'active', 'pending');
                
                if (stepData.completed) {
                    step.classList.add('completed');
                } else if (stepData.active) {
                    step.classList.add('active');
                } else {
                    step.classList.add('pending');
                }
                
                // Update step title and timestamp
                const stepTitle = step.querySelector('.step-info h4');
                const timestamp = step.querySelector('.timestamp');
                
                if (stepTitle && stepData.title) {
                    stepTitle.textContent = stepData.title;
                }
                
                if (timestamp) {
                    timestamp.textContent = stepData.timestamp;
                }
            });
        }

        // Add copy order ID functionality
        const orderIdDetail = document.querySelector('.order-id-detail span:last-child');
        if (orderIdDetail) {
            orderIdDetail.style.cursor = 'pointer';
            orderIdDetail.title = 'Click to copy Order ID';
            orderIdDetail.addEventListener('click', () => {
                navigator.clipboard.writeText(orderData.id).then(() => {
                    this.showNotification('Order ID copied to clipboard!', 'success');
                }).catch(() => {
                    this.showNotification('Failed to copy Order ID', 'error');
                });
            });
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }
}

// Advanced Analytics Tracker
class AnalyticsTracker {
    constructor() {
        this.events = [];
        this.sessionData = {
            startTime: Date.now(),
            pageViews: 0,
            interactions: 0,
            location: null
        };
        this.init();
    }

    init() {
        this.trackPageView();
        this.setupInteractionTracking();
        this.trackUserLocation();
    }

    trackPageView() {
        this.sessionData.pageViews++;
        this.trackEvent('page_view', {
            url: window.location.href,
            timestamp: Date.now(),
            userAgent: navigator.userAgent
        });
    }

    setupInteractionTracking() {
        // Track button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn, .nav-link, .order-btn')) {
                this.trackInteraction('click', e.target);
            }
        });

        // Track form submissions
        document.addEventListener('submit', (e) => {
            this.trackInteraction('form_submit', e.target);
        });

        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll % 25 === 0) { // Track every 25%
                    this.trackEvent('scroll_depth', { percent: maxScroll });
                }
            }
        });
    }

    trackInteraction(type, element) {
        this.sessionData.interactions++;
        this.trackEvent('interaction', {
            type: type,
            element: element.tagName,
            classes: element.className,
            text: element.textContent?.slice(0, 50),
            timestamp: Date.now()
        });
    }

    trackUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.sessionData.location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    };
                    this.trackEvent('location_acquired', this.sessionData.location);
                },
                (error) => {
                    console.log('Location tracking declined or failed');
                }
            );
        }
    }

    trackEvent(eventName, data) {
        const event = {
            name: eventName,
            data: data,
            timestamp: Date.now(),
            sessionId: this.getSessionId()
        };
        
        this.events.push(event);
        
        // Send to analytics service (replace with actual service)
        this.sendToAnalytics(event);
    }

    sendToAnalytics(event) {
        // Replace with actual analytics service
        if (window.gtag) {
            gtag('event', event.name, event.data);
        }
        
        // Log for development
        console.log('📊 Analytics Event:', event);
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('driizzy_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('driizzy_session_id', sessionId);
        }
        return sessionId;
    }

    getSessionSummary() {
        return {
            ...this.sessionData,
            duration: Date.now() - this.sessionData.startTime,
            events: this.events.length
        };
    }
}

// Order Management System for Admins
class OrderManagementSystem {
    constructor() {
        this.init();
    }

    init() {
        // Check for admin access (simple check - in production use proper authentication)
        if (window.location.hash === '#admin' || localStorage.getItem('driizzyy_admin') === 'true') {
            this.createAdminPanel();
        }
    }

    createAdminPanel() {
        const adminPanel = document.createElement('div');
        adminPanel.className = 'admin-panel';
        adminPanel.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: #36393f;
            border: 2px solid #5865f2;
            border-radius: 10px;
            padding: 20px;
            z-index: 10002;
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        `;
        
        adminPanel.innerHTML = `
            <div style="color: white; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #5865f2;">🔧 Order Management</h3>
                <small style="color: #b9bbbe;">Admin Panel</small>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="color: #b9bbbe; display: block; margin-bottom: 5px;">Order ID:</label>
                <input type="text" id="admin-order-id" placeholder="DB-XXXXXXXX" style="width: 100%; padding: 8px; background: #2c2f33; border: 1px solid #5865f2; color: white; border-radius: 5px;">
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="color: #b9bbbe; display: block; margin-bottom: 5px;">Status:</label>
                <select id="admin-order-status" style="width: 100%; padding: 8px; background: #2c2f33; border: 1px solid #5865f2; color: white; border-radius: 5px;">
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>
            
            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                <button id="admin-update-order" style="flex: 1; padding: 8px; background: #5865f2; color: white; border: none; border-radius: 5px; cursor: pointer;">Update Order</button>
                <button id="admin-send-webhook" style="flex: 1; padding: 8px; background: #57f287; color: white; border: none; border-radius: 5px; cursor: pointer;">Send Update</button>
            </div>
            
            <div style="margin-bottom: 15px;">
                <button id="admin-list-orders" style="width: 100%; padding: 8px; background: #fee75c; color: #2c2f33; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">List All Orders</button>
            </div>
            
            <div style="text-align: center;">
                <button id="admin-close" style="padding: 5px 15px; background: #ed4245; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
            </div>
            
            <div id="admin-status" style="margin-top: 15px; padding: 10px; background: #2c2f33; border-radius: 5px; color: #b9bbbe; font-size: 12px; max-height: 200px; overflow-y: auto;"></div>
        `;

        document.body.appendChild(adminPanel);
        this.setupAdminEventListeners(adminPanel);
    }

    setupAdminEventListeners(panel) {
        // Close panel
        panel.querySelector('#admin-close').addEventListener('click', () => {
            panel.remove();
        });

        // Update order status
        panel.querySelector('#admin-update-order').addEventListener('click', () => {
            this.updateOrderStatus(panel);
        });

        // Send webhook update
        panel.querySelector('#admin-send-webhook').addEventListener('click', () => {
            this.sendOrderUpdateWebhook(panel);
        });

        // List all orders
        panel.querySelector('#admin-list-orders').addEventListener('click', () => {
            this.listAllOrders(panel);
        });
    }

    updateOrderStatus(panel) {
        const orderId = panel.querySelector('#admin-order-id').value.trim();
        const status = panel.querySelector('#admin-order-status').value;
        const statusDiv = panel.querySelector('#admin-status');

        if (!orderId) {
            statusDiv.innerHTML = '❌ Please enter an Order ID';
            return;
        }

        try {
            // Update local storage
            const orders = JSON.parse(localStorage.getItem('driizzyy_orders') || '[]');
            const orderIndex = orders.findIndex(order => order.orderId === orderId);

            if (orderIndex !== -1) {
                orders[orderIndex].status = status;
                orders[orderIndex].lastUpdated = new Date().toISOString();
                localStorage.setItem('driizzyy_orders', JSON.stringify(orders));
                
                statusDiv.innerHTML = `✅ Order ${orderId} updated to: ${status}`;
            } else {
                statusDiv.innerHTML = `⚠️ Order ${orderId} not found in local storage`;
            }
        } catch (error) {
            statusDiv.innerHTML = `❌ Error updating order: ${error.message}`;
        }
    }

    async sendOrderUpdateWebhook(panel) {
        const orderId = panel.querySelector('#admin-order-id').value.trim();
        const status = panel.querySelector('#admin-order-status').value;
        const statusDiv = panel.querySelector('#admin-status');

        if (!orderId) {
            statusDiv.innerHTML = '❌ Please enter an Order ID';
            return;
        }

        try {
            // Load site configuration
            const response = await fetch('config/site.json');
            const siteData = await response.json();
            
            if (!siteData.shop.webhook_url) {
                statusDiv.innerHTML = '❌ Webhook URL not configured';
                return;
            }

            // Find order details
            const orders = JSON.parse(localStorage.getItem('driizzyy_orders') || '[]');
            const order = orders.find(o => o.orderId === orderId);

            const embed = {
                title: "📋 Order Status Update",
                color: status === 'completed' ? 3066993 : status === 'cancelled' ? 15158332 : 16776960,
                fields: [
                    {
                        name: "🆔 Order ID",
                        value: `\`${orderId}\``,
                        inline: true
                    },
                    {
                        name: "📊 Status",
                        value: status.toUpperCase(),
                        inline: true
                    },
                    {
                        name: "⏰ Updated",
                        value: new Date().toLocaleString(),
                        inline: true
                    }
                ],
                footer: {
                    text: "Driizzyy Boosts - Order Management System"
                }
            };

            if (order) {
                embed.fields.push(
                    {
                        name: "👤 Customer",
                        value: order.discord,
                        inline: true
                    },
                    {
                        name: "📦 Package",
                        value: order.package,
                        inline: true
                    }
                );
            }

            const payload = {
                username: "Driizzyy Boosts - Admin System",
                embeds: [embed]
            };

            const webhookResponse = await fetch(siteData.shop.webhook_url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (webhookResponse.ok) {
                statusDiv.innerHTML = `✅ Update sent to Discord for order ${orderId}`;
            } else {
                statusDiv.innerHTML = `❌ Failed to send webhook (${webhookResponse.status})`;
            }

        } catch (error) {
            statusDiv.innerHTML = `❌ Error: ${error.message}`;
        }
    }

    listAllOrders(panel) {
        const statusDiv = panel.querySelector('#admin-status');
        
        try {
            const orders = JSON.parse(localStorage.getItem('driizzyy_orders') || '[]');
            
            if (orders.length === 0) {
                statusDiv.innerHTML = '📋 No orders found in local storage';
                return;
            }

            let ordersList = `📋 <strong>All Orders (${orders.length}):</strong><br><br>`;
            
            orders.reverse().forEach((order, index) => {
                const timeAgo = this.getTimeAgo(order.timestamp);
                ordersList += `
                    <div style="margin-bottom: 10px; padding: 8px; background: #40444b; border-radius: 5px;">
                        <strong>${order.orderId}</strong><br>
                        <small>👤 ${order.discord} | 📦 ${order.package} | 💰 $${order.price}<br>
                        📅 ${timeAgo} | 📊 ${order.status || 'pending'}</small>
                    </div>
                `;
            });

            statusDiv.innerHTML = ordersList;
        } catch (error) {
            statusDiv.innerHTML = `❌ Error loading orders: ${error.message}`;
        }
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
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        this.monitorPageLoad();
        this.monitorInteractions();
        this.reportMetrics();
    }

    monitorPageLoad() {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            this.metrics.pageLoad = {
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                totalTime: perfData.loadEventEnd - perfData.fetchStart
            };
        });
    }

    monitorInteractions() {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'measure') {
                    this.metrics[entry.name] = entry.duration;
                }
            }
        });
        observer.observe({ entryTypes: ['measure'] });
    }

    measureInteraction(name, callback) {
        const startMark = `${name}-start`;
        const endMark = `${name}-end`;
        const measureName = `${name}-duration`;

        performance.mark(startMark);
        
        const result = callback();
        
        if (result instanceof Promise) {
            return result.finally(() => {
                performance.mark(endMark);
                performance.measure(measureName, startMark, endMark);
            });
        } else {
            performance.mark(endMark);
            performance.measure(measureName, startMark, endMark);
            return result;
        }
    }

    reportMetrics() {
        setTimeout(() => {
            console.log('🚀 Performance Metrics:', this.metrics);
            
            // Report slow operations
            Object.entries(this.metrics).forEach(([name, duration]) => {
                if (duration > 1000) { // Slower than 1 second
                    console.warn(`⚠️ Slow operation detected: ${name} took ${duration}ms`);
                }
            });
        }, 5000);
    }
}

// Initialize all enhanced systems
document.addEventListener('DOMContentLoaded', () => {
    new OrderTracker();
    new AnalyticsTracker();
    new PerformanceMonitor();
    new OrderManagementSystem(); // Admin panel for order management
});
