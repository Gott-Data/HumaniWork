// Humaniwork — Coming Soon Site JS

document.addEventListener('DOMContentLoaded', () => {

    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ---- Navbar background on scroll ----
    const nav = document.querySelector('.nav');
    const updateNav = () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(255,255,255,0.97)';
            nav.style.boxShadow = '0 1px 8px rgba(0,0,0,0.06)';
        } else {
            nav.style.background = 'rgba(255,255,255,0.92)';
            nav.style.boxShadow = 'none';
        }
    };
    window.addEventListener('scroll', updateNav, { passive: true });

    // ---- Animate stats on scroll ----
    const statsSection = document.querySelector('.stats');
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    const animateValue = (el, start, end, suffix, duration) => {
        const startTime = performance.now();
        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = start + (end - start) * eased;

            if (suffix === 'M') {
                el.textContent = current.toFixed(1) + suffix;
            } else if (suffix === '%') {
                el.textContent = Math.round(current) + suffix;
            } else {
                el.textContent = current.toFixed(1) + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                animateValue(statNumbers[0], 0, 3.1, 'M', 1500);
                animateValue(statNumbers[1], 0, 79, '%', 1500);
                animateValue(statNumbers[2], 0, 2.4, 'M', 1500);
            }
        });
    }, { threshold: 0.3 });

    if (statsSection) statsObserver.observe(statsSection);

    // ---- Fade-in on scroll ----
    const fadeElements = document.querySelectorAll(
        '.problem, .pillar, .module-card, .trust-item, .quote-content, .notify-inner'
    );

    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // ---- Form handling ----
    const form = document.getElementById('notifyForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Store locally (replace with actual backend later)
            const submissions = JSON.parse(localStorage.getItem('humaniwork_signups') || '[]');
            submissions.push({ ...data, timestamp: new Date().toISOString() });
            localStorage.setItem('humaniwork_signups', JSON.stringify(submissions));

            // Show success state (uses i18n if available)
            const t = typeof translations !== 'undefined' ? translations[currentLang] || {} : {};
            const successTitle = t['form.success.title'] || "You're on the list.";
            const successDesc = t['form.success.desc'] || "We'll be in touch when Humaniwork launches. Thank you for your interest.";
            form.innerHTML = `
                <div class="form-success">
                    <h3>${successTitle}</h3>
                    <p>${successDesc}</p>
                </div>
            `;
        });
    }
});
