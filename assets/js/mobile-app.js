/**
 * Mobile App Promotion and PWA Features
 * Adds mobile app functionality and Progressive Web App capabilities
 */

class MobileAppFeatures {
    constructor() {
        this.init();
    }

    init() {
        this.createAppSection();
        this.setupPWA();
        this.setupMobileOptimizations();
    }

    createAppSection() {
        const appSection = document.createElement('section');
        appSection.className = 'mobile-app-section';
        appSection.innerHTML = `
            <div class="container">
                <div class="app-content">
                    <div class="app-info">
                        <div class="app-badge">
                            <i class="fas fa-mobile-alt"></i>
                            <span>Coming Soon</span>
                        </div>
                        <h2>📱 Driizzyy Boosts Mobile App</h2>
                        <p>Get the ultimate Discord boosting experience on your mobile device. Order, track, and manage your boosts on the go!</p>
                        
                        <div class="app-features">
                            <div class="feature-item">
                                <i class="fas fa-bolt"></i>
                                <div>
                                    <h4>Instant Ordering</h4>
                                    <p>Order boosts with just a few taps</p>
                                </div>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-bell"></i>
                                <div>
                                    <h4>Push Notifications</h4>
                                    <p>Get notified when your boosts are applied</p>
                                </div>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-chart-line"></i>
                                <div>
                                    <h4>Real-time Tracking</h4>
                                    <p>Monitor your boost status live</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="app-download-buttons">
                            <button class="app-btn ios-btn" disabled>
                                <i class="fab fa-apple"></i>
                                <div>
                                    <small>Download on the</small>
                                    <strong>App Store</strong>
                                </div>
                            </button>
                            <button class="app-btn android-btn" disabled>
                                <i class="fab fa-google-play"></i>
                                <div>
                                    <small>Get it on</small>
                                    <strong>Google Play</strong>
                                </div>
                            </button>
                            <button class="app-btn pwa-btn" id="install-pwa" style="display: none;">
                                <i class="fas fa-download"></i>
                                <div>
                                    <small>Install</small>
                                    <strong>Web App</strong>
                                </div>
                            </button>
                        </div>
                        
                        <div class="notify-signup">
                            <h4>🔔 Get Notified When Ready</h4>
                            <div class="notify-form">
                                <input type="email" placeholder="Enter your email" id="app-notify-email">
                                <button class="btn btn-primary" id="app-notify-btn">Notify Me</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="app-preview">
                        <div class="phone-mockup">
                            <div class="phone-frame">
                                <div class="phone-screen">
                                    <div class="app-interface">
                                        <div class="app-header">
                                            <div class="status-bar">
                                                <span>9:41</span>
                                                <div class="status-icons">
                                                    <i class="fas fa-signal"></i>
                                                    <i class="fas fa-wifi"></i>
                                                    <i class="fas fa-battery-three-quarters"></i>
                                                </div>
                                            </div>
                                            <div class="app-nav">
                                                <h3>Driizzyy Boosts</h3>
                                                <i class="fas fa-user-circle"></i>
                                            </div>
                                        </div>
                                        <div class="app-content-area">
                                            <div class="quick-stats">
                                                <div class="stat-card">
                                                    <strong>5</strong>
                                                    <span>Active Boosts</span>
                                                </div>
                                                <div class="stat-card">
                                                    <strong>23</strong>
                                                    <span>Total Orders</span>
                                                </div>
                                            </div>
                                            <div class="order-card">
                                                <div class="order-status processing">
                                                    <div class="status-dot"></div>
                                                    <span>Processing</span>
                                                </div>
                                                <h4>14x Server Boosts</h4>
                                                <p>ETA: 2-3 minutes</p>
                                                <div class="progress-bar">
                                                    <div class="progress" style="width: 60%"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert before footer
        const footer = document.querySelector('footer');
        footer.parentNode.insertBefore(appSection, footer);

        // Setup event listeners
        this.setupAppEventListeners();
    }

    setupAppEventListeners() {
        // Email notification signup
        const notifyBtn = document.getElementById('app-notify-btn');
        const emailInput = document.getElementById('app-notify-email');

        notifyBtn.addEventListener('click', () => {
            const email = emailInput.value.trim();
            if (this.validateEmail(email)) {
                this.handleNotifySignup(email);
            } else {
                this.showNotification('Please enter a valid email address', 'error');
            }
        });

        emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                notifyBtn.click();
            }
        });
    }

    setupPWA() {
        // Register service worker
        if ('serviceWorker' in navigator) {
            this.registerServiceWorker();
        }

        // Setup install prompt
        this.setupInstallPrompt();

        // Add PWA manifest if not exists
        this.addPWAManifest();
    }

    async registerServiceWorker() {
        try {
            // Create a basic service worker
            this.createServiceWorker();
            
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered:', registration);
        } catch (error) {
            console.log('Service Worker registration failed:', error);
        }
    }

    createServiceWorker() {
        const swContent = `
const CACHE_NAME = 'driizzyy-boosts-v1';
const urlsToCache = [
    '/',
    '/assets/css/styles.css',
    '/assets/css/enhanced-styles.css',
    '/assets/js/main.js',
    '/assets/js/enhanced-features.js',
    '/config/site.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});
        `;

        // This would typically be a separate file
        console.log('Service Worker content ready');
    }

    setupInstallPrompt() {
        let deferredPrompt;
        const installBtn = document.getElementById('install-pwa');

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            installBtn.style.display = 'flex';
        });

        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User ${outcome} the install prompt`);
                deferredPrompt = null;
                installBtn.style.display = 'none';
            }
        });
    }

    addPWAManifest() {
        const manifest = {
            "name": "Driizzyy Boosts - Discord Boosting",
            "short_name": "Driizzyy Boosts",
            "description": "Premium Discord server boosting services",
            "start_url": "/",
            "display": "standalone",
            "background_color": "#0f0f0f",
            "theme_color": "#5865f2",
            "icons": [
                {
                    "src": "assets/images/icon-192.png",
                    "sizes": "192x192",
                    "type": "image/png"
                },
                {
                    "src": "assets/images/icon-512.png",
                    "sizes": "512x512",
                    "type": "image/png"
                }
            ]
        };

        // Check if manifest link exists
        if (!document.querySelector('link[rel="manifest"]')) {
            const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
            const manifestURL = URL.createObjectURL(manifestBlob);
            
            const link = document.createElement('link');
            link.rel = 'manifest';
            link.href = manifestURL;
            document.head.appendChild(link);
        }
    }

    setupMobileOptimizations() {
        // Improve mobile performance
        this.setupLazyLoading();
        this.setupTouchOptimizations();
        this.setupMobileDetection();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    setupTouchOptimizations() {
        // Add touch-friendly interactions
        document.addEventListener('touchstart', function() {}, {passive: true});
        
        // Improve button touch targets
        const buttons = document.querySelectorAll('.btn, .nav-link, .order-btn');
        buttons.forEach(btn => {
            btn.style.minHeight = '44px';
            btn.style.minWidth = '44px';
        });
    }

    setupMobileDetection() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            document.body.classList.add('mobile-device');
            
            // Mobile-specific optimizations
            this.addMobileStyles();
        }
    }

    addMobileStyles() {
        const mobileCSS = `
            .mobile-device .hero-subtitle {
                font-size: 16px !important;
            }
            .mobile-device .btn {
                padding: 12px 20px !important;
                font-size: 16px !important;
            }
            .mobile-device .chat-panel {
                bottom: 10px !important;
                right: 10px !important;
                left: 10px !important;
                width: auto !important;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = mobileCSS;
        document.head.appendChild(style);
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    async handleNotifySignup(email) {
        try {
            // Simulate API call to save email
            const response = await this.saveNotificationEmail(email);
            
            if (response.success) {
                this.showNotification('✅ Thanks! We\'ll notify you when the app is ready.', 'success');
                document.getElementById('app-notify-email').value = '';
            } else {
                this.showNotification('Failed to sign up. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Signup error:', error);
            this.showNotification('Failed to sign up. Please try again.', 'error');
        }
    }

    async saveNotificationEmail(email) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 1000);
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);

        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }
}

// Initialize mobile app features
document.addEventListener('DOMContentLoaded', () => {
    new MobileAppFeatures();
});
