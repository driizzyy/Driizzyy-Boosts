/**
 * DRIIZZYY BOOSTS - ADVANCED PROFESSIONAL JAVASCRIPT
 * Advanced features and interactions for the Discord boosting platform
 */

class DriizzyBoosts {
    constructor() {
        this.isInitialized = false;
        this.observers = new Map();
        this.siteData = null;
        this.config = {
            api: {
                endpoint: '/api/v1',
                timeout: 30000
            },
            animations: {
                duration: 300,
                easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
            },
            features: {
                particleSystem: true,
                advancedAnalytics: true,
                realTimeUpdates: true
            }
        };
        
        this.init();
    }

    // ===== INITIALIZATION ===== //
    async init() {
        if (this.isInitialized) return;
        
        document.addEventListener('DOMContentLoaded', async () => {
            try {
                // Load site configuration first
                await this.loadSiteData();
                
                // Initialize components
                this.setupEventListeners();
                this.initializeComponents();
                this.setupAdvancedFeatures();
                
                // Populate dynamic content
                this.populateDynamicContent();
                
                this.isInitialized = true;
                console.log('🚀 Driizzyy Boosts initialized successfully!');
            } catch (error) {
                console.error('❌ Failed to initialize:', error);
            }
        });
    }

    // ===== LOAD SITE DATA ===== //
    async loadSiteData() {
        try {
            const response = await fetch('config/site.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.siteData = await response.json();
            console.log('✅ Site data loaded successfully');
        } catch (error) {
            console.error('❌ Failed to load site data:', error);
            this.siteData = null;
        }
    }

    // ===== POPULATE DYNAMIC CONTENT ===== //
    populateDynamicContent() {
        if (!this.siteData) return;

        this.populatePricingSection();
        this.populateContactInfo();
        console.log('✅ Dynamic content populated');
    }

    // ===== POPULATE PRICING SECTION ===== //
    populatePricingSection() {
        const pricingSection = document.querySelector('#pricing .container');
        if (!pricingSection || !this.siteData.services) return;

        // Clear existing content except title
        const title = pricingSection.querySelector('.section-title');
        const newContent = document.createElement('div');
        newContent.appendChild(title.cloneNode(true));

        // 1 Month Server Boosts
        this.createPricingCategory(newContent, '1 Month Server Boosts', this.siteData.services.server_boosts_1month);
        
        // 3 Month Server Boosts  
        this.createPricingCategory(newContent, '3 Month Server Boosts', this.siteData.services.server_boosts_3month);
        
        // Discord Nitro Gifts
        this.createPricingCategory(newContent, 'Discord Nitro Gifts', this.siteData.services.nitro_gifts);

        // Replace content
        pricingSection.innerHTML = newContent.innerHTML;
    }

    // ===== CREATE PRICING CATEGORY ===== //
    createPricingCategory(container, categoryTitle, services) {
        if (!services || services.length === 0) return;

        const categoryHeader = document.createElement('h3');
        categoryHeader.className = 'pricing-category';
        categoryHeader.textContent = categoryTitle;
        container.appendChild(categoryHeader);

        const pricingGrid = document.createElement('div');
        pricingGrid.className = 'pricing-grid';

        services.forEach(service => {
            const card = this.createPricingCard(service);
            pricingGrid.appendChild(card);
        });

        container.appendChild(pricingGrid);
    }

    // ===== CREATE PRICING CARD ===== //
    createPricingCard(service) {
        const card = document.createElement('div');
        card.className = `pricing-card ${service.popular ? 'featured' : ''}`;

        const popularBadge = service.popular ? 
            `<div class="popular-badge">${service.popular === true ? 'Most Popular' : service.popular}</div>` : '';

        card.innerHTML = `
            ${popularBadge}
            <div class="pricing-header">
                <h4>${service.name}</h4>
                <div class="price">
                    <span class="currency">$</span>
                    <span class="amount">${service.price}</span>
                    <span class="period">${service.type === 'gift_code' ? 'gift code' : 'one-time'}</span>
                </div>
            </div>
            <ul class="pricing-features">
                ${service.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                <li><i class="fas fa-times"></i> No Refunds - All Sales Final</li>
            </ul>
            <button class="btn btn-primary" onclick="driizzyBoosts.orderService('${service.name}', ${service.price})">Order Now</button>
        `;

        return card;
    }

    // ===== POPULATE CONTACT INFO ===== //
    populateContactInfo() {
        if (!this.siteData.business) return;

        // Update contact information
        const discordElement = document.querySelector('[href*="discord"], .contact-method:has(.fa-discord)');
        if (discordElement) {
            const discordText = discordElement.querySelector('p, span');
            if (discordText) discordText.textContent = this.siteData.business.discord;
        }

        const emailElement = document.querySelector('[href*="mailto"], .contact-method:has(.fa-envelope)');  
        if (emailElement) {
            const emailText = emailElement.querySelector('p, span');
            if (emailText) emailText.textContent = this.siteData.business.email;
        }

        const responseTimeElement = document.querySelector('.contact-method:has(.fa-clock)');
        if (responseTimeElement) {
            const responseText = responseTimeElement.querySelector('p, span');
            if (responseText) responseText.textContent = this.siteData.business.response_time;
        }
    }

    // ===== ORDER SERVICE ===== //
    orderService(serviceName, price) {
        // Scroll to contact form
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
            
            // Pre-fill the service field
            setTimeout(() => {
                const serviceSelect = document.querySelector('#service');
                if (serviceSelect) {
                    const options = serviceSelect.querySelectorAll('option');
                    options.forEach(option => {
                        if (option.textContent.includes(serviceName) || option.textContent.includes(`$${price}`)) {
                            serviceSelect.value = option.value;
                        }
                    });
                }
            }, 500);
        }
        
        this.showNotification(`Selected ${serviceName} - Contact us to complete your order!`, 'info');
    }

    // ===== EVENT LISTENERS ===== //
    setupEventListeners() {
        // Navigation
        this.setupNavigation();
        
        // Smooth scrolling
        this.setupSmoothScrolling();
        
        // Form handling
        this.setupFormHandling();
        
        // Advanced interactions
        this.setupAdvancedInteractions();
        
        // Performance monitoring
        this.setupPerformanceMonitoring();
    }

    // ===== NAVIGATION SYSTEM ===== //
    setupNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const navbar = document.querySelector('.navbar');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.classList.toggle('nav-open');
            });

            // Close mobile menu when clicking on a link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('nav-open');
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('nav-open');
                }
            });
        }

        // Advanced navbar scroll behavior
        let lastScrollTop = 0;
        let scrollTimer = null;

        window.addEventListener('scroll', () => {
            if (scrollTimer) clearTimeout(scrollTimer);
            
            scrollTimer = setTimeout(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (navbar) {
                    if (scrollTop > 100) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }

                    // Hide/show navbar on scroll
                    if (scrollTop > lastScrollTop && scrollTop > 200) {
                        navbar.style.transform = 'translateY(-100%)';
                    } else {
                        navbar.style.transform = 'translateY(0)';
                    }
                }
                
                lastScrollTop = scrollTop;
            }, 10);
        }, { passive: true });
    }

    // ===== SMOOTH SCROLLING ===== //
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Add analytics event
                    this.trackEvent('navigation', 'scroll_to_section', anchor.getAttribute('href'));
                }
            });
        });
    }

    // ===== COMPONENT INITIALIZATION ===== //
    initializeComponents() {
        this.initializeAnimations();
        this.initializeCounters();
        this.initializeParticleSystem();
        this.initializeAdvancedPricing();
        this.initializeAdvancedFAQ();
        this.initializeLoadingStates();
        this.initializeTooltips();
        this.initializeModalSystem();
    }

    // ===== ADVANCED ANIMATIONS ===== //
    initializeAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Add stagger effect for grid items
                    if (entry.target.classList.contains('feature-card') || 
                        entry.target.classList.contains('service-card') ||
                        entry.target.classList.contains('pricing-card')) {
                        
                        const siblings = Array.from(entry.target.parentElement.children);
                        const index = siblings.indexOf(entry.target);
                        
                        setTimeout(() => {
                            entry.target.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
                        }, 50);
                    }
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.feature-card, .service-card, .pricing-card, .testimonial-card')
            .forEach(el => animationObserver.observe(el));

        this.observers.set('animation', animationObserver);
    }

    // ===== COUNTER ANIMATIONS ===== //
    initializeCounters() {
        const counterElements = document.querySelectorAll('.stat-number[data-target]');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counterElements.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    animateCounter(element) {
        // Prevent re-animation if already animated
        if (element.classList.contains('animated')) return;
        element.classList.add('animated');
        
        const target = parseFloat(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current >= target) {
                current = target;
                if (target === 99.9) {
                    element.textContent = '99.9';
                } else if (target >= 1000) {
                    element.textContent = Math.floor(target / 1000) + 'K+';
                } else {
                    element.textContent = target.toLocaleString() + '+';
                }
            } else {
                if (target === 99.9) {
                    element.textContent = current.toFixed(1);
                } else if (target >= 1000) {
                    element.textContent = Math.floor(current / 1000) + 'K+';
                } else {
                    element.textContent = Math.floor(current).toLocaleString() + '+';
                }
                requestAnimationFrame(updateCounter);
            }
        };

        updateCounter();
    }

    // ===== PARTICLE SYSTEM ===== //
    initializeParticleSystem() {
        if (!this.config.features.particleSystem) return;

        const hero = document.querySelector('.hero');
        if (!hero) return;

        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.opacity = '0.6';
        
        hero.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let particles = [];

        // Resize canvas
        const resizeCanvas = () => {
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.5 + 0.3;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(88, 101, 242, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Create particles
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // Draw connections
            particles.forEach((particle, i) => {
                particles.slice(i + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.strokeStyle = `rgba(88, 101, 242, ${0.3 * (1 - distance / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(animate);
        };

        animate();
    }

    // ===== ADVANCED PRICING SYSTEM ===== //
    initializeAdvancedPricing() {
        const pricingToggle = document.getElementById('pricing-toggle');
        const monthlyPrices = document.querySelectorAll('.monthly-price');
        const yearlyPrices = document.querySelectorAll('.yearly-price');
        const monthlyPeriods = document.querySelectorAll('.monthly-period');
        const yearlyPeriods = document.querySelectorAll('.yearly-period');

        if (pricingToggle) {
            pricingToggle.addEventListener('change', (e) => {
                const isYearly = e.target.checked;
                
                // Animate price changes
                const duration = 300;
                
                if (isYearly) {
                    this.animatePriceChange(monthlyPrices, yearlyPrices, monthlyPeriods, yearlyPeriods, duration);
                } else {
                    this.animatePriceChange(yearlyPrices, monthlyPrices, yearlyPeriods, monthlyPeriods, duration);
                }

                // Track pricing toggle
                this.trackEvent('pricing', 'toggle_billing', isYearly ? 'yearly' : 'monthly');
            });
        }

        // Advanced pricing card interactions
        document.querySelectorAll('.pricing-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!card.classList.contains('featured')) {
                    card.style.transform = 'translateY(-10px) scale(1.02)';
                    card.style.boxShadow = '0 20px 40px rgba(88, 101, 242, 0.15)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (!card.classList.contains('featured')) {
                    card.style.transform = 'translateY(0) scale(1)';
                    card.style.boxShadow = 'none';
                }
            });
        });
    }

    animatePriceChange(hideElements, showElements, hidePeriods, showPeriods, duration) {
        // Fade out current prices
        hideElements.forEach(el => {
            el.style.transition = `opacity ${duration}ms ease`;
            el.style.opacity = '0';
        });
        
        hidePeriods.forEach(el => {
            el.style.transition = `opacity ${duration}ms ease`;
            el.style.opacity = '0';
        });

        setTimeout(() => {
            // Hide and show elements
            hideElements.forEach(el => el.style.display = 'none');
            hidePeriods.forEach(el => el.style.display = 'none');
            showElements.forEach(el => el.style.display = 'inline');
            showPeriods.forEach(el => el.style.display = 'inline');

            // Fade in new prices
            setTimeout(() => {
                showElements.forEach(el => {
                    el.style.transition = `opacity ${duration}ms ease`;
                    el.style.opacity = '1';
                });
                
                showPeriods.forEach(el => {
                    el.style.transition = `opacity ${duration}ms ease`;
                    el.style.opacity = '1';
                });
            }, 50);
        }, duration / 2);
    }

    // ===== ADVANCED FAQ SYSTEM ===== //
    initializeAdvancedFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach((item, index) => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (question && answer) {
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    
                    // Close all FAQ items with animation
                    faqItems.forEach(faqItem => {
                        faqItem.classList.remove('active');
                        const faqAnswer = faqItem.querySelector('.faq-answer');
                        if (faqAnswer) {
                            faqAnswer.style.maxHeight = '0';
                        }
                    });
                    
                    // Open clicked item if it wasn't active
                    if (!isActive) {
                        item.classList.add('active');
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                        
                        // Track FAQ interaction
                        this.trackEvent('faq', 'expand_question', question.textContent.trim());
                    }
                });

                // Set initial state
                answer.style.maxHeight = '0';
                answer.style.overflow = 'hidden';
                answer.style.transition = 'max-height 0.3s ease';
            }
        });
    }

    // ===== FORM HANDLING ===== //
    setupFormHandling() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(contactForm);
            });

            // Real-time validation
            const inputs = contactForm.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        }
    }

    async handleContactForm(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        try {
            // Show loading state
            this.setLoadingState(submitBtn, true);
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (!this.validateForm(form)) {
                throw new Error('Please fill in all required fields correctly.');
            }

            // Simulate API call (replace with actual endpoint)
            await this.simulateApiCall(data);
            
            // Success feedback
            this.showNotification('Thank you for your message! We\'ll get back to you within 5 minutes.', 'success');
            form.reset();
            
            // Track form submission
            this.trackEvent('form', 'contact_submit', 'success');
            
        } catch (error) {
            this.showNotification(error.message, 'error');
            this.trackEvent('form', 'contact_submit', 'error');
        } finally {
            this.setLoadingState(submitBtn, false, originalText);
        }
    }

    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required.';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
        }

        this.showFieldValidation(field, isValid, errorMessage);
        return isValid;
    }

    showFieldValidation(field, isValid, errorMessage) {
        // Remove existing error
        const existingError = field.parentElement.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        field.classList.remove('field-valid', 'field-invalid');

        if (!isValid && errorMessage) {
            field.classList.add('field-invalid');
            
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = errorMessage;
            errorElement.style.cssText = `
                color: #ff6b6b;
                font-size: 0.875rem;
                margin-top: 0.25rem;
                animation: fadeInUp 0.3s ease;
            `;
            
            field.parentElement.appendChild(errorElement);
        } else if (field.value.trim()) {
            field.classList.add('field-valid');
        }
    }

    clearFieldError(field) {
        field.classList.remove('field-invalid');
        const errorElement = field.parentElement.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // ===== LOADING STATES ===== //
    initializeLoadingStates() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                if (!this.classList.contains('loading') && !this.closest('form')) {
                    driizzyBoosts.setLoadingState(this, true);
                    setTimeout(() => {
                        driizzyBoosts.setLoadingState(this, false);
                    }, 2000);
                }
            });
        });
    }

    setLoadingState(element, isLoading, originalText = null) {
        if (isLoading) {
            element.dataset.originalText = originalText || element.textContent;
            element.classList.add('loading');
            element.disabled = true;
            element.textContent = 'Loading...';
        } else {
            element.classList.remove('loading');
            element.disabled = false;
            element.textContent = element.dataset.originalText || originalText || element.textContent;
        }
    }

    // ===== ADVANCED INTERACTIONS ===== //
    setupAdvancedInteractions() {
        // Pricing button interactions
        document.querySelectorAll('.pricing-card .btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handlePricingSelection(button);
            });
        });

        // Advanced keyboard navigation
        this.setupKeyboardNavigation();
        
        // Mouse tracking for advanced effects
        this.setupMouseTracking();
    }

    handlePricingSelection(button) {
        const card = button.closest('.pricing-card');
        const packageName = card.querySelector('h4').textContent;
        const price = card.querySelector('.amount').textContent;
        
        // Show selection feedback
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);

        // Auto-scroll to contact form
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
            
            // Pre-fill form after scroll
            setTimeout(() => {
                this.prefillContactForm(packageName, price);
            }, 800);
        }

        // Track pricing selection
        this.trackEvent('pricing', 'select_package', packageName);
    }

    prefillContactForm(packageName, price) {
        const serviceSelect = document.getElementById('service');
        const messageField = document.getElementById('message');
        
        if (serviceSelect && messageField) {
            // Determine service type
            if (packageName.toLowerCase().includes('boost')) {
                serviceSelect.value = 'server-boosts';
            } else if (packageName.toLowerCase().includes('growth')) {
                serviceSelect.value = 'member-growth';
            }
            
            // Pre-fill message with animation
            const message = `Hi! I'm interested in the ${packageName} package ($${price}). Could you please provide more information?`;
            this.typewriterEffect(messageField, message);
            
            // Highlight the form
            const contactForm = document.getElementById('contactForm');
            if (contactForm) {
                contactForm.style.border = '2px solid var(--primary-color)';
                contactForm.style.boxShadow = '0 0 20px rgba(88, 101, 242, 0.3)';
                
                setTimeout(() => {
                    contactForm.style.border = '';
                    contactForm.style.boxShadow = '';
                }, 3000);
            }
        }
    }

    // ===== TYPEWRITER EFFECT ===== //
    typewriterEffect(element, text, speed = 50) {
        element.value = '';
        let index = 0;
        
        const type = () => {
            if (index < text.length) {
                element.value += text.charAt(index);
                index++;
                setTimeout(type, speed);
            }
        };
        
        type();
    }

    // ===== KEYBOARD NAVIGATION ===== //
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Escape key to close mobile menu
            if (e.key === 'Escape') {
                const hamburger = document.querySelector('.hamburger');
                const navMenu = document.querySelector('.nav-menu');
                
                if (hamburger && navMenu && navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('nav-open');
                }
            }

            // Konami code easter egg
            this.handleKonamiCode(e);
        });
    }

    // ===== KONAMI CODE EASTER EGG ===== //
    handleKonamiCode(e) {
        if (!this.konamiCode) this.konamiCode = [];
        
        const konamiSequence = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];

        this.konamiCode.push(e.code);
        
        if (this.konamiCode.length > konamiSequence.length) {
            this.konamiCode.shift();
        }
        
        if (this.konamiCode.join('') === konamiSequence.join('')) {
            this.activateEasterEgg();
            this.konamiCode = [];
        }
    }

    activateEasterEgg() {
        // Rainbow animation
        document.body.style.animation = 'rainbow 2s linear infinite';
        
        setTimeout(() => {
            document.body.style.animation = '';
            this.showNotification('🎉 Konami Code activated! Enjoy a special 10% discount - use code: KONAMI10', 'success');
        }, 2000);

        this.trackEvent('easter_egg', 'konami_code', 'activated');
    }

    // ===== TOOLTIP SYSTEM ===== //
    initializeTooltips() {
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.dataset.tooltip);
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    showTooltip(element, text) {
        if (this.tooltip) this.hideTooltip();
        
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'tooltip';
        this.tooltip.textContent = text;
        this.tooltip.style.cssText = `
            position: absolute;
            background: var(--bg-card);
            color: var(--text-primary);
            padding: 8px 12px;
            border-radius: var(--radius-md);
            font-size: 0.875rem;
            z-index: var(--z-tooltip);
            border: 1px solid var(--border-primary);
            box-shadow: var(--shadow-lg);
            pointer-events: none;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.2s ease;
        `;
        
        document.body.appendChild(this.tooltip);
        
        const rect = element.getBoundingClientRect();
        this.tooltip.style.left = rect.left + (rect.width / 2) - (this.tooltip.offsetWidth / 2) + 'px';
        this.tooltip.style.top = rect.top - this.tooltip.offsetHeight - 8 + 'px';
        
        requestAnimationFrame(() => {
            this.tooltip.style.opacity = '1';
            this.tooltip.style.transform = 'translateY(0)';
        });
    }

    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.remove();
            this.tooltip = null;
        }
    }

    // ===== MODAL SYSTEM ===== //
    initializeModalSystem() {
        // Modal triggers
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-modal]')) {
                e.preventDefault();
                this.showModal(e.target.dataset.modal);
            }
            
            if (e.target.matches('.modal-close') || e.target.matches('.modal-backdrop')) {
                this.hideModal();
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentModal) {
                this.hideModal();
            }
        });
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        this.currentModal = modal;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        requestAnimationFrame(() => {
            modal.classList.add('modal-show');
        });

        this.trackEvent('modal', 'open', modalId);
    }

    hideModal() {
        if (!this.currentModal) return;

        this.currentModal.classList.remove('modal-show');
        
        setTimeout(() => {
            this.currentModal.style.display = 'none';
            document.body.style.overflow = '';
            this.currentModal = null;
        }, 300);
    }

    // ===== NOTIFICATION SYSTEM ===== //
    showNotification(message, type = 'success', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--secondary-color)' : 'var(--accent-color)'};
            color: var(--text-primary);
            padding: 1rem 1.5rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-xl);
            z-index: var(--z-tooltip);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.hideNotification(notification));

        // Auto-hide
        setTimeout(() => {
            this.hideNotification(notification);
        }, duration);
    }

    hideNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // ===== ANALYTICS AND TRACKING ===== //
    trackEvent(category, action, label = null) {
        if (!this.config.features.advancedAnalytics) return;

        // Custom analytics tracking
        const eventData = {
            category,
            action,
            label,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        console.log('📊 Event tracked:', eventData);

        // Here you would send to your analytics service
        // Example: Google Analytics, Mixpanel, etc.
    }

    // ===== PERFORMANCE MONITORING ===== //
    setupPerformanceMonitoring() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            
            this.trackEvent('performance', 'page_load', `${Math.round(loadTime)}ms`);
        });

        // Monitor interaction delays
        ['click', 'keydown'].forEach(eventType => {
            document.addEventListener(eventType, (e) => {
                const startTime = performance.now();
                
                requestAnimationFrame(() => {
                    const endTime = performance.now();
                    const delay = endTime - startTime;
                    
                    if (delay > 16) { // More than 1 frame
                        this.trackEvent('performance', 'interaction_delay', `${Math.round(delay)}ms`);
                    }
                });
            }, { passive: true });
        });
    }

    // ===== UTILITY METHODS ===== //
    async simulateApiCall(data) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate occasional errors for testing
        if (Math.random() < 0.1) {
            throw new Error('Network error. Please try again.');
        }
        
        return { success: true, data };
    }

    // ===== ADVANCED FEATURES ===== //
    setupAdvancedFeatures() {
        this.setupRealTimeUpdates();
        this.setupAdvancedSearch();
        this.setupInfiniteScroll();
    }

    setupRealTimeUpdates() {
        if (!this.config.features.realTimeUpdates) return;

        // Simulate real-time server count updates
        const statsNumbers = document.querySelectorAll('.stat-number');
        
        setInterval(() => {
            statsNumbers.forEach(stat => {
                const text = stat.textContent;
                if (text.includes('+')) {
                    const base = parseInt(text.replace(/[^\d]/g, ''));
                    const variance = Math.floor(Math.random() * 10) - 5;
                    const newValue = Math.max(0, base + variance);
                    
                    if (text.includes('K')) {
                        stat.textContent = Math.floor(newValue / 1000) + 'K+';
                    } else {
                        stat.textContent = newValue.toLocaleString() + '+';
                    }
                }
            });
        }, 30000); // Update every 30 seconds
    }

    setupAdvancedSearch() {
        // Advanced search functionality would go here
        // This is a placeholder for future implementation
    }

    setupInfiniteScroll() {
        // Infinite scroll for testimonials or blog posts
        // This is a placeholder for future implementation
    }

    setupMouseTracking() {
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Create subtle parallax effect on hero elements
            const heroElements = document.querySelectorAll('.hero .discord-mockup');
            heroElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const deltaX = (mouseX - centerX) / window.innerWidth;
                const deltaY = (mouseY - centerY) / window.innerHeight;
                
                element.style.transform = `
                    translateX(${deltaX * 10}px) 
                    translateY(${deltaY * 10}px) 
                    rotateX(${deltaY * 5}deg) 
                    rotateY(${deltaX * 5}deg)
                `;
            });
        });
    }
}

// Add rainbow animation for easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease-out both;
    }
    
    .field-invalid {
        border-color: var(--accent-color) !important;
        box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.2) !important;
    }
    
    .field-valid {
        border-color: var(--secondary-color) !important;
        box-shadow: 0 0 0 2px rgba(0, 212, 170, 0.2) !important;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: var(--radius-sm);
        transition: background-color 0.2s ease;
    }
    
    .notification-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`;
document.head.appendChild(style);

// ===== GLOBAL INITIALIZATION ===== //
const driizzyBoosts = new DriizzyBoosts();

// Export for global access
window.driizzyBoosts = driizzyBoosts;
