// Three.js Scene Setup
let scene, camera, renderer;
let waterDrops = [];
let mouse = new THREE.Vector2();
let mouseWorld = new THREE.Vector3();
let raycaster = new THREE.Raycaster();
const avoidanceRadius = 2.5;
const dropCount = 70;


// Add these variables for scroll effect
let scrollProgress = 0;
let targetCameraZ = 8; // Start position
let isScrolling = false;
let scrollTimeout;

// Initialize Three.js
function initThreeJS() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f1b33);
    scene.fog = new THREE.Fog(0x0f1b33, 5, 15);

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8;

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.getElementById('three-container').appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x4facfe, 0.5, 20);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    // Create water drops
    createWaterDrops();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Track mouse position
    document.addEventListener('mousemove', onMouseMove);

    // Start animation
    animate();
}

function createWaterDrops() {
    const geometry = new THREE.SphereGeometry(0.8, 32, 32);

    for (let i = 0; i < dropCount; i++) {
        // Create material with water-like properties
        const material = new THREE.MeshPhongMaterial({
            //color: new THREE.Color().setHSL(Math.random() * 0.1 + 0.5, 0.8, 0.1),
            color: new THREE.Color(0xffffff),
            transparent: true,
            opacity: 0.1,
            shininess: 100,
            specular: new THREE.Color(0.8, 0.8, 1.0),
            refractionRatio: 0.8
        });

        const drop = new THREE.Mesh(geometry, material);

        // Random position within bounds
        drop.position.x = (Math.random() - 0.5) * 12;
        drop.position.y = (Math.random() - 0.5) * 8;
        drop.position.z = (Math.random() - 0.5) * 4;

        // Random size variation
        const scale = Math.random() * 0.5 + 0.5;
        drop.scale.set(scale, scale, scale);

        // Store properties for animation
        drop.userData = {
            originalPosition: new THREE.Vector3().copy(drop.position),
            velocity: new THREE.Vector3(),
            avoidanceForce: new THREE.Vector3(),
            inertia: Math.random() * 0.02 + 0.01,
            elasticity: Math.random() * 0.2 + 0.8,
            wobbleSpeed: Math.random() * 0.02 + 0.01,
            wobbleAmount: Math.random() * 0.1 + 0.05,
            timeOffset: Math.random() * Math.PI * 2
        };

        scene.add(drop);
        waterDrops.push(drop);
    }
}

function onMouseMove(event) {
    // Convert mouse position to normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update raycaster and get mouse position in 3D space
    raycaster.setFromCamera(mouse, camera);

    // Create a plane at z=0 to intersect with
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    raycaster.ray.intersectPlane(plane, mouseWorld);
}

/*function updateWaterDrops() {
    const time = Date.now() * 0.001;

    waterDrops.forEach(drop => {
        const data = drop.userData;

        // Calculate distance to mouse
        const distanceToMouse = drop.position.distanceTo(mouseWorld);

        // Apply avoidance force if mouse is close
        if (distanceToMouse < avoidanceRadius) {
            // Calculate avoidance direction (away from mouse)
            data.avoidanceForce.subVectors(drop.position, mouseWorld).normalize();

            // Strength based on proximity (stronger when closer)
            const avoidanceStrength = (avoidanceRadius - distanceToMouse) / avoidanceRadius;
            data.avoidanceForce.multiplyScalar(avoidanceStrength * 0.1);

            // Add to velocity
            data.velocity.add(data.avoidanceForce);
        }

        // Apply restoring force to return to original position
        const restoreForce = new THREE.Vector3().subVectors(data.originalPosition, drop.position);
        restoreForce.multiplyScalar(0.02);
        data.velocity.add(restoreForce);

        // Apply damping (friction)
        data.velocity.multiplyScalar(0.95);

        // Update position
        drop.position.add(data.velocity);

        // Add natural wobble
        const wobbleX = Math.sin(time * data.wobbleSpeed + data.timeOffset) * data.wobbleAmount;
        const wobbleY = Math.cos(time * data.wobbleSpeed * 1.3 + data.timeOffset) * data.wobbleAmount;
        drop.position.x += wobbleX * 0.1;
        drop.position.y += wobbleY * 0.1;

        // Add slight rotation
        drop.rotation.x += 0.01;
        drop.rotation.y += 0.01;

        // Scale effect based on velocity (squash and stretch)
        const velocityMagnitude = data.velocity.length();
        const stretch = 1 + velocityMagnitude * 2;
        const squash = 1 - velocityMagnitude;
        drop.scale.x = drop.scale.z * stretch;
        drop.scale.y = drop.scale.z * squash;

        // Boundary constraints
        const bounds = 6;
        if (Math.abs(drop.position.x) > bounds) {
            drop.position.x = Math.sign(drop.position.x) * bounds;
            data.velocity.x *= -data.elasticity;
        }
        if (Math.abs(drop.position.y) > bounds) {
            drop.position.y = Math.sign(drop.position.y) * bounds;
            data.velocity.y *= -data.elasticity;
        }

        // Update material based on velocity and mouse proximity
        const intensity = Math.min(data.velocity.length() * 5, 1);
        const mouseIntensity = Math.max(0, 1 - (distanceToMouse / avoidanceRadius));

        drop.material.color.lerp(
            new THREE.Color().setHSL(
                //0.5 + mouseIntensity * 0.2, 
                //0.8, 
                //0.5 + intensity * 0.3
                0.6,  // Slight blue tint
                0.3,  // Low saturation for subtle color
                0.3 + mouseIntensity * 0.2
            ),
            0.1
        );

        drop.material.opacity = 0.7 + intensity * 0.3;
    });
}*/

/*function animate() {
    requestAnimationFrame(animate);

    updateWaterDrops();

    // Slight camera movement for dynamic feel
    camera.position.x = Math.sin(Date.now() * 0.0005) * 0.9;
    camera.position.y = Math.cos(Date.now() * 0.0003) * 0.9;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
}*/

function updateWaterDrops() {
    const time = Date.now() * 0.001;

    waterDrops.forEach(drop => {
        const data = drop.userData;

        // Calculate distance to mouse
        const distanceToMouse = drop.position.distanceTo(mouseWorld);

        // Apply avoidance force if mouse is close
        if (distanceToMouse < avoidanceRadius) {
            // Calculate avoidance direction (away from mouse)
            data.avoidanceForce.subVectors(drop.position, mouseWorld).normalize();

            // Strength based on proximity (stronger when closer)
            const avoidanceStrength = (avoidanceRadius - distanceToMouse) / avoidanceRadius;
            data.avoidanceForce.multiplyScalar(avoidanceStrength * 0.1);

            // Add to velocity
            data.velocity.add(data.avoidanceForce);
        }

        // Apply restoring force to return to original position
        const restoreForce = new THREE.Vector3().subVectors(data.originalPosition, drop.position);
        restoreForce.multiplyScalar(0.02);
        data.velocity.add(restoreForce);

        // Apply damping (friction)
        data.velocity.multiplyScalar(0.95);

        // Update position
        drop.position.add(data.velocity);

        // Add natural wobble
        const wobbleX = Math.sin(time * data.wobbleSpeed + data.timeOffset) * data.wobbleAmount;
        const wobbleY = Math.cos(time * data.wobbleSpeed * 1.3 + data.timeOffset) * data.wobbleAmount;
        drop.position.x += wobbleX * 0.1;
        drop.position.y += wobbleY * 0.1;

        // Add slight rotation
        drop.rotation.x += 0.01;
        drop.rotation.y += 0.01;

        // Scale effect based on velocity (squash and stretch)
        const velocityMagnitude = data.velocity.length();
        const stretch = 1 + velocityMagnitude * 2;
        const squash = 1 - velocityMagnitude;
        drop.scale.x = drop.scale.z * stretch;
        drop.scale.y = drop.scale.z * squash;

        // Boundary constraints
        const bounds = 6;
        if (Math.abs(drop.position.x) > bounds) {
            drop.position.x = Math.sign(drop.position.x) * bounds;
            data.velocity.x *= -data.elasticity;
        }
        if (Math.abs(drop.position.y) > bounds) {
            drop.position.y = Math.sign(drop.position.y) * bounds;
            data.velocity.y *= -data.elasticity;
        }

        // Update material based on velocity, mouse proximity, AND camera distance
        const intensity = Math.min(data.velocity.length() * 5, 1);
        const mouseIntensity = Math.max(0, 1 - (distanceToMouse / avoidanceRadius));
        
        // Calculate distance from camera for scroll effect
        const distanceFromCamera = drop.position.z - camera.position.z;
        const cameraDistanceIntensity = Math.max(0, 1 - (Math.abs(distanceFromCamera) / 20));

        drop.material.color.lerp(
            new THREE.Color().setHSL(
                0.6,  // Slight blue tint
                0.3,  // Low saturation for subtle color
                0.3 + mouseIntensity * 0.2
            ),
            0.1
        );

        // Enhanced opacity calculation with camera distance
        drop.material.opacity = 0.1 + (intensity * 0.3) + (mouseIntensity * 0.3) + (cameraDistanceIntensity * 0.3);
    });
}

function animate() {
    requestAnimationFrame(animate);
    
    updateWaterDrops();
    
    // Smooth camera movement towards target Z
    camera.position.z += (targetCameraZ - camera.position.z) * 0.05;
    
    // Keep the subtle camera movement but reduce it while scrolling
    if (!isScrolling) {
        camera.position.x = Math.sin(Date.now() * 0.0005) * 0.9;
        camera.position.y = Math.cos(Date.now() * 0.0003) * 0.9;
    }
    
    camera.lookAt(0, 0, 0);
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


// Scroll handling for forward movement effect
function initScrollHandling() {
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const scrollDelta = scrollY - lastScrollY;
        lastScrollY = scrollY;
        
        // Calculate scroll progress (0 to 1)
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;
        
        // Map scroll progress to camera Z position
        // Start at z=8, move forward to z=-15 as you scroll down
        targetCameraZ = 8 - (scrollProgress * 23);
        
        isScrolling = true;
        
        // Clear previous timeout
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 100);
    });
}





// Advanced scroll animations with progress tracking
function initAdvancedExperienceAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const element = entry.target;
            const ratio = entry.intersectionRatio;
            
            // Calculate visibility progress (0 to 1)
            // 0 = completely out of view, 1 = completely in view
            const progress = Math.min(ratio * 2, 1); // Adjust multiplier for sensitivity
            
            if (entry.isIntersecting) {
                // Element is entering or in viewport
                element.style.opacity = progress;
                element.style.transform = `translateY(${50 * (1 - progress)}px)`;
                element.classList.add('in-viewport');
            } else {
                // Element is leaving viewport
                element.style.opacity = 0;
                element.style.transform = 'translateY(50px)';
                element.classList.remove('in-viewport');
            }
        });
    }, {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: '0px 0px -20% 0px'
    });

    timelineItems.forEach(item => {
        observer.observe(item);
    });
}








// Animate project filters
function initFiltersAnimation() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.3
    });

    filterButtons.forEach(button => {
        observer.observe(button);
    });
}





// Initialize when page loads
window.addEventListener('DOMContentLoaded', function(){ 
    initThreeJS();
    initScrollHandling();
    initAdvancedExperienceAnimations();
    initFiltersAnimation(); 
});