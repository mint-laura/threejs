import * as THREE from "three";
import getLayer from "./libs/getLayer.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import getStarfield from "./libs/getStarfield.js";

const w = window.innerWidth;
const h = window.innerHeight;
let scrollPosY = 0; 

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;

const canvas = document.getElementById('three-canvas');

const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(w, h);

function initScene({ geo }){
    const geometry = geo;
    geometry.center();
    const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    scene.add(hemiLight);
    
    const  gradientLayer = getLayer({
        hue: 0.6,
        numSprites: 8,
        opacity: 0.2,
        radius: 10,
        size: 24,
        z: -10.5,
    })
    scene.add(gradientLayer);
    
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
}

const manager = new THREE.LoadingManager();
const loader = new OBJLoader(manager);
let sceneData = {};
manager.onLoad = () => initScene(sceneData);
loader.load("assets/astronaut.obj", (obj) => {
    let geometry;
    obj.traverse((child) => {
        if (child.type === "Mesh") {
            geometry = child.geometry;
        }
    });
    sceneData.geo = geometry;
})

window.addEventListener("scroll", () => {
    const scrollPosY = (window.scrollY / document.body.clientHeight);
})

function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleResize, false);