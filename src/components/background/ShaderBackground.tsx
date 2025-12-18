import { useEffect, useRef } from "react";
import * as THREE from "three";

import vertexShader from "../../shaders/vertex.glsl?raw";
import fragmentShader from "../../shaders/fragment.glsl?raw";
import Overlay from "../../shaders/Overlay.glsl?raw";


export default function ShaderBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const smoothMouse = useRef(new THREE.Vector2(0.5, 0.5));


  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const onMouseMove = (e: MouseEvent) => {
    mouse.current.x = e.clientX / window.innerWidth;
    mouse.current.y = 1.0 - e.clientY / window.innerHeight;
    };

    window.addEventListener("mousemove", onMouseMove);


    mountRef.current?.appendChild(renderer.domElement);

    /* ---------- BACKGROUND ---------- */
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        uMouse: { value: smoothMouse.current 
        },
      },
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);

    mesh.position.z = 0;
    scene.add(mesh);

    /* ---------- OVERLAY ---------- */
    const overlayMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: Overlay, 
      transparent: true,
      depthTest: false,        
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        uMouse: { value: smoothMouse.current 
        },
      },
    });

    const overlayMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      overlayMaterial
    );

    overlayMesh.position.z = 0;
    scene.add(overlayMesh);

    renderer.autoClear = false;
    mesh.renderOrder = 0;
    overlayMesh.renderOrder = 1;

    /* ---------- ANIMATION ---------- */
    const clock = new THREE.Clock();


    const animate = () => {
    const t = clock.getElapsedTime();

  // smooth mouse (critical for premium feel)
  smoothMouse.current.lerp(mouse.current, 0.08);

  material.uniforms.uTime.value = t;
  overlayMaterial.uniforms.uTime.value = t;

  material.uniforms.uMouse.value.copy(smoothMouse.current);
  overlayMaterial.uniforms.uMouse.value.copy(smoothMouse.current);

  renderer.clear();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  };


    animate();

    /* ---------- RESIZE ---------- */
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.uResolution.value.set(
        window.innerWidth,
        window.innerHeight
      );
      overlayMaterial.uniforms.uResolution.value.set(
        window.innerWidth,
        window.innerHeight
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);

      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
      }}
    />
  );
}
