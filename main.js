import * as THREE from 'three'
import WebGL from 'three/addons/capabilities/WebGL.js';

if(!WebGL.isWebGL2Available()) {
    const warning = WebGL.getWebGL2ErrorMessage();
    document.body.appendChild(warning);
    throw new Error("WebGL2 is not available");
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene,camera)
}

renderer.setAnimationLoop(animate)


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

