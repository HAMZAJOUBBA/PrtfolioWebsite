// Add this to your Three.js initialization or create a separate function
function initExperienceAnimations() {
    // Create floating elements around experience section
    const experienceGeometry = new THREE.TorusGeometry(0.3, 0.1, 16, 100);
    const experienceMaterial = new THREE.MeshPhongMaterial({
        color: 0x4facfe,
        transparent: true,
        opacity: 0.6,
        shininess: 100
    });

    // Create floating elements
    for (let i = 0; i < 8; i++) {
        const element = new THREE.Mesh(experienceGeometry, experienceMaterial);

        // Position around experience section area
        element.position.x = (Math.random() - 0.5) * 10;
        element.position.y = (Math.random() - 0.5) * 6 - 2;
        element.position.z = (Math.random() - 0.5) * 3;

        element.userData = {
            originalY: element.position.y,
            speed: Math.random() * 0.02 + 0.01,
            timeOffset: Math.random() * Math.PI * 2,
            rotationSpeed: Math.random() * 0.02 + 0.01
        };

        scene.add(element);
        waterDrops.push(element); // Add to existing waterDrops array or create new array
    }
}







// Project filtering functionality
document.addEventListener('DOMContentLoaded', function () {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Add Three.js floating elements for projects section
    // function initProjectsAnimations() {
    //     const projectsGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    //     const projectsMaterial = new THREE.MeshPhongMaterial({
    //         color: 0x00f2fe,
    //         transparent: true,
    //         opacity: 0.4,
    //         shininess: 100
    //     });

    //     // Create floating cubes around projects section
    //     for (let i = 0; i < 6; i++) {
    //         const cube = new THREE.Mesh(projectsGeometry, projectsMaterial);

    //         // Position around projects section area
    //         cube.position.x = (Math.random() - 0.5) * 12;
    //         cube.position.y = (Math.random() - 0.5) * 8 - 4;
    //         cube.position.z = (Math.random() - 0.5) * 4;

    //         cube.userData = {
    //             originalY: cube.position.y,
    //             speed: Math.random() * 0.01 + 0.005,
    //             timeOffset: Math.random() * Math.PI * 2,
    //             rotationSpeed: Math.random() * 0.02 + 0.01
    //         };

    //         scene.add(cube);
    //         waterDrops.push(cube);
    //     }
    // }


    // Enhanced projects animation with row sequencing


    // Initialize projects animations if Three.js is loaded
    if (typeof scene !== 'undefined') {
        initProjectsAnimations();
    }


});



function initEnhancedProjectsAnimations() {
    const projectCards = document.querySelectorAll('.project-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add delay based on card position for sequential effect
                const card = entry.target;
                const index = Array.from(projectCards).indexOf(card);
                const delay = (index % 3) * 100; // Stagger by columns
                
                setTimeout(() => {
                    card.classList.add('visible');
                }, delay);
            }
        });
    }, {
        threshold: 0.2
    });

    projectCards.forEach(card => {
        observer.observe(card);
    });
}












// Contact form functionality
document.addEventListener('DOMContentLoaded', function () {


    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn = this.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');

        // Show loading state
        btnText.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            // Show success message
            formStatus.textContent = 'Thank you! Your message has been sent successfully. I\'ll get back to you soon.';
            formStatus.className = 'contact-status success';

            // Reset form
            contactForm.reset();

            // Reset button
            btnText.textContent = 'Send Message';
            submitBtn.disabled = false;

            // Hide status message after 5 seconds
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        }, 2000);
    });

    // Form input animations
    const formInputs = document.querySelectorAll('.form-input, .form-textarea');

    formInputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.style.transform = 'scale(1.02)';
        });

        input.addEventListener('blur', function () {
            this.parentElement.style.transform = 'scale(1)';
        });
    });

    // Add Three.js floating elements for contact section
    function initContactAnimations() {
        const contactGeometry = new THREE.OctahedronGeometry(0.3, 0);
        const contactMaterial = new THREE.MeshPhongMaterial({
            color: 0x4facfe,
            transparent: true,
            opacity: 0.3,
            shininess: 100
        });

        // Create floating octahedrons around contact section
        for (let i = 0; i < 8; i++) {
            const octahedron = new THREE.Mesh(contactGeometry, contactMaterial);

            // Position around contact section area
            octahedron.position.x = (Math.random() - 0.5) * 15;
            octahedron.position.y = (Math.random() - 0.5) * 10 - 5;
            octahedron.position.z = (Math.random() - 0.5) * 5;

            octahedron.userData = {
                originalY: octahedron.position.y,
                speed: Math.random() * 0.008 + 0.004,
                timeOffset: Math.random() * Math.PI * 2,
                rotationSpeed: Math.random() * 0.015 + 0.01
            };

            scene.add(octahedron);
            waterDrops.push(octahedron);
        }
    }

    // Initialize contact animations if Three.js is loaded
    if (typeof scene !== 'undefined') {
        initContactAnimations();
    }
});

function initAboutAnimations() {
    if (!scene) return;

    // Create floating code brackets
    const bracketGeometry = new THREE.BoxGeometry(0.1, 0.4, 0.1);
    const bracketMaterial = new THREE.MeshPhongMaterial({
        color: 0x4facfe,
        transparent: true,
        opacity: 0.4
    });

    for (let i = 0; i < 4; i++) {
        const bracket = new THREE.Mesh(bracketGeometry, bracketMaterial);

        bracket.position.x = (Math.random() - 0.5) * 8;
        bracket.position.y = (Math.random() - 0.5) * 6 - 1;
        bracket.position.z = (Math.random() - 0.5) * 3;

        bracket.userData = {
            originalY: bracket.position.y,
            speed: Math.random() * 0.01 + 0.005,
            timeOffset: Math.random() * Math.PI * 2
        };

        scene.add(bracket);
        waterDrops.push(bracket);
    }
}




// ------------------------- NAVIGATION BAR FOR MOBILE RESPONSITIVITY ----------------------------


// Mobile navigation functionality
function initMobileNavigation() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('nav a');
    const overlay = document.getElementById('navOverlay');
    
    if (!hamburger || !nav) return;
    
    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        console.log("hambergr click");
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking on overlay
    if (overlay) {
        overlay.addEventListener('click', function() {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = nav.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);
        const isClickOnOverlay = overlay && overlay.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnHamburger && !isClickOnOverlay && nav.classList.contains('active')) {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && nav.classList.contains('active')) {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            // Reset mobile menu state on desktop
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}






// Call this after initializing Three.js
document.addEventListener('DOMContentLoaded', function () {
    //initThreeJS();
    // ... other initializations
      // Call this function after initializing Three.js
      initMobileNavigation();
    initExperienceAnimations();
    initAboutAnimations();
    initEnhancedProjectsAnimations();
    
});



