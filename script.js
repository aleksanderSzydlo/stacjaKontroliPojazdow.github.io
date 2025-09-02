// Hamburger menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on links
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Initialize hero slideshow
    initHeroSlideshow();
});

// Hero Background Slideshow
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    
    if (slides.length <= 1) return;
    
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    // Change slide every 5 seconds
    setInterval(nextSlide, 5000);
    
    // Preload images for smooth transitions
    slides.forEach(slide => {
        const bgImage = slide.style.backgroundImage;
        if (bgImage) {
            const url = bgImage.slice(4, -1).replace(/["']/g, "");
            const img = new Image();
            img.src = url;
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

// Animate elements on scroll
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
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.service-category, .hours-card, .additional-item, .contact-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// Current time display for wash availability
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pl-PL', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    // You can add a time display element if needed
    // const timeDisplay = document.querySelector('.current-time');
    // if (timeDisplay) {
    //     timeDisplay.textContent = `Aktualny czas: ${timeString}`;
    // }
}

// Update time every minute
setInterval(updateCurrentTime, 60000);
updateCurrentTime();

// Contact form submission (if you add a form later)
function handleContactForm() {
    const form = document.querySelector('#contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Here you would typically send the data to a server
            console.log('Form data:', data);
            
            // Show success message
            showNotification('Wiadomość została wysłana! Skontaktujemy się z Państwem wkrótce.', 'success');
            
            // Reset form
            form.reset();
        });
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        background: type === 'success' ? '#28a745' : '#007bff',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '5px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: '9999',
        maxWidth: '300px',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Phone number formatting and validation
function formatPhoneNumber(phone) {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as XXX XXX XXX
    if (cleaned.length === 9) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    }
    
    return phone;
}

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

// Add status indicators
document.addEventListener('DOMContentLoaded', function() {
    // Add status indicators if elements exist
    addServiceStatus('station', '.hours-card:first-child');
    addServiceStatus('wash', '.hours-card:last-child');
});

function addServiceStatus(service, selector) {
    const element = document.querySelector(selector);
    if (element) {
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
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(40, 167, 69, 0); }
        100% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0); }
    }
`;
document.head.appendChild(style);

// Initialize all functionality
document.addEventListener('DOMContentLoaded', function() {
    handleContactForm();
    console.log('Stacja Kontroli Pojazdów - Website loaded successfully');
});
