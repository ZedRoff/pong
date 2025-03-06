import * as THREE from 'three'
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;
function animate() {
    cube.rotateX(0.01);
    renderer.render(scene,camera)
}

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate)
document.body.appendChild(renderer.domElement);

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case "ArrowRight":
            cube.position.x += 0.1;
            break;
        case "ArrowLeft":
            cube.position.x -= 0.1;
            break;
        case "ArrowUp":
            cube.position.y += 0.1;
            break;
        case "ArrowDown":
            cube.position.y -= 0.1;
            break;
    }
});