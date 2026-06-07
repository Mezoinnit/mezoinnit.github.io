// ========================================
// NAVIGATION
// ========================================
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = mobileMenu.querySelectorAll('a');

// Scroll-based nav background
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
});

// Close mobile menu on link click
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
});

// ========================================
// SCROLL ANIMATIONS (Intersection Observer)
// ========================================
const fadeElements = document.querySelectorAll('.fade-in');

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Stagger animation for sibling elements
            const siblings = entry.target.parentElement.querySelectorAll('.fade-in');
            let delay = 0;

            siblings.forEach((sibling, i) => {
                if (sibling === entry.target) {
                    setTimeout(() => {
                        sibling.classList.add('visible');
                    }, delay);
                }
            });

            // Small stagger based on position
            const allVisible = Array.from(siblings).filter(s => s.classList.contains('visible'));
            delay = allVisible.length * 80;

            setTimeout(() => {
                entry.target.classList.add('visible');
            }, Math.min(delay, 300));

            fadeObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

fadeElements.forEach(el => fadeObserver.observe(el));

// ========================================
// ANIMATED COUNTERS
// ========================================
const statNumbers = document.querySelectorAll('.stat-number');
let countersAnimated = false;

function animateCounters() {
    if (countersAnimated) return;

    const statsSection = document.getElementById('stats');
    const rect = statsSection.getBoundingClientRect();

    if (rect.top < window.innerHeight && rect.bottom > 0) {
        countersAnimated = true;

        statNumbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-target'));
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function (ease-out cubic)
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(eased * target);

                num.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }
}

window.addEventListener('scroll', animateCounters);
animateCounters(); // Check on load

// ========================================
// SMOOTH SCROLL FOR NAV LINKS
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Account for fixed nav
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// ACTIVE NAV LINK HIGHLIGHT
// ========================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function updateActiveLink() {
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(link => {
                link.style.color = '';
                if (link.getAttribute('href') === `#${id}`) {
                    link.style.color = '#ffffff';
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// ========================================
// KEYBOARD ACCESSIBILITY
// ========================================
document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
    }
});