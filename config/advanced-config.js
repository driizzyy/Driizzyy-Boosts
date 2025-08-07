// Advanced Configuration for Driizzyy Boosts Website
// This file contains advanced features and customization options

window.DriizzyConfig = {
    // Performance monitoring
    performance: {
        enabled: true,
        trackPageLoad: true,
        trackUserInteractions: true,
        reportThreshold: 3000, // ms
        enableConsoleLogging: false
    },

    // Particle system configuration
    particles: {
        enabled: true,
        count: 50,
        speed: 0.5,
        size: {
            min: 1,
            max: 3
        },
        color: {
            primary: '#5865f2',
            secondary: '#57f287',
            accent: '#fee75c'
        },
        connections: {
            enabled: true,
            distance: 100,
            opacity: 0.3
        }
    },

    // Animation preferences
    animations: {
        enabled: true,
        reducedMotion: false,
        duration: {
            fast: 200,
            normal: 300,
            slow: 500
        },
        easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
    },

    // Form validation settings
    validation: {
        realTime: true,
        showSuccessStates: true,
        customMessages: {
            required: 'This field is required',
            email: 'Please enter a valid email address',
            discord: 'Please enter a valid Discord tag (Username#1234)',
            phone: 'Please enter a valid phone number',
            url: 'Please enter a valid URL'
        }
    },

    // Notification system
    notifications: {
        enabled: true,
        position: 'top-right', // top-right, top-left, bottom-right, bottom-left
        autoHide: true,
        hideDelay: 5000,
        showIcons: true,
        allowDismiss: true
    },

    // Counter animations
    counters: {
        enabled: true,
        duration: 1000,
        fps: 60,
        formatNumbers: true,
        useIntersectionObserver: true
    },

    // Scroll effects
    scrollEffects: {
        enabled: true,
        parallax: true,
        fadeIn: true,
        slideIn: true,
        threshold: 0.1
    },

    // Navigation behavior
    navigation: {
        stickyHeader: true,
        smoothScroll: true,
        highlightActiveSection: true,
        mobileMenuOverlay: true
    },

    // Theme preferences
    theme: {
        respectSystemPreference: true,
        allowToggle: false, // Currently single theme
        customProperties: {
            primaryColor: '#5865f2',
            secondaryColor: '#57f287',
            accentColor: '#fee75c',
            backgroundColor: '#1a1a1a',
            surfaceColor: '#2a2a2a',
            textColor: '#ffffff'
        }
    },

    // SEO and analytics
    seo: {
        structuredData: true,
        openGraph: true,
        twitterCards: true,
        canonicalUrls: true
    },

    // Security settings
    security: {
        sanitizeInputs: true,
        preventXSS: true,
        validateFormData: true,
        rateLimiting: false // Handled server-side
    },

    // Feature flags
    features: {
        chatWidget: false,
        testimonialSlider: true,
        productComparison: true,
        livePricing: false,
        orderTracking: false,
        paymentIntegration: false
    },

    // Debug options (development only)
    debug: {
        enabled: false, // Set to true during development
        verboseLogging: false,
        showBoundingBoxes: false,
        performanceOverlay: false
    },

    // Accessibility settings
    accessibility: {
        enableSkipLinks: true,
        respectReducedMotion: true,
        highContrastSupport: true,
        keyboardNavigation: true,
        screenReaderOptimizations: true,
        focusManagement: true
    },

    // Social media integration
    social: {
        discordInvite: 'https://discord.gg/driizzyyboosts',
        twitterHandle: '@driizzyboosts',
        instagramHandle: '@driizzyboosts',
        shareButtons: true,
        embedDiscordWidget: false
    },

    // Contact information
    contact: {
        email: 'support@driizzyboosts.com',
        discord: 'drakko5.56',
        businessHours: {
            timezone: 'EST',
            weekdays: '6:00 AM - 1:00 PM',
            weekends: '5:30 AM - 1:00 PM'
        },
        responseTime: 'Usually within 1-4 hours'
    },

    // Payment and pricing
    pricing: {
        currency: 'USD',
        showOriginalPrices: false,
        highlightSavings: true,
        acceptedMethods: ['PayPal', 'Stripe', 'Crypto'],
        minimumOrder: 5.00
    }
};

// Initialize configuration on load
document.addEventListener('DOMContentLoaded', () => {
    // Apply any configuration-based settings
    if (window.DriizzyConfig.debug.enabled) {
        console.log('🚀 Driizzyy Boosts Advanced Config Loaded', window.DriizzyConfig);
    }

    // Apply theme customizations
    if (window.DriizzyConfig.theme.customProperties) {
        const root = document.documentElement;
        const theme = window.DriizzyConfig.theme.customProperties;
        
        Object.entries(theme).forEach(([key, value]) => {
            const cssProperty = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            root.style.setProperty(cssProperty, value);
        });
    }

    // Apply accessibility settings
    if (window.DriizzyConfig.accessibility.respectReducedMotion) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (prefersReducedMotion.matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
        }
    }

    // Apply performance monitoring
    if (window.DriizzyConfig.performance.enabled && window.DriizzyConfig.performance.trackPageLoad) {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            if (loadTime > window.DriizzyConfig.performance.reportThreshold) {
                console.warn(`⚠️ Page load time: ${loadTime.toFixed(2)}ms (above threshold)`);
            }
        });
    }
});
