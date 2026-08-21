/* Lightweight enhancement layer for the static archive.
   Navigation between Theory / Adam / Juan Patricio is handled by normal HTML links. */

function updateActiveLocalNav() {
    const nav = document.querySelector('.section-rail .nav-group');
    if (!nav) return;

    const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
    if (!links.length) return;

    const offset = window.innerWidth <= 980 ? 150 : 125;
    let current = links[0];

    links.forEach(link => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target && target.getBoundingClientRect().top <= offset) current = link;
    });

    links.forEach(link => link.classList.toggle('active', link === current));
}

function updateComparisonSliders() {
    document.querySelectorAll('.comparison-slider').forEach(slider => {
        const range = slider.querySelector('.comparison-range');
        const leftLayer = slider.querySelector('.comparison-left-layer');
        const leftImage = slider.querySelector('.comparison-image-left');
        const divider = slider.querySelector('.comparison-divider');
        if (!range || !leftLayer || !leftImage || !divider) return;

        const position = Number(range.value || 50);
        leftLayer.style.width = position + '%';
        divider.style.left = position + '%';

        if (slider.clientWidth > 0) leftImage.style.width = slider.clientWidth + 'px';
        if (slider.clientHeight > 0) leftImage.style.height = slider.clientHeight + 'px';
    });
}

function initializeComparisonSliders() {
    document.querySelectorAll('.comparison-range').forEach(range => {
        if (range.dataset.initialized === 'true') return;
        range.dataset.initialized = 'true';
        range.addEventListener('input', updateComparisonSliders);
        range.addEventListener('change', updateComparisonSliders);
    });

    if ('ResizeObserver' in window) {
        const resizeObserver = new ResizeObserver(updateComparisonSliders);
        document.querySelectorAll('.comparison-slider').forEach(slider => resizeObserver.observe(slider));
    }

    updateComparisonSliders();
}

function loadDeferredFrames() {
    const frames = Array.from(document.querySelectorAll('iframe[data-src]'));
    if (!frames.length) return;

    const loadFrame = frame => {
        if (frame.dataset.loaded === 'true' || !frame.dataset.src) return;
        frame.dataset.loaded = 'true';
        frame.src = frame.dataset.src;
    };

    if (!('IntersectionObserver' in window)) {
        frames.forEach(loadFrame);
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            loadFrame(entry.target);
            observer.unobserve(entry.target);
        });
    }, { rootMargin: '700px 0px' });

    frames.forEach(frame => observer.observe(frame));
}

let navTicking = false;
window.addEventListener('scroll', () => {
    if (navTicking) return;
    navTicking = true;
    requestAnimationFrame(() => {
        updateActiveLocalNav();
        navTicking = false;
    });
}, { passive: true });

window.addEventListener('resize', () => {
    updateActiveLocalNav();
    updateComparisonSliders();
});

document.addEventListener('DOMContentLoaded', () => {
    updateActiveLocalNav();
    initializeComparisonSliders();
    loadDeferredFrames();

    document.querySelectorAll('.section-rail a[href^="#"]').forEach(link => {
        link.addEventListener('click', () => window.setTimeout(updateActiveLocalNav, 40));
    });
});
