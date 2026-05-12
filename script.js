// ========== ДОКУМЕНТ ГОТОВ ==========
document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initMobileMenu();
    initBackToTop();
    initCounters();
    initPortfolioFilter();
    initTestimonialsSlider();
    initContactForm();
    initSmoothScroll();
    generatePortfolioItems();
    
    addBackToTopButton();
});

// ==========================================
// 1. ПЕРЕКЛЮЧЕНИЕ ТЕМЫ
// ==========================================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        updateThemeIcon(true);
    } else if (savedTheme === 'light') {
        document.body.classList.remove('dark');
        updateThemeIcon(false);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark');
        updateThemeIcon(true);
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcon(isDark);
        });
    }
}

function updateThemeIcon(isDark) {
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// ==========================================
// 2. МОБИЛЬНОЕ МЕНЮ
// ==========================================
function initMobileMenu() {
    const burger = document.getElementById('mobileMenuBtn');
    if (burger) {
        burger.addEventListener('click', toggleMobileMenu);
    }
}

function toggleMobileMenu() {
    let mobileMenu = document.querySelector('.mobile-menu');
    if (!mobileMenu) {
        createMobileMenu();
        mobileMenu = document.querySelector('.mobile-menu');
    }
    mobileMenu.classList.toggle('active');
}

function createMobileMenu() {
    const navLinks = document.querySelectorAll('.nav__link');
    const menu = document.createElement('div');
    menu.className = 'mobile-menu';
    
    const list = document.createElement('ul');
    list.className = 'mobile-menu__list';
    
    navLinks.forEach(link => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = link.getAttribute('href');
        a.textContent = link.textContent;
        a.className = 'mobile-menu__link';
        a.onclick = () => {
            menu.classList.remove('active');
        };
        li.appendChild(a);
        list.appendChild(li);
    });
    
    menu.appendChild(list);
    document.body.appendChild(menu);
}

// ==========================================
// 3. BACK TO TOP
// ==========================================
function initBackToTop() {
    const backBtn = document.querySelector('.back-to-top');
    if (!backBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backBtn.classList.add('active');
        } else {
            backBtn.classList.remove('active');
        }
    });
}

function addBackToTopButton() {
    if (!document.querySelector('.back-to-top')) {
        const btn = document.createElement('button');
        btn.className = 'back-to-top';
        btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        btn.onclick = () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        document.body.appendChild(btn);
        initBackToTop();
    }
}

// ==========================================
// 4. АНИМИРОВАННЫЕ СЧЕТЧИКИ
// ==========================================
function initCounters() {
    const counters = [
        { element: document.getElementById('shootsCount'), target: 320 },
        { element: document.getElementById('happyClients'), target: 280 },
        { element: document.getElementById('citiesCount'), target: 14 },
        { element: document.getElementById('awardsCount'), target: 8 }
    ];
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = counters.find(c => c.element === entry.target);
                if (counter && !counter.animated) {
                    counter.animated = true;
                    animateCounter(counter.element, counter.target);
                }
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        if (counter.element) observer.observe(counter.element);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 60;
    const update = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    };
    update();
}

// ==========================================
// 5. ПОРТФОЛИО — 6 ФОТО (4 Природа, 2 Портрета)
// ==========================================

// Массив для 6 фотографий
const portfolioImages = [
    // Природа (4 фото)
    { category: 'nature', title: 'Ночной город', img: 'images/nature-1.jpg' },
    { category: 'nature', title: 'Мосты', img: 'images/nature-2.jpg' },
    { category: 'nature', title: 'Утренний восход', img: 'images/nature-3.jpg' },
    { category: 'nature', title: 'Закатный пейзаж', img: 'images/nature-4.jpg' },
    
    // Портрет в профиль (2 фото)
    { category: 'portrait', title: 'Портрет ', img: 'images/portrait-1.jpg' },
    { category: 'portrait', title: 'Портрет ', img: 'images/portrait-2.jpg' }
];

let currentFilter = 'all';

function generatePortfolioItems() {
    const grid = document.getElementById('portfolioGrid');
    if (!grid) return;
    
    // Фильтрация по выбранной категории
    const filtered = portfolioImages.filter(item => 
        currentFilter === 'all' || item.category === currentFilter
    );
    
    // Генерация карточек
    grid.innerHTML = filtered.map(item => `
        <div class="portfolio-item" data-category="${item.category}">
            <img src="${item.img}" alt="${item.title}" class="portfolio-item__image" onerror="this.src='https://placehold.co/600x400/f0f0f0/cccccc?text=image+not+found'">
            <div class="portfolio-item__overlay">
                <div class="portfolio-item__title">${item.title}</div>
                <div class="portfolio-item__category">${getCategoryName(item.category)}</div>
            </div>
        </div>
    `).join('');
    
    // Скрываем кнопку "Загрузить еще"
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = 'none';
    }
}

function getCategoryName(category) {
    const names = {
        nature: 'Природа',
        portrait: 'Портрет'
    };
    return names[category] || category;
}

function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            generatePortfolioItems();
        });
    });
    
    generatePortfolioItems();
}

// ==========================================
// 6. СЛАЙДЕР ОТЗЫВОВ
// ==========================================
let currentSlide = 0;

function initTestimonialsSlider() {
    const slider = document.getElementById('testimonialsSlider');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    
    if (!slider) return;
    
    const updateSlider = () => {
        const cardWidth = slider.children[0]?.offsetWidth || 300;
        slider.scrollTo({ left: currentSlide * (cardWidth + 32), behavior: 'smooth' });
    };
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentSlide > 0) {
                currentSlide--;
                updateSlider();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const maxSlides = Math.ceil(slider.children.length / (window.innerWidth >= 768 ? 2 : 1)) - 1;
            if (currentSlide < maxSlides) {
                currentSlide++;
                updateSlider();
            }
        });
    }
}

// ==========================================
// 7. ФОРМА ОБРАТНОЙ СВЯЗИ
// ==========================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name')?.value;
        const email = document.getElementById('email')?.value;
        const message = document.getElementById('message')?.value;
        const messageDiv = document.getElementById('formMessage');
        
        if (!name || !email || !message) {
            showFormMessage('Пожалуйста, заполните все обязательные поля', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showFormMessage('Пожалуйста, введите корректный email', 'error');
            return;
        }
        
        showFormMessage('Отправка...', 'info');
        
        setTimeout(() => {
            showFormMessage('Спасибо! Я свяжусь с вами в ближайшее время.', 'success');
            form.reset();
            setTimeout(() => {
                const msgDiv = document.getElementById('formMessage');
                if (msgDiv) msgDiv.style.display = 'none';
            }, 3000);
        }, 1000);
    });
}

function showFormMessage(text, type) {
    const messageDiv = document.getElementById('formMessage');
    if (messageDiv) {
        messageDiv.textContent = text;
        messageDiv.className = `form-message ${type}`;
        messageDiv.style.display = 'block';
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ==========================================
// 8. ПЛАВНАЯ ПРОКРУТКА
// ==========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ==========================================
// 9. МОДАЛЬНОЕ ОКНО
// ==========================================
function openBooking(service) {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.add('active');
        
        const serviceSelect = document.getElementById('service');
        if (serviceSelect) {
            const option = Array.from(serviceSelect.options).find(opt => opt.text === service);
            if (option) serviceSelect.value = option.value;
        }
    }
}

function closeModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) modal.classList.remove('active');
}