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
const ballRadius = 0.25;
const sphereGeometry = new THREE.SphereGeometry(ballRadius);
const sphereMaterial = new THREE.MeshBasicMaterial({color: 0xff0000})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

scene.add(sphere);

// Rectangle Left

const rectangleLeftGeometry = new THREE.PlaneGeometry(0.25,2);
const rectangleLeftMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.DoubleSide});
const rectangleLeft = new THREE.Mesh(rectangleLeftGeometry, rectangleLeftMaterial);
rectangleLeft.position.x = -5;
rectangleLeft.position.y = 0;

scene.add(rectangleLeft);

// Rectangle right

const rectangleRightGeometry = new THREE.PlaneGeometry(0.25,2);
const rectangleRightMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.DoubleSide});
const rectangleRight = new THREE.Mesh(rectangleRightGeometry, rectangleRightMaterial);
rectangleRight.position.x = 5;
rectangleRight.position.y = 0;

scene.add(rectangleRight);

/**
 * Animate method, animates the threejs components
 */

let rightCollided = false;
function animate() {
   
    checkSphereBoxesCollision();
    updateObjectPosition()
    renderer.render(scene,camera);
    css2DRenderer.render(scene,camera);
}
let ballSpeed = 0.02;
let ballAdd = 0.01
function checkSphereBoxesCollision() {
    


    rectangleRight.updateMatrixWorld(true);
    rectangleLeft.updateMatrixWorld(true);
    const rectangleRightBB = new THREE.Box3().setFromObject(rectangleRight);
    const rectangleLeftBB = new THREE.Box3().setFromObject(rectangleLeft);
    const sphereBB = new THREE.Box3().setFromObject(sphere);
    if(sphereBB.intersectsBox(rectangleRightBB) && !rightCollided) {
        rightCollided = true;
        ballSpeed += ballAdd;
    } 
    
    
    if(sphereBB.intersectsBox(rectangleLeftBB)) {
       rightCollided = false;
       ballSpeed += ballAdd;
    } 
   
    if(rightCollided)  {
        sphere.position.x -= ballSpeed;
    } else {
        sphere.position.x += ballSpeed;
    }
}

renderer.setAnimationLoop(animate)

// Players label

const playerOneSpan = document.createElement("span");

playerOneSpan.style.color = "yellow";
playerOneSpan.textContent = "Player 1";
const playerOneLabel = new CSS2DObject(playerOneSpan);
rectangleLeft.geometry.computeBoundingBox()
const rectangleLeftHeight = rectangleLeft.geometry.parameters.height * 7.5;
playerOneLabel.position.set(0, rectangleLeftHeight / 2, 0);
playerOneLabel.rotation.set(0, Math.PI, 0)
rectangleLeft.add(playerOneLabel);

const playerTwoSpan = document.createElement("span");

playerTwoSpan.style.color = "yellow";
playerTwoSpan.textContent = "Player 2";
const playerTwoLabel = new CSS2DObject(playerTwoSpan);
const rectangleRightHeight = rectangleRight.geometry.parameters.height * 7.5;
playerTwoLabel.position.set(0, rectangleRightHeight / 2, 0);

rectangleRight.add(playerTwoLabel);

// Key events

const keyState = {
    a: false,
    q: false,
    z: false,
    s: false
}

window.addEventListener('keydown', (e) => {
    let key = e.key;
    if(keyState.hasOwnProperty(key)) {
        keyState[key] = true;
    }
       
});

window.addEventListener('keyup', (e) => {
    let key = e.key;
    if(keyState.hasOwnProperty(key)) {
        keyState[key] = false;
    }
       
});

function updateObjectPosition() {
    if(keyState['a']) rectangleLeft.position.y += 0.1;
    if(keyState['q']) rectangleLeft.position.y -= 0.1;
    if(keyState['z']) rectangleRight.position.y += 0.1;
    if(keyState['s']) rectangleRight.position.y -= 0.1;
}

// Resize event

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    css2DRenderer.setSize(window.innerWidth, window.innerHeight);
});
