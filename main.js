/**
 * main.js, just for testing at the moment
 */

// Imports
import * as THREE from 'three'
import WebGL from 'three/addons/capabilities/WebGL.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// Check compatibility 
if(!WebGL.isWebGL2Available()) {
    const warning = WebGL.getWebGL2ErrorMessage();
    document.body.appendChild(warning);
    throw new Error("WebGL2 is not available");
}
// Scene

const scene = new THREE.Scene();

// Camera 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0,0,5)
camera.lookAt(0,0,0)

// Renderer 
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const css2DRenderer = new CSS2DRenderer();
css2DRenderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(css2DRenderer.domElement);

// Balle
const sphereGeometry = new THREE.SphereGeometry(1);
const sphereMaterial = new THREE.MeshBasicMaterial({color: 0xff0000})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

scene.add(sphere);

// Rectangle Left

const rectangleLeftGeometry = new THREE.PlaneGeometry(0.5,2);
const rectangleLeftMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.DoubleSide});
const rectangleLeft = new THREE.Mesh(rectangleLeftGeometry, rectangleLeftMaterial);
rectangleLeft.position.x = -5;
rectangleLeft.position.y = 0;

scene.add(rectangleLeft);

// Rectangle right

const rectangleRightGeometry = new THREE.PlaneGeometry(0.5,2);
const rectangleRightMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.DoubleSide});
const rectangleRight = new THREE.Mesh(rectangleRightGeometry, rectangleRightMaterial);
rectangleRight.position.x = 5;
rectangleRight.position.y = 0;

scene.add(rectangleRight);

/**
 * Animate method, animates the threejs components
 */
function animate() {
    renderer.render(scene,camera);
    css2DRenderer.render(scene,camera);
}

renderer.setAnimationLoop(animate)


// Ball label

const div = document.createElement("div");
div.className = "label";
div.style.color = "yellow";
div.textContent = "Balle";
const label = new CSS2DObject(div);
label.position.set(0, 6, 0);
  
sphere.add(label);

// Key events
window.addEventListener('keydown', (e) => {
    let key = e.key;
      
        if(key.toLowerCase() === "a")
            rectangleLeft.position.y += 0.1;
           
        if(key.toLowerCase() === "q")
            rectangleLeft.position.y -= 0.1;
        if(key.toLowerCase() === "z")
            rectangleRight.position.y += 0.1;
           
        if(key.toLowerCase() === "s")
            rectangleRight.position.y -= 0.1;

    
});

// Resize event

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    css2DRenderer.setSize(window.innerWidth, window.innerHeight);
});
