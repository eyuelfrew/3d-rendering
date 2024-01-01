import "./App.css";
import * as THREE from "three";
import gltfPath from "/models/dino/scene.gltf";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import WebGL from "three/addons/capabilities/WebGL.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { useEffect, useRef } from "react";
function App() {
  const containerRef = useRef();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let object;
    let objToRender = "dino";
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    camera.position.z = 5;
    let model;
    const loader = new GLTFLoader();
    loader.load(
      gltfPath,
      (gltf) => {
        model = gltf.scene;
        scene.add(model);
      },
      (xhl) => {
        console.log((xhl.loaded / xhl.total) * 100 + "% Loaded");
      },
      (error) => {
        console.log("Error Loading the model: ", error);
      }
    );
    camera.position.z = objToRender === "dino" ? 20 : 1;
    const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
    topLight.position.set(500, 500, 500); //top-left-ish
    topLight.castShadow = true;
    scene.add(topLight);
    const ambientLight = new THREE.AmbientLight(
      0x333333,
      objToRender === "dino" ? 5 : 0
    );
    scene.add(ambientLight);
    if (objToRender === "dino") {
      new OrbitControls(camera, renderer.domElement);
    }

    function animate() {
      requestAnimationFrame(animate);
      if (object && objToRender === "dino") {
        //I've played with the constants here until it looked good
        object.rotation.y = -3 + (mouseX / window.innerWidth) * 3;
        object.rotation.x = -1.2 + (mouseY * 2.5) / window.innerHeight;
      }
      renderer.render(scene, camera);
    }
    window.addEventListener("resize", function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
    document.onmousemove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    if (WebGL.isWebGLAvailable()) {
      animate();
    } else {
      const warnign = WebGL.getWebGLErrorMessage();
      console.log(warnign);
    }
  }, []);
  return <div ref={containerRef} />;
}

export default App;
