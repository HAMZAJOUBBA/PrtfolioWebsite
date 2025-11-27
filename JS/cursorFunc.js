// Enhanced Fluid Water Drop Cursor with Advanced Physics
function initAdvancedWaterCursor() {
    const cursor = document.querySelector('.water-cursor');
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let accelerationX = 0;
    let accelerationY = 0;
    
    const physics = {
        friction: 0.88,        // Fluid resistance
        spring: 0.10,          // Attraction to mouse
        inertia: 0.95,         // Momentum preservation
        maxSpeed: 40,          // Maximum movement speed
        wobbleIntensity: 0.6   // Water wobble effect
    };
    
    let wobbleOffset = 0;
    
    function updateCursor() {
        // Calculate distance to target
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Spring physics with distance-based acceleration
        accelerationX = dx * physics.spring;
        accelerationY = dy * physics.spring;
        
        // Apply acceleration to velocity
        velocityX += accelerationX;
        velocityY += accelerationY;
        
        // Limit maximum speed
        const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
        if (speed > physics.maxSpeed) {
            velocityX = (velocityX / speed) * physics.maxSpeed;
            velocityY = (velocityY / speed) * physics.maxSpeed;
        }
        
        // Apply friction and inertia
        velocityX *= physics.friction;
        velocityY *= physics.friction;
        velocityX *= physics.inertia;
        velocityY *= physics.inertia;
        
        // Update position
        cursorX += velocityX;
        cursorY += velocityY;
        
        // Water wobble effect
        wobbleOffset += 0.3;
        const wobbleX = Math.sin(wobbleOffset) * physics.wobbleIntensity * Math.abs(velocityX);
        const wobbleY = Math.cos(wobbleOffset * 0.7) * physics.wobbleIntensity * Math.abs(velocityY);
        
        // Apply transformation with wobble
        cursor.style.transform = `translate(${cursorX + wobbleX}px, ${cursorY + wobbleY}px)`;
        
        // Dynamic shape changes based on movement
        const movementSpeed = Math.min(speed / 10, 1);
        const stretch = 1 + movementSpeed * 0.4;
        const squeeze = 1 - movementSpeed * 0.4;
        const rotation = Math.atan2(velocityY, velocityX) * (180 / Math.PI);
        
        const drop = cursor.querySelector('.cursor-drop');
        drop.style.transform = `
            rotate(${rotation}deg)
            scaleX(${squeeze})
            scaleY(${stretch})
        `;
        
        // Opacity based on speed (trail effect)
        drop.style.opacity = Math.max(0.7, 1 - movementSpeed * 0.3);
        
        requestAnimationFrame(updateCursor);
    }
    
    // Mouse tracking
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.opacity = '1';
        createSplash(mouseX, mouseY);


        mouseMoveTimeout = setTimeout(() => {
        cursor.style.opacity = '0.5';
    }, 150);
    });
    
    
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });
    
    // Interactive effects
    document.addEventListener('mousedown', () => {
        cursor.classList.add('click');
        createSplash(mouseX, mouseY);
    });
    
    document.addEventListener('mouseup', () => {
        cursor.classList.remove('click');
    });
    
    // Hover states
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .contact-item, .filter-btn, .cta-button, input, textarea');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
    
    updateCursor();
}

// Splash effect for clicks
function createSplash(x, y) {
    for (let i = 0; i < 3; i++) {
        const droplet = document.createElement('div');
        const angle = (Math.PI * 2 * i) / 3;
        const distance = 30 + Math.random() * 10;
        
        droplet.style.cssText = `
            position: fixed;
            width: 6px;
            height: 8px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            left: ${x+10}px;
            top: ${y+10}px;
            pointer-events: none;
            z-index: 9998;
            transform: translate(-50%, -50%);
            animation: dropletFall 0.6s ease-out forwards;
        `;
        
        document.body.appendChild(droplet);
        
        // Set custom properties for animation
        droplet.style.setProperty('--end-x', `${Math.cos(angle) * distance}px`);
        droplet.style.setProperty('--end-y', `${Math.sin(angle) * distance}px`);
        
        setTimeout(() => droplet.remove(), 600);
    }
}

// Add droplet animation to CSS
const dropletStyle = document.createElement('style');
dropletStyle.textContent = `
    @keyframes dropletFall {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.5;
        }
        100% {
            transform: translate(var(--end-x), var(--end-y)) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(dropletStyle);


document.addEventListener('DOMContentLoaded', function() {
    // Your existing initialization code...
    
    // Initialize water cursor (choose one version)
    //initWaterCursor(); // Basic version
    // OR
    initAdvancedWaterCursor(); // Enhanced physics version
});