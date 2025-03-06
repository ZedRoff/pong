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
let cameraZ = 6;
camera.position.set(0,0,cameraZ)
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
let {left, right} = getCameraBoundaries();
let offset = 1;
const rectangleLeftGeometry = new THREE.PlaneGeometry(0.25,2);
const rectangleLeftMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.DoubleSide});
const rectangleLeft = new THREE.Mesh(rectangleLeftGeometry, rectangleLeftMaterial);
rectangleLeft.position.x = left + offset;
rectangleLeft.position.y = 0;

scene.add(rectangleLeft);

// Rectangle right

const rectangleRightGeometry = new THREE.PlaneGeometry(0.25,2);
const rectangleRightMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.DoubleSide});
const rectangleRight = new THREE.Mesh(rectangleRightGeometry, rectangleRightMaterial);
rectangleRight.position.x = right - offset;
rectangleRight.position.y = 0;

scene.add(rectangleRight);

/**
 * Animate method, animates the threejs components
 */

let rightCollided = false;
function animate() {
   
    moveBall();
    updateObjectPosition()
    renderer.render(scene,camera);
    css2DRenderer.render(scene,camera);
}
let baseSpeed = 0.02;
let ballSpeed = baseSpeed;
let ballAdd = 0.01
let ballMaxSpeed = 0.1;

function checkSphereBoxesCollision() {
    rectangleRight.updateMatrixWorld(true);
    rectangleLeft.updateMatrixWorld(true);
    const rectangleRightBB = new THREE.Box3().setFromObject(rectangleRight);
    const rectangleLeftBB = new THREE.Box3().setFromObject(rectangleLeft);
    const sphereBB = new THREE.Box3().setFromObject(sphere);
    return {leftBox: sphereBB.intersectsBox(rectangleLeftBB), rightBox: sphereBB.intersectsBox(rectangleRightBB)};
}
function getCameraBoundaries() {
    const aspect = window.innerWidth / window.innerHeight;
    const frustumHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    const frustumWidth = frustumHeight * aspect;
    return {
        left: -frustumWidth / 2,
        right: frustumWidth / 2,
        top: frustumHeight / 2,
        bottom: -frustumHeight / 2
    };
}
function checkSphereScreenCollision() {
    let {right, left, top, bottom} = getCameraBoundaries();
    return {leftCollision: sphere.position.x - ballRadius <= left, rightCollision: sphere.position.x + ballRadius >= right, topCollision: sphere.position.y + ballRadius >= top, bottomCollision: sphere.position.y - ballRadius <= bottom};
}
let diff = 0;
let angle = 0;
let dir = 1;

let playerOneScore = 0;
let playerTwoScore = 0;


const scoreSpan = document.createElement("span");
scoreSpan.style.color = "red";
scoreSpan.textContent = "0 | 0";
const scoreLabel = new CSS2DObject(scoreSpan);
scoreLabel.position.set(0, 13, 0);
scene.add(scoreLabel);

function moveBall() {
    const {leftBox, rightBox} = checkSphereBoxesCollision();
    const {leftCollision, rightCollision, topCollision, bottomCollision} = checkSphereScreenCollision();
    
    if(leftCollision || rightCollision) {
        rightCollision ? playerOneScore++ : playerTwoScore++;
        scoreSpan.textContent = `${playerOneScore} | ${playerTwoScore}`
        sphere.position.set(0,0,0);
        ballSpeed = baseSpeed;
        diff = 0;
    }
    if(topCollision || bottomCollision) {
        angle=-angle;
    }
   
    if(rightBox || leftBox) {
        let rectangle = rightBox ? rectangleRight : rectangleLeft;
        dir = rightBox ? -1 : 1;
        diff = (sphere.position.y - rectangle.position.y) / rectangle.geometry.parameters.height;
        let mul = diff == 0 ? 0 : 1;
        angle = (mul) * Math.PI / 2 + Math.abs(diff) * -Math.PI;
    } 
  
    
    sphere.position.x += (dir) * Math.cos(angle) * ballSpeed;
    sphere.position.y +=  Math.sin(angle) * ballSpeed;
   
  
}

renderer.setAnimationLoop(animate)

// Players label
let i = 1;
function generatePlayer(rectangle) {
  
    const playerSpan = document.createElement("span");
    playerSpan.style.color = "yellow";
    playerSpan.textContent = "Player "+i;
    const playerLabel = new CSS2DObject(playerSpan);
    rectangle.geometry.computeBoundingBox()
    const rectangleHeight = rectangle.geometry.parameters.height * 7.5;
    playerLabel.position.set(0, rectangleHeight / 2, 0);
    playerLabel.rotation.set(0, Math.PI, 0)
    rectangle.add(playerLabel);
    i++;
}
generatePlayer(rectangleLeft);
generatePlayer(rectangleRight);


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
    const rectangleLeftHeight = rectangleLeft.geometry.parameters.height;
    const rectangleRightHeight = rectangleRight.geometry.parameters.height;
    let {top, bottom} = getCameraBoundaries();

    if (keyState['a'] && rectangleLeft.position.y + rectangleLeftHeight / 2 < top) {
        rectangleLeft.position.y += 0.1;  
    } 
    if (keyState['q'] && rectangleLeft.position.y - rectangleLeftHeight / 2 > bottom) {
        rectangleLeft.position.y -= 0.1;  
    }

    if (keyState['z'] && rectangleRight.position.y + rectangleRightHeight / 2 < top) {
        rectangleRight.position.y += 0.1;  
    }
    if (keyState['s'] && rectangleRight.position.y - rectangleRightHeight / 2 > bottom) {
        rectangleRight.position.y -= 0.1;  
    }
}

// Resize event

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    css2DRenderer.setSize(window.innerWidth, window.innerHeight);
});
