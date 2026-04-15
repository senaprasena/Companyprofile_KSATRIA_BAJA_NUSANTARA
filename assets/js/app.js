let currentLang = localStorage.getItem('language') || 'id';

function t(key) {
    return TRANSLATIONS[currentLang][key] || TRANSLATIONS["id"][key] || key;
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
        
        if (el.tagName === 'TEXTAREA' && key === 'contact_placeholder_message') {
            el.placeholder = t(key);
        }
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('bg-orange-500', 'text-white');
        btn.classList.add('text-gray-400');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('bg-orange-500', 'text-white');
            btn.classList.remove('text-gray-400');
        }
    });
}

let lastScrollPosition = 0;
let devBarManuallyClosed = false;

// Mobile menu toggle
document.getElementById('mobile-menu-btn').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.scroll-animate').forEach(el => {
    observer.observe(el);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
            document.getElementById('mobile-menu').classList.add('hidden');
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('bg-gray-900');
        nav.classList.remove('bg-gray-900/95');
    } else {
        nav.classList.remove('bg-gray-900');
        nav.classList.add('bg-gray-900/95');
    }
    
    // Developer bar reveal logic
    const developerBar = document.getElementById('developer-bar');
    const scrollPosition = window.innerHeight + window.scrollY;
    const bodyHeight = document.body.offsetHeight;
    const currentScroll = window.scrollY;
    const scrollingDown = currentScroll > lastScrollPosition;
    
    if (scrollPosition >= bodyHeight - 200 && scrollingDown && !devBarManuallyClosed) {
        developerBar.classList.add('visible');
        updateDevBarArrow(true);
    } else if (scrollPosition < bodyHeight - 200) {
        developerBar.classList.remove('visible');
        devBarManuallyClosed = false;
        updateDevBarArrow(false);
    }
    
    lastScrollPosition = currentScroll;
});

// Update toggle based on bar state
function updateDevBarArrow(isOpen) {
    const arrow = document.getElementById('dev-bar-arrow');
    const text = document.getElementById('dev-bar-text');
    if (isOpen) {
        arrow.classList.remove('hidden');
        text.classList.add('hidden');
    } else {
        arrow.classList.add('hidden');
        text.classList.remove('hidden');
    }
}

// Hover reveal for developer bar
document.getElementById('developer-bar').addEventListener('mouseenter', function() {
    this.classList.add('visible');
    updateDevBarArrow(true);
});

document.getElementById('developer-bar').addEventListener('mouseleave', function() {
    if (devBarManuallyClosed) {
        this.classList.remove('visible');
        updateDevBarArrow(false);
    }
});

// Toggle button functionality
document.getElementById('dev-bar-toggle').addEventListener('click', function(e) {
    e.stopPropagation();
    const bar = document.getElementById('developer-bar');
    const isOpen = bar.classList.contains('visible');
    
    if (isOpen) {
        bar.classList.remove('visible');
        devBarManuallyClosed = true;
        updateDevBarArrow(false);
    } else {
        bar.classList.add('visible');
        devBarManuallyClosed = false;
        updateDevBarArrow(true);
    }
});

// Idle side developer panel logic
let idleTimer;
const idleTimeout = 10000; // 10 seconds
const developerSide = document.getElementById('developer-side');
let devSideManuallyClosed = false;

function resetIdle() {
    clearTimeout(idleTimer);
    if (!devSideManuallyClosed) {
        idleTimer = setTimeout(() => {
            developerSide.classList.add('visible');
        }, idleTimeout);
    }
}

function checkIdle() {
    clearTimeout(idleTimer);
    if (!devSideManuallyClosed) {
        idleTimer = setTimeout(() => {
            developerSide.classList.add('visible');
        }, idleTimeout);
    }
}

// Reset timer on user activity
window.addEventListener('mousemove', resetIdle);
window.addEventListener('scroll', resetIdle);
window.addEventListener('mousedown', resetIdle);
window.addEventListener('keydown', resetIdle);

// Hide button functionality for side panel
document.getElementById('hide-dev-side').addEventListener('click', function(e) {
    e.stopPropagation();
    developerSide.classList.remove('visible');
    devSideManuallyClosed = true;
    
    // Reset after close so it will trigger again after idle
    setTimeout(() => {
        devSideManuallyClosed = false;
        checkIdle();
    }, 1000);
});

// Initialize idle timer
checkIdle();

// Language toggle
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.getAttribute('data-lang')));
});

// Initial translation apply
setLanguage(currentLang);
