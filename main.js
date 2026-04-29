// Three.js Background
// THREE is now loaded via global script tag in index.html

const initThree = () => {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 8;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
        size: 0.004,
        color: '#ffffff',
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    camera.position.z = 2;

    // Mouse Movement
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) - 0.5;
        mouseY = (event.clientY / window.innerHeight) - 0.5;
    });

    const animate = () => {
        requestAnimationFrame(animate);

        particlesMesh.rotation.y += 0.0005;
        particlesMesh.rotation.x += 0.0005;

        // Smooth reaction to mouse
        particlesMesh.rotation.y += mouseX * 0.02;
        particlesMesh.rotation.x += -mouseY * 0.02;

        renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// Card Tilt Effect
const initTilt = () => {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
};

// Search and Filtering Logic
const initFiltering = () => {
    const searchInput = document.getElementById('repo-search');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const noResultsMsg = document.getElementById('no-results-msg');

    let currentFilter = 'all';
    let currentSearch = '';

    const filterProjects = () => {
        let visibleCount = 0;

        projectCards.forEach(card => {
            const title = card.getAttribute('data-title').toLowerCase();
            const desc = card.getAttribute('data-desc').toLowerCase();
            const category = card.getAttribute('data-category');

            const matchesSearch = title.includes(currentSearch) || desc.includes(currentSearch);
            const matchesFilter = currentFilter === 'all' || category === currentFilter;

            if (matchesSearch && matchesFilter) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    };

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase();
            filterProjects();
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            filterProjects();
        });
    });
};

// Modal Logic
const initModal = () => {
    const modal = document.getElementById('modal');
    const closeBtn = document.getElementById('close-modal');
    const cards = document.querySelectorAll('.project-card');
    
    const mTitle = document.getElementById('m-title');
    const mDesc = document.getElementById('m-desc');
    const mImg = document.getElementById('m-img');
    const mLink = document.getElementById('m-link');

    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Only trigger if not clicking a link (though currently cards don't have internal links)
            const title = card.getAttribute('data-title');
            const desc = card.getAttribute('data-desc');
            const img = card.getAttribute('data-img');
            const link = card.getAttribute('data-link');
            
            if (mTitle) mTitle.textContent = title;
            if (mDesc) mDesc.textContent = desc;
            if (mImg) mImg.src = img;
            if (mLink) mLink.href = link;
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
};

document.addEventListener('DOMContentLoaded', () => {
    initThree();
    initTilt();
    initFiltering();
    initModal();
    
    // Set current year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});
