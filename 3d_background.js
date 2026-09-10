
const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const starsGeometry = new THREE.BufferGeometry();
const starsCount = 3200;
const posArray = new Float32Array(starsCount * 3);

for (let i = 0; i < starsCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100;
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

function createStarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;

    const ctx = canvas.getContext('2d');
    const center = 16;
    const radius = 14;

    const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
}

const starsMaterial = new THREE.PointsMaterial({
    size: 0.15,
    map: createStarTexture(),
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
    depthWrite: false
});

const starMesh = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starMesh);

camera.position.z = 20;

let mouseX = 0;
let mouseY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX) * 0.0001;
    mouseY = (event.clientY - windowHalfY) * 0.0001;
});

const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    starMesh.rotation.y += 0.0001;
    starMesh.rotation.x += 0.00005;

    starMesh.rotation.y += mouseX * 0.5;
    starMesh.rotation.x += mouseY * 0.5;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


gsap.registerPlugin(ScrollTrigger);

function initPageAnimations() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const revealStart = 'top 85%';
    const revealActions = 'play none none none';

    const hero = document.querySelector('.hero');
    if (hero) {
        const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.9 } });

        tl.fromTo('.sub-title', { opacity: 0, y: 24 }, { opacity: 1, y: 0 })
            .fromTo('.main-title', { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, '-=0.55')
            .fromTo('.year', { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, '-=0.55')
            .fromTo('.hero-buttons .btn-resume', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1 }, '-=0.45');
    }

    const aboutCard = document.querySelector('.about-section .glass-card');
    if (aboutCard) {
        gsap.fromTo(
            aboutCard,
            { opacity: 0, y: 48 },
            {
                opacity: 1,
                y: 0,
                duration: 0.85,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: aboutCard,
                    start: revealStart,
                    toggleActions: revealActions,
                },
                onStart() {
                    aboutCard.classList.add('expanded');
                },
            }
        );

        const aboutTitle = aboutCard.querySelector('h2');
        const aboutText = aboutCard.querySelector('p');
        if (aboutTitle) {
            gsap.fromTo(
                aboutTitle,
                { opacity: 0, y: 18 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    delay: 0.15,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: aboutCard,
                        start: revealStart,
                        toggleActions: revealActions,
                    },
                }
            );
        }
        if (aboutText) {
            gsap.fromTo(
                aboutText,
                { opacity: 0, y: 18 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    delay: 0.28,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: aboutCard,
                        start: revealStart,
                        toggleActions: revealActions,
                    },
                }
            );
        }
    }

    document.querySelectorAll('.section-title').forEach((title) => {
        gsap.fromTo(
            title,
            { opacity: 0, y: 36 },
            {
                opacity: 1,
                y: 0,
                duration: 0.75,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: title,
                    start: revealStart,
                    toggleActions: revealActions,
                },
            }
        );
    });

    document.querySelectorAll('.timeline-item').forEach((item) => {
        const fromVars = isMobile
            ? { opacity: 0, y: 40 }
            : { opacity: 0, x: item.classList.contains('left') ? -60 : 60 };

        gsap.fromTo(item, fromVars, {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: item,
                start: revealStart,
                toggleActions: revealActions,
            },
        });
    });

    const projectCards = document.querySelectorAll('.experience-card');
    if (projectCards.length) {
        gsap.fromTo(
            projectCards,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out',
                stagger: 0.1,
                scrollTrigger: {
                    trigger: '.experience-grid',
                    start: revealStart,
                    toggleActions: revealActions,
                },
            }
        );
    }

    const skillCards = document.querySelectorAll('.skill-grid .skill-card');
    if (skillCards.length) {
        gsap.fromTo(
            skillCards,
            { opacity: 0, y: 28 },
            {
                opacity: 1,
                y: 0,
                duration: 0.45,
                ease: 'power2.out',
                stagger: 0.04,
                scrollTrigger: {
                    trigger: '.skill-grid',
                    start: revealStart,
                    toggleActions: revealActions,
                },
            }
        );
    }

    const profileCards = document.querySelectorAll('.profile-card');
    if (profileCards.length) {
        gsap.fromTo(
            profileCards,
            { opacity: 0, y: 32 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
                stagger: 0.08,
                scrollTrigger: {
                    trigger: '.profiles-grid',
                    start: revealStart,
                    toggleActions: revealActions,
                },
            }
        );
    }

    const profileHeader = document.querySelector('.profile-header');
    if (profileHeader) {
        gsap.fromTo(
            profileHeader,
            { opacity: 0, y: 28 },
            {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: profileHeader,
                    start: revealStart,
                    toggleActions: revealActions,
                },
            }
        );
    }

    const contactContainer = document.querySelector('.contact-container');
    if (contactContainer) {
        gsap.fromTo(
            contactContainer,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: contactContainer,
                    start: revealStart,
                    toggleActions: revealActions,
                },
            }
        );
    }

    ScrollTrigger.refresh();
}

if (document.getElementById('preloader')) {
    window.addEventListener('preloaderComplete', initPageAnimations, { once: true });
} else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageAnimations, { once: true });
} else {
    initPageAnimations();
}
