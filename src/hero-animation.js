const container = document.querySelector('.full-container');
const screen = document.querySelector('.hero-screen');

if (!container) {
    console.warn('Hero animation container not found.');
} else if (!window.THREE || !window.anime) {
    console.warn('Required libraries missing: Three.js or anime.js.');
} else {
    const style = getComputedStyle(container);
    const color = style.getPropertyValue('--hex-current-1').trim() || '#0a1f2d';
    const gridColorA = style.getPropertyValue('--hex-current-1').trim() || '#0ee0c8';
    const gridColorB = style.getPropertyValue('--hex-current-3').trim() || '#066d62';

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true,
    });
    renderer.shadowMap.enabled = true;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 3, 8);
    camera.lookAt(0, 0.2, 0);
    const cameraRig = new THREE.Group();
    cameraRig.add(camera);
    scene.add(cameraRig);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    const spot = new THREE.SpotLight(0xffffff, 3, 12, Math.PI / 5, 0.4);
    spot.position.set(0, 5, 0);
    spot.castShadow = true;
    scene.add(spot);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight.position.set(2, 3, 4);
    scene.add(dirLight);

    const groundGeometry = new THREE.PlaneGeometry(12, 12);
    const groundMaterial = new THREE.MeshLambertMaterial({ color });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const grid = new THREE.GridHelper(12, 24, gridColorA, gridColorB);
    grid.position.y = 0.001;
    scene.add(grid);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const baseMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.16,
        emissive: 0x00e5c8,
        emissiveIntensity: 0.8,
        shininess: 40,
        flatShading: false,
        side: THREE.DoubleSide,
    });

    const cubeColors = [0xff6b8f, 0x00e5c8, 0x7ef7d4];
    const cubes = [-2, 0, 2].map((x, index) => {
        const material = baseMaterial.clone();
        material.color.setHex(cubeColors[index]);
        material.emissive.setHex(cubeColors[index]);
        material.opacity = 0.18;
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(x, 0.5, 0);
        cube.castShadow = cube.receiveShadow = true;
        cube.renderOrder = 1;
        scene.add(cube);
        return cube;
    });

    function resize() {
        const rect = container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
            return;
        }
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(rect.width, rect.height);
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
    }

    resize();
    window.addEventListener('resize', resize);

    anime({
        targets: cameraRig.rotation,
        y: Math.PI * 2,
        duration: 20000,
        easing: 'linear',
        loop: true,
    });

    anime({
        targets: cubes[0].position,
        y: [0.5, 1, 0.5],
        duration: 2000,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
    });

    anime({
        targets: cubes[0].rotation,
        y: [0, Math.PI],
        duration: 2000,
        loop: true,
        easing: 'linear',
    });

    anime({
        targets: cubes[1].rotation,
        x: [-0.4, 0.4, -0.2],
        z: [0.4, -0.4, 0.2],
        duration: 2200,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
    });

    anime({
        targets: cubes[2].scale,
        y: [1, 0.25, 1],
        duration: 1800,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
    });

    anime({
        targets: cubes[2].position,
        y: [0.5, 1.2, 0.5],
        duration: 1800,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
    });

    anime({
        targets: screen,
        translateX: [0, 12, -12, 0],
        translateY: [0, 10, -10, 0],
        duration: 14000,
        loop: true,
        easing: 'easeInOutSine',
    });

    anime({
        targets: '.square',
        x: '15rem',
        scale: 1.25,
        skew: -45,
        rotate: '1turn',
        duration: 2800,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
    });

    if (anime.waapi) {
        anime.waapi.animate('.square', {
            transform: 'translateX(15rem) scale(1.25) skew(-45deg) rotate(1turn)',
            duration: 2800,
            direction: 'alternate',
            iterations: Infinity,
            easing: 'ease-in-out',
        });
    }

    function renderLoop() {
        renderer.render(scene, camera);
        requestAnimationFrame(renderLoop);
    }

    renderLoop();
}
