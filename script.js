// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        // Remove active class from all links
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Close mobile menu
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll - KEEP DARK BLUE
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            if (entry.target.classList.contains('top-selling-card')) {
                entry.target.classList.add('visible');
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.product-card, .feature, .contact-item, .stat, .brand-card, .top-selling-card');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Product card hover effects with enhanced animations
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
        this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    });
});

// Enhanced contact item interactions
document.querySelectorAll('.contact-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(10px) scale(1.02)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0) scale(1)';
    });
});

// Stats counter animation with enhanced effects
function animateCounters() {
    const stats = document.querySelectorAll('.stat h3');
    stats.forEach(stat => {
        const target = parseInt(stat.textContent.replace(/\D/g, ''));
        const plus = stat.textContent.includes('+');
        let current = 0;
        const increment = Math.max(1, Math.floor(target / 100));
        stat.textContent = '0' + (plus ? '+' : '');
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
                stat.textContent = target + (plus ? '+' : '');
                stat.classList.add('stat-animated');
            } else {
                stat.textContent = current + (plus ? '+' : '');
            }
        }, 50);
    });
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Enhanced parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Loading animation with enhanced effects
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
        // Add a subtle entrance animation for the logo
        const logoIcon = document.querySelector('.logo-icon');
        if (logoIcon) {
            logoIcon.style.animation = 'bounce 1s ease';
        }
    }, 100);
});

// --- Ultra Smooth Navigation & Performance Optimizations ---
// Use requestAnimationFrame for nav link highlight
let lastScrollY = window.scrollY;
let ticking = false;
function rafUpdateActiveNavLink() {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateActiveNavLink();
            ticking = false;
        });
        ticking = true;
    }
}
window.removeEventListener('scroll', updateActiveNavLink);
window.addEventListener('scroll', rafUpdateActiveNavLink, { passive: true });
// Debounce all scroll/resize events
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
// Use debounced resize for layout updates
window.addEventListener('resize', debounce(() => {
    // Any layout update logic here
}, 120), { passive: true });
// Optimize DOM queries: cache nav/sections
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
function updateActiveNavLink() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Enhanced touch gestures for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - could be used for next section
            console.log('Swiped left');
        } else {
            // Swipe right - could be used for previous section
            console.log('Swiped right');
        }
    }
}

// Enhanced floating WhatsApp button interactions
const whatsappBtn = document.querySelector('.whatsapp-btn');
if (whatsappBtn) {
    whatsappBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(5deg)';
    });
    
    whatsappBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
}

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple effect CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Enhanced feature hover effects
document.querySelectorAll('.feature').forEach(feature => {
    feature.addEventListener('mouseenter', function() {
        const icon = this.querySelector('i');
        if (icon) {
            icon.style.transform = 'scale(1.2) rotate(10deg)';
            icon.style.color = '#ffd700';
        }
    });
    
    feature.addEventListener('mouseleave', function() {
        const icon = this.querySelector('i');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
            icon.style.color = '#ffd700';
        }
    });
});

// HERO SLIDESHOW
(function() {
    const slideshow = document.getElementById('heroSlideshow');
    if (!slideshow) return;
    const slidesContainer = slideshow.querySelector('.hero-slides');
    const slides = Array.from(slideshow.querySelectorAll('.hero-slide'));
    const dotsContainer = document.getElementById('heroSlideshowDots');
    let current = 0;
    let interval;

    function goToSlide(idx) {
        current = idx;
        slidesContainer.style.transform = `translateX(-${current * 100}%)`;
        updateDots();
    }

    function updateDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        slides.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = 'hero-slideshow-dot' + (i === current ? ' active' : '');
            dot.addEventListener('click', () => {
                goToSlide(i);
                resetInterval();
            });
            dotsContainer.appendChild(dot);
        });
    }

    function nextSlide() {
        goToSlide((current + 1) % slides.length);
    }

    function prevSlide() {
        goToSlide((current - 1 + slides.length) % slides.length);
    }

    function resetInterval() {
        clearInterval(interval);
        interval = setInterval(nextSlide, 4000);
    }

    // Touch support
    let startX = 0;
    slidesContainer.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
    });
    slidesContainer.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - startX;
        if (dx > 40) {
            prevSlide();
            resetInterval();
        } else if (dx < -40) {
            nextSlide();
            resetInterval();
        }
    });

    // Init
    goToSlide(0);
    resetInterval();
})();

// Animate brand cards in on load
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.brand-card').forEach((card, i) => {
        setTimeout(() => card.classList.add('animated'), 100 + i * 120);
    });
});

// Animate top-selling cards in on load (like brands)
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.top-selling-card').forEach((card, i) => {
        setTimeout(() => card.classList.add('animated'), 100 + i * 120);
    });
});

// --- Brand Carousel: Seamless Right-to-Left Animation ---
(function() {
    const carousel = document.querySelector('.brands-carousel');
    const grid = carousel ? carousel.querySelector('.brands-grid') : null;
    if (!carousel || !grid) return;
    // Gather all brand data from the initial DOM
    const allBrandCards = Array.from(grid.querySelectorAll('.brand-card'));
    const brands = allBrandCards.map(card => {
        const img = card.querySelector('img');
        const name = card.querySelector('h3')?.textContent || '';
        const desc = card.querySelector('p')?.textContent || '';
        const src = img ? img.getAttribute('src') : null;
        return { src, name, desc };
    });
    // Helper to create a card element
    function createBrandCard(brand, extraClass = '') {
        const card = document.createElement('div');
        card.className = 'brand-card' + (extraClass ? ' ' + extraClass : '');
        const logo = document.createElement('div');
        logo.className = 'brand-logo';
        if (brand.src) {
            const img = document.createElement('img');
            img.src = brand.src;
            img.alt = brand.name;
            img.loading = 'lazy';
            img.onerror = function() {
                this.style.display = 'none';
                if (!logo.querySelector('.brand-fallback')) {
                    const fallback = document.createElement('span');
                    fallback.className = 'brand-fallback';
                    fallback.innerHTML = '<i class="fas fa-mobile-alt"></i>';
                    logo.appendChild(fallback);
                }
            };
            logo.appendChild(img);
        } else {
            const fallback = document.createElement('span');
            fallback.className = 'brand-fallback';
            fallback.innerHTML = '<i class="fas fa-mobile-alt"></i>';
            logo.appendChild(fallback);
        }
        const content = document.createElement('div');
        content.className = 'brand-content';
        const h3 = document.createElement('h3');
        h3.textContent = brand.name;
        const p = document.createElement('p');
        p.textContent = brand.desc;
        content.appendChild(h3);
        content.appendChild(p);
        card.appendChild(logo);
        card.appendChild(content);
        return card;
    }
    // Carousel state
    let current = 0;
    let interval;
    let isTransitioning = false;
    // Render function: 1 card for mobile, 3 for desktop
    function render(peekTransition = false) {
        grid.innerHTML = '';
        if (window.innerWidth <= 600) {
            // Mobile: show only one card
            const currCard = createBrandCard(brands[current], 'center');
            grid.appendChild(currCard);
            grid.style.display = 'flex';
            grid.style.justifyContent = 'center';
            grid.style.alignItems = 'center';
            grid.style.transition = peekTransition ? 'transform 0.5s cubic-bezier(.19,1,.22,1)' : 'none';
            grid.style.transform = 'translateX(0)';
        } else {
            // Desktop/tablet: show 3 cards (peek style)
            const prevIdx = (current - 1 + brands.length) % brands.length;
            const nextIdx = (current + 1) % brands.length;
            const prevCard = createBrandCard(brands[prevIdx], 'peek');
            const currCard = createBrandCard(brands[current], 'center');
            const nextCard = createBrandCard(brands[nextIdx], 'peek');
            grid.appendChild(prevCard);
            grid.appendChild(currCard);
            grid.appendChild(nextCard);
            grid.style.display = 'flex';
            grid.style.justifyContent = 'center';
            grid.style.alignItems = 'center';
            grid.style.transition = peekTransition ? 'transform 0.5s cubic-bezier(.19,1,.22,1)' : 'none';
            grid.style.transform = 'translateX(-33.33%)';
        }
    }
    // Animate to next card
    function slideNext() {
        if (isTransitioning) return;
        isTransitioning = true;
        if (window.innerWidth <= 600) {
            // Mobile: slide left
            const card = grid.firstChild;
            if (card) {
                card.style.transition = 'transform 0.4s cubic-bezier(.19,1,.22,1), opacity 0.4s';
                card.style.transform = 'translateX(-100vw)';
                card.style.opacity = '0.2';
            }
            setTimeout(() => {
                current = (current + 1) % brands.length;
                render(false);
                const newCard = grid.firstChild;
                if (newCard) {
                    newCard.style.transform = 'translateX(100vw)';
                    newCard.style.opacity = '0.2';
                    setTimeout(() => {
                        newCard.style.transition = 'transform 0.4s cubic-bezier(.19,1,.22,1), opacity 0.4s';
                        newCard.style.transform = 'translateX(0)';
                        newCard.style.opacity = '1';
                        setTimeout(() => {
                            isTransitioning = false;
                        }, 400);
                    }, 10);
                } else {
                    isTransitioning = false;
                }
            }, 400);
        } else {
            // Desktop/tablet: slide
            grid.style.transition = 'transform 0.5s cubic-bezier(.19,1,.22,1)';
            grid.style.transform = 'translateX(-66.66%)';
            setTimeout(() => {
                current = (current + 1) % brands.length;
                render(false);
                isTransitioning = false;
            }, 500);
        }
    }
    // Animate to previous card
    function slidePrev() {
        if (isTransitioning) return;
        isTransitioning = true;
        if (window.innerWidth <= 600) {
            // Mobile: slide right
            const card = grid.firstChild;
            if (card) {
                card.style.transition = 'transform 0.4s cubic-bezier(.19,1,.22,1), opacity 0.4s';
                card.style.transform = 'translateX(100vw)';
                card.style.opacity = '0.2';
            }
            setTimeout(() => {
                current = (current - 1 + brands.length) % brands.length;
                render(false);
                const newCard = grid.firstChild;
                if (newCard) {
                    newCard.style.transform = 'translateX(-100vw)';
                    newCard.style.opacity = '0.2';
                    setTimeout(() => {
                        newCard.style.transition = 'transform 0.4s cubic-bezier(.19,1,.22,1), opacity 0.4s';
                        newCard.style.transform = 'translateX(0)';
                        newCard.style.opacity = '1';
                        setTimeout(() => {
                            isTransitioning = false;
                        }, 400);
                    }, 10);
                } else {
                    isTransitioning = false;
                }
            }, 400);
        } else {
            // Desktop/tablet: slide
            grid.style.transition = 'transform 0.5s cubic-bezier(.19,1,.22,1)';
            grid.style.transform = 'translateX(0%)';
            setTimeout(() => {
                current = (current - 1 + brands.length) % brands.length;
                render(false);
                isTransitioning = false;
            }, 500);
        }
    }
    function startCarousel() {
        interval = setInterval(slideNext, window.innerWidth <= 600 ? 1800 : 2000);
    }
    function stopCarousel() {
        clearInterval(interval);
    }
    // Touch/swipe support for mobile
    let startX = 0;
    let moved = false;
    grid.addEventListener('touchstart', e => {
        stopCarousel();
        startX = e.touches[0].clientX;
        moved = false;
    });
    grid.addEventListener('touchmove', e => {
        moved = true;
    });
    grid.addEventListener('touchend', e => {
        if (!moved) return;
        const dx = e.changedTouches[0].clientX - startX;
        if (dx > 40) {
            slidePrev();
        } else if (dx < -40) {
            slideNext();
        }
        startCarousel();
    });
    window.addEventListener('resize', () => {
        render(false);
    });
    render(false);
    startCarousel();
    carousel.addEventListener('mouseenter', stopCarousel);
    carousel.addEventListener('mouseleave', startCarousel);
})();

// --- Top Selling Products Modern Carousel (show 1 card at a time, auto-advance, all screens) ---
(function() {
    const grid = document.querySelector('.top-selling-grid');
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll('.top-selling-card'));
    if (cards.length < 2) return;
    function showCard(idx) {
        grid.querySelectorAll('.top-selling-card').forEach((card, i) => {
            if (i === idx) {
                card.classList.add('center');
            } else {
                card.classList.remove('center');
            }
        });
    }
    let current = 0;
    showCard(current);
    let interval = setInterval(() => {
        current = (current + 1) % cards.length;
        showCard(current);
    }, 2500);
    // Touch swipe support
    let startX = 0, moved = false;
    grid.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        moved = false;
    });
    grid.addEventListener('touchmove', e => { moved = true; });
    grid.addEventListener('touchend', e => {
        if (!moved) return;
        const dx = e.changedTouches[0].clientX - startX;
        if (dx > 40) {
            current = (current - 1 + cards.length) % cards.length;
            showCard(current);
        } else if (dx < -40) {
            current = (current + 1) % cards.length;
            showCard(current);
        }
    });
    // Pause/resume on hover
    grid.addEventListener('mouseenter', () => clearInterval(interval));
    grid.addEventListener('mouseleave', () => {
        interval = setInterval(() => {
            current = (current + 1) % cards.length;
            showCard(current);
        }, 2500);
    });
})();

// --- Top Selling Product Card Enlarge-on-Click Modal ---
(function() {
    const grid = document.querySelector('.top-selling-grid');
    if (!grid) return;
    let modalOverlay = null;
    let enlargedCard = null;
    function closeModal() {
        if (modalOverlay) {
            modalOverlay.remove();
            modalOverlay = null;
            enlargedCard = null;
            document.body.style.overflow = '';
        }
    }
    grid.addEventListener('click', function(e) {
        const card = e.target.closest('.top-selling-card');
        if (!card || card.classList.contains('enlarged')) return;
        // Prevent carousel scroll/drag
        e.stopPropagation();
        // Clone the card for modal
        const cardClone = card.cloneNode(true);
        cardClone.classList.add('enlarged');
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'top-selling-modal-close';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.onclick = closeModal;
        cardClone.appendChild(closeBtn);
        // Create overlay
        modalOverlay = document.createElement('div');
        modalOverlay.className = 'top-selling-modal-overlay';
        modalOverlay.appendChild(cardClone);
        modalOverlay.addEventListener('click', function(ev) {
            if (ev.target === modalOverlay) closeModal();
        });
        document.body.appendChild(modalOverlay);
        document.body.style.overflow = 'hidden';
        enlargedCard = cardClone;
    });
    // ESC key closes modal
    document.addEventListener('keydown', function(e) {
        if (modalOverlay && (e.key === 'Escape' || e.key === 'Esc')) closeModal();
    });
})(); 