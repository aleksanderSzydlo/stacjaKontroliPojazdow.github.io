// Enhanced Hamburger menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        // Handle click events
        hamburger.addEventListener('click', toggleMenu);
        
        // Handle keyboard events for accessibility
        hamburger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                closeMenu();
            }
        });
        
        // Close menu when clicking on links
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
        
        // Close menu on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMenu();
            }
        });
        
        function toggleMenu() {
            const isOpen = hamburger.classList.contains('active');
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        }
        
        function openMenu() {
            hamburger.classList.add('active');
            navMenu.classList.add('active');
            hamburger.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
        
        function closeMenu() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }

    // Initialize hero slideshow
    initHeroSlideshow();
});

// Enhanced Hero Background Slideshow with Lazy Loading
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    
    if (slides.length <= 1) return;
    
    // Preload first image immediately, others on demand
    preloadImage(slides[0]);
    
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
        
        // Preload next image
        const nextIndex = (currentSlide + 1) % slides.length;
        preloadImage(slides[nextIndex]);
    }
    
    function preloadImage(slide) {
        const bgImage = slide.style.backgroundImage;
        if (bgImage && !slide.dataset.loaded) {
            const url = bgImage.slice(4, -1).replace(/["']/g, "");
            const img = new Image();
            img.onload = () => {
                slide.dataset.loaded = 'true';
            };
            img.onerror = () => {
                console.warn('Failed to load image:', url);
            };
            img.src = url;
        }
    }
    
    // Change slide every 5 seconds
    setInterval(nextSlide, 5000);
    
    // Pause slideshow when page is not visible
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Page is hidden, could pause slideshow
        } else {
            // Page is visible, resume slideshow
        }
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(30, 60, 114, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.backgroundColor = '';
        navbar.style.backdropFilter = '';
    }
});

// Initialize all functionality with error handling
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Initialize components in order of importance
        initializeApp();
        
        // Performance monitoring
        if ('performance' in window) {
            window.addEventListener('load', function() {
                setTimeout(function() {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart + 'ms');
                }, 0);
            });
        }
        
        console.log('SKP Istebna - Website loaded successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
        // Fallback: at least show a basic working website
        initBasicFunctionality();
    }
});

function initializeApp() {
    // Core functionality
    initEmailJS();
    
    // Enhanced features
    if (typeof window.IntersectionObserver !== 'undefined') {
        initScrollAnimations();
    }
    
    // Update service status
    updateServiceStatus();
}

function initBasicFunctionality() {
    // Minimal functionality for older browsers or error cases
    console.warn('Running in fallback mode');
    
    // Basic form handling without EmailJS
    const form = document.getElementById('contact-form-element');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Formularz nie może być wysłany w tym trybie. Proszę skontaktować się telefonicznie.');
        });
    }
}

// Separate scroll animations initialization
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-category, .hours-card, .additional-item, .contact-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// Global error handler
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // Could send error reports to analytics service
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
});

// EmailJS Integration with Enhanced Error Handling
function initEmailJS() {
    // Initialize EmailJS with your public key
    emailjs.init('3qSdcdYGB_F2FxHQv');
    
    const form = document.getElementById('contact-form-element');
    const submitBtn = document.getElementById('submit-btn');
    const formMessage = document.getElementById('form-message');
    
    if (form) {
        // Add form validation
        form.addEventListener('input', validateForm);
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form before submission
            if (!validateForm()) {
                showFormMessage('Proszę wypełnić wszystkie wymagane pola poprawnie.', 'error');
                return;
            }
            
            // Disable submit button and show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Wysyłanie...';
            
            // Clear previous messages
            formMessage.className = 'form-message';
            formMessage.style.display = 'none';
            
            // Get form data and add additional parameters
            const templateParams = {
                from_name: form.user_name.value.trim(),
                from_email: form.user_email.value.trim(),
                message: form.message.value.trim(),
                subject: 'Wiadomość ze strony',
                reply_to: form.user_email.value.trim(),
                phone: form.user_phone.value.trim() || 'Nie podano',
                service: form.service_type.value || 'Nie wybrano',
                web: 'SKP - Stacja kontroli pojazdów Istebna'
            };
            
            // Send email using EmailJS with timeout
            const timeout = setTimeout(() => {
                showFormMessage('Przekroczono czas oczekiwania. Proszę spróbować ponownie.', 'error');
                resetSubmitButton();
            }, 15000);
            
            emailjs.send('service_wvhublc', 'template_ypn9c6y', templateParams)
                .then(function(response) {
                    clearTimeout(timeout);
                    console.log('SUCCESS!', response.status, response.text);
                    showFormMessage('Wiadomość została wysłana pomyślnie! Skontaktujemy się z Państwem wkrótce.', 'success');
                    form.reset();
                    // Reset form validation states
                    form.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(field => {
                        field.classList.remove('error', 'success');
                    });
                }, function(error) {
                    clearTimeout(timeout);
                    console.error('EmailJS Error:', error);
                    
                    let errorMessage = 'Wystąpił błąd podczas wysyłania wiadomości. ';
                    
                    if (error.status === 400) {
                        errorMessage += 'Nieprawidłowe dane w formularzu.';
                    } else if (error.status === 403) {
                        errorMessage += 'Problem z autoryzacją usługi email.';
                    } else if (error.status >= 500) {
                        errorMessage += 'Problem z serwerem. Spróbuj ponownie za chwilę.';
                    } else {
                        errorMessage += 'Proszę spróbować ponownie lub skontaktować się telefonicznie.';
                    }
                    
                    showFormMessage(errorMessage, 'error');
                })
                .finally(function() {
                    resetSubmitButton();
                });
        });
    }
    
    function resetSubmitButton() {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Wyślij wiadomość';
    }
    
    function validateForm() {
        const name = form.user_name.value.trim();
        const email = form.user_email.value.trim();
        const message = form.message.value.trim();
        
        let isValid = true;
        
        // Validate name
        if (name.length < 2) {
            setFieldError(form.user_name, 'Imię musi mieć co najmniej 2 znaki');
            isValid = false;
        } else {
            setFieldSuccess(form.user_name);
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setFieldError(form.user_email, 'Proszę wprowadzić prawidłowy adres email');
            isValid = false;
        } else {
            setFieldSuccess(form.user_email);
        }
        
        // Validate message
        if (message.length < 10) {
            setFieldError(form.message, 'Wiadomość musi mieć co najmniej 10 znaków');
            isValid = false;
        } else {
            setFieldSuccess(form.message);
        }
        
        // Validate phone if provided
        const phone = form.user_phone.value.trim();
        if (phone && phone.length < 9) {
            setFieldError(form.user_phone, 'Numer telefonu musi mieć co najmniej 9 cyfr');
            isValid = false;
        } else if (phone) {
            setFieldSuccess(form.user_phone);
        } else {
            clearFieldValidation(form.user_phone);
        }
        
        return isValid;
    }
    
    function setFieldError(field, message) {
        field.classList.remove('success');
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = '#dc3545';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '4px';
        field.parentNode.appendChild(errorElement);
    }
    
    function setFieldSuccess(field) {
        field.classList.remove('error');
        field.classList.add('success');
        
        // Remove error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    function clearFieldValidation(field) {
        field.classList.remove('error', 'success');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
}

function showFormMessage(message, type) {
    const formMessage = document.getElementById('form-message');
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Hide success message after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }
}

// Current time display and service status (consolidated)
function updateServiceStatus() {
    // Update service status indicators
    addServiceStatus('station', '.hours-card:first-child');
    addServiceStatus('wash', '.hours-card:last-child');
}

// Update service status every minute
setInterval(updateServiceStatus, 60000);

// Service hours checker
function isServiceOpen(service = 'station') {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    if (service === 'station') {
        // Station hours: Mon-Fri 7:00-17:00, Sat 8:00-14:00, Sun closed
        if (currentDay === 0) return false; // Sunday closed
        if (currentDay === 6) return currentHour >= 8 && currentHour < 14; // Saturday 8-14
        return currentHour >= 7 && currentHour < 17; // Monday-Friday 7-17
    } else if (service === 'wash') {
        return true; // 24/7
    }
    
    return false;
}

function addServiceStatus(service, selector) {
    const element = document.querySelector(selector);
    if (element && !element.querySelector('.status-indicator')) {
        const isOpen = isServiceOpen(service);
        const statusElement = document.createElement('div');
        statusElement.className = `status-indicator ${isOpen ? 'open' : 'closed'}`;
        statusElement.innerHTML = `
            <span class="status-dot"></span>
            ${isOpen ? 'Otwarte' : (service === 'wash' ? 'Dostępne 24/7' : 'Zamknięte')}
        `;
        
        // Add styles
        Object.assign(statusElement.style, {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: isOpen ? '#28a745' : '#dc3545',
            marginTop: '15px'
        });
        
        const dot = statusElement.querySelector('.status-dot');
        if (dot) {
            Object.assign(dot.style, {
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: isOpen ? '#28a745' : '#dc3545',
                animation: isOpen ? 'pulse 2s infinite' : 'none'
            });
        }
        
        element.appendChild(statusElement);
    }
}

// Add pulse animation for status indicator
if (!document.querySelector('#pulse-animation-style')) {
    const style = document.createElement('style');
    style.id = 'pulse-animation-style';
    style.textContent = `
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(40, 167, 69, 0); }
            100% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0); }
        }
    `;
    document.head.appendChild(style);
}
