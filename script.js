// Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Scrolled Navbar Logic
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Custom Lagging Cursor Logic
const dot = document.querySelector('.cursor-dot');
const circle = document.querySelector('.cursor-circle');
const hoverTargets = document.querySelectorAll('.hover-target');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let circleX = mouseX;
let circleY = mouseY;

if (window.innerWidth > 768) {
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Dot follows instantly
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    });

    // Circle lags using linear interpolation (lerp)
    const renderCursor = () => {
        circleX += (mouseX - circleX) * 0.15;
        circleY += (mouseY - circleY) * 0.15;
        
        circle.style.left = `${circleX}px`;
        circle.style.top = `${circleY}px`;
        
        requestAnimationFrame(renderCursor);
    };
    renderCursor();

    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => circle.classList.add('hovered'));
        target.addEventListener('mouseleave', () => circle.classList.remove('hovered'));
    });
}

// Canvas Animated Grain
const canvas = document.getElementById('grain-canvas');
const ctx = canvas.getContext('2d');

let w, h, noiseData;

const resizeCanvas = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    createNoise();
};

const createNoise = () => {
    const idata = ctx.createImageData(w, h);
    const buffer32 = new Uint32Array(idata.data.buffer);
    const len = buffer32.length;

    for (let i = 0; i < len; i++) {
        if (Math.random() < 0.5) {
            buffer32[i] = 0xffffffff;
        }
    }
    noiseData = idata;
};

const drawNoise = () => {
    ctx.putImageData(noiseData, 0, 0);
    requestAnimationFrame(drawNoise);
};

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
drawNoise();

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

function initAnimations() {
    document.body.classList.remove('loading');
    
    // Hero Headline Reveal
    const headlineLines = document.querySelectorAll('.reveal-text');
    gsap.from(headlineLines, {
        y: '100%',
        duration: 1.5,
        stagger: 0.2,
        ease: 'power4.out',
        delay: 0.2
    });

    gsap.from('.reveal-fade', {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: 'power2.out',
        delay: 1.2
    });

    // Scroll Triggered Reveals
    const revealElements = document.querySelectorAll('.reveal-up');
    revealElements.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out'
        });
    });
}

if (document.readyState === 'complete') {
    initAnimations();
} else {
    window.addEventListener('load', initAnimations);
}
