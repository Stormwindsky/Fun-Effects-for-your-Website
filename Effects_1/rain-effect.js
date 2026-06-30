// Wait for the page to load
window.addEventListener('load', () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Alpha for transparency

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Style for the overlay
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.pointerEvents = 'none'; // To avoid blocking clicks on the site
    renderer.domElement.style.zIndex = '9999';
    document.body.appendChild(renderer.domElement);

    // --- Rain Geometry ---
    const rainCount = 1500;
    const rainGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(rainCount * 3);
    const velocities = new Float32Array(rainCount);

    for (let i = 0; i < rainCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 20;     // X
        positions[i + 1] = Math.random() * 20;         // Y
        positions[i + 2] = (Math.random() - 0.5) * 10; // Z
        velocities[i/3] = 0.1 + Math.random() * 0.2;   // Individual speed
    }

    rainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const rainMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.1,
        transparent: true,
        opacity: 0.6
    });

    const rain = new THREE.Points(rainGeometry, rainMaterial);
    scene.add(rain);

    // --- Splash Effect (Simple) ---
    // Create a small circle that animates on the ground (Y = 0)
    const splashGeometry = new THREE.RingGeometry(0.01, 0.05, 8);
    const splashMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0 });
    const splash = new THREE.Mesh(splashGeometry, splashMaterial);
    splash.rotation.x = -Math.PI / 2;
    scene.add(splash);

    camera.position.z = 5;

    // --- Animation ---
    function animate() {
        requestAnimationFrame(animate);

        const positions = rainGeometry.attributes.position.array;

        for (let i = 0; i < rainCount; i++) {
            let idx = i * 3 + 1; // Index of the Y coordinate
            positions[idx] -= velocities[i]; // Rain falls

            // If the droplet hits the "ground"
            if (positions[idx] < -5) {
                // Trigger the splash at this position
                splash.position.set(positions[idx - 1], -5, positions[idx + 1]);
                splash.material.opacity = 0.5;
                splash.scale.set(1, 1, 1);
                
                // Reset the droplet
                positions[idx] = 10;
            }
        }

        // Smooth splash animation (fade out)
        if (splash.material.opacity > 0) {
            splash.material.opacity -= 0.02;
            splash.scale.x += 0.1;
            splash.scale.y += 0.1;
        }

        rainGeometry.attributes.position.needsUpdate = true;
        renderer.render(scene, camera);
    }

    // Handle resizing
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
});
