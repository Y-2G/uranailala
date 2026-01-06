"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";

declare global {
  interface Window {
    MindARThree: any;
    THREE: any;
  }
}

export default function ARExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mindarRef = useRef<any>(null);
  const frontGroupRef = useRef<any>(null);
  const backGroupRef = useRef<any>(null);

  // Initialize AR
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      if (!containerRef.current) return;

      try {
        // Step 1: Load Three.js UMD version first (sets window.THREE)
        if (!window.THREE) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/three@0.136.0/build/three.min.js";
            script.onload = () => {
              console.log("Three.js UMD loaded, window.THREE:", !!window.THREE);
              resolve();
            };
            script.onerror = () => reject(new Error("Failed to load Three.js"));
            document.head.appendChild(script);
          });
        }

        // Step 2: Add import map for MindAR's ES module imports
        if (!document.querySelector('script[type="importmap"]')) {
          const importMap = document.createElement("script");
          importMap.type = "importmap";
          importMap.textContent = JSON.stringify({
            imports: {
              "three": "https://cdn.jsdelivr.net/npm/three@0.136.0/build/three.module.js",
              "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.136.0/examples/jsm/",
            },
          });
          document.head.appendChild(importMap);
          await new Promise(resolve => setTimeout(resolve, 50));
        }

        // Step 3: Load MindAR module
        if (!window.MindARThree) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.type = "module";
            script.textContent = `
              import { MindARThree } from "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js";
              window.MindARThree = MindARThree;
              window.dispatchEvent(new Event('mindar-loaded'));
            `;
            document.head.appendChild(script);

            const handleLoaded = () => {
              window.removeEventListener("mindar-loaded", handleLoaded);
              resolve();
            };
            window.addEventListener("mindar-loaded", handleLoaded);

            setTimeout(() => {
              window.removeEventListener("mindar-loaded", handleLoaded);
              reject(new Error("MindAR load timeout"));
            }, 15000);
          });
        }

        if (!isMounted) return;

        console.log("MindAR loaded, initializing...");

        // Check if targets.mind exists
        try {
          const response = await fetch("/ar/targets.mind", { method: "HEAD" });
          if (!response.ok) {
            throw new Error(`targets.mind not found: ${response.status}`);
          }
          console.log("targets.mind found");
        } catch (fetchErr) {
          console.error("targets.mind check failed:", fetchErr);
          throw new Error("マーカーファイルが見つかりません。targets.mindを配置してください。");
        }

        // Get THREE from window
        const THREE = window.THREE;
        if (!THREE) {
          throw new Error("Three.js not available");
        }

        // Check if running in secure context (HTTPS or localhost)
        console.log("Checking secure context...");
        console.log("isSecureContext:", window.isSecureContext);
        console.log("protocol:", window.location.protocol);
        console.log("hostname:", window.location.hostname);
        
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("このブラウザはカメラにアクセスできません。HTTPSでアクセスするか、localhostを使用してください。");
        }

        // Check camera permissions first
        console.log("Checking camera access...");
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "environment" } 
          });
          stream.getTracks().forEach(track => track.stop());
          console.log("Camera access granted");
        } catch (camErr: any) {
          console.error("Camera error:", camErr);
          if (camErr?.name === "NotAllowedError") {
            throw new Error("カメラへのアクセスが拒否されました。ブラウザの設定を確認してください。");
          } else if (camErr?.name === "NotFoundError") {
            throw new Error("カメラが見つかりません。");
          }
          throw new Error("カメラにアクセスできません: " + (camErr?.message || "不明なエラー"));
        }

        // Initialize MindAR
        const MindARThree = window.MindARThree;
        console.log("Creating MindARThree instance...");
        
        const mindarThree = new MindARThree({
          container: containerRef.current,
          imageTargetSrc: "/ar/targets.mind",
          maxTrack: 2,
          uiLoading: "no",
          uiScanning: "no",
          uiError: "no",
        });

        console.log("MindARThree instance created");
        mindarRef.current = mindarThree;
        const { renderer, scene, camera } = mindarThree;
        console.log("Got renderer, scene, camera");

        // Setup lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(0, 1, 1);
        scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.5);
        pointLight.position.set(0, 0.5, 0.5);
        scene.add(pointLight);

        // Create anchors and 3D content
        const anchor0 = mindarThree.addAnchor(0);
        const frontGroup = createFrontContent(THREE);
        frontGroupRef.current = frontGroup;
        anchor0.group.add(frontGroup);

        const anchor1 = mindarThree.addAnchor(1);
        const backGroup = createBackContent(THREE);
        backGroupRef.current = backGroup;
        anchor1.group.add(backGroup);

        // Event handlers
        anchor0.onTargetFound = () => console.log("Front side detected");
        anchor0.onTargetLost = () => console.log("Front side lost");
        anchor1.onTargetFound = () => console.log("Back side detected");
        anchor1.onTargetLost = () => console.log("Back side lost");

        // Start AR
        console.log("Starting MindAR...");
        await mindarThree.start().catch((startErr: any) => {
          console.error("MindAR start error:", startErr);
          throw new Error("ARの起動に失敗しました。ページを再読み込みしてください。");
        });
        console.log("MindAR started successfully");

        if (!isMounted) {
          mindarThree.stop();
          return;
        }

        setIsLoading(false);

        // Animation loop
        let time = 0;
        renderer.setAnimationLoop(() => {
          time += 0.016;

          if (frontGroupRef.current) {
            frontGroupRef.current.rotation.y += 0.008;
            // Animate stars
            frontGroupRef.current.children.forEach((child: any, i: number) => {
              if (child.userData.isStar) {
                child.position.y = child.userData.baseY + Math.sin(time * 2 + i) * 0.02;
              }
            });
          }

          if (backGroupRef.current) {
            backGroupRef.current.rotation.y += 0.005;
            // Animate sun rays
            const raysGroup = backGroupRef.current.getObjectByName("raysGroup");
            if (raysGroup) {
              raysGroup.rotation.z += 0.01;
            }
          }

          renderer.render(scene, camera);
        });
      } catch (err: any) {
        console.error("AR initialization error:", err);
        console.error("Error message:", err?.message);
        console.error("Error stack:", err?.stack);
        if (isMounted) {
          const errorMessage = err?.message || "ARの初期化に失敗しました。カメラへのアクセスを許可してください。";
          setError(errorMessage);
          setIsLoading(false);
        }
      }
    };

    init();

    return () => {
      isMounted = false;
      if (mindarRef.current) {
        mindarRef.current.stop();
      }
    };
  }, []);

  return (
    <>
      <div ref={containerRef} className={styles.arContainer} />

      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingContent}>
            <div className={styles.spinner} />
            <p>ARを起動中...</p>
            <p className={styles.hint}>カメラへのアクセスを許可してください</p>
          </div>
        </div>
      )}

      {error && (
        <div className={styles.errorOverlay}>
          <div className={styles.errorContent}>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>再読み込み</button>
          </div>
        </div>
      )}
    </>
  );
}

// Create crystal ball with stars (front side)
function createFrontContent(THREE: any) {
  const group = new THREE.Group();

  // Crystal ball (outer)
  const sphereGeometry = new THREE.SphereGeometry(0.22, 32, 32);
  const sphereMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x9966ff,
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.9,
    thickness: 0.5,
    transparent: true,
    opacity: 0.85,
    envMapIntensity: 1,
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(0, 0.28, 0);
  group.add(sphere);

  // Inner glowing core
  const coreGeometry = new THREE.SphereGeometry(0.08, 16, 16);
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0xeeddff,
    transparent: true,
    opacity: 0.6,
  });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  core.position.set(0, 0.28, 0);
  group.add(core);

  // Base ring
  const ringGeometry = new THREE.TorusGeometry(0.28, 0.025, 16, 48);
  const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0xdd8855,
    metalness: 0.85,
    roughness: 0.15,
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  // Second decorative ring
  const ring2Geometry = new THREE.TorusGeometry(0.32, 0.012, 12, 48);
  const ring2Material = new THREE.MeshStandardMaterial({
    color: 0xcc7744,
    metalness: 0.7,
    roughness: 0.25,
  });
  const ring2 = new THREE.Mesh(ring2Geometry, ring2Material);
  ring2.rotation.x = Math.PI / 2;
  ring2.position.y = -0.02;
  group.add(ring2);

  // Orbiting stars
  const starGeometry = new THREE.OctahedronGeometry(0.035, 0);
  const starMaterial = new THREE.MeshStandardMaterial({
    color: 0xffdd44,
    emissive: 0xffdd44,
    emissiveIntensity: 0.6,
    metalness: 0.3,
    roughness: 0.4,
  });

  for (let i = 0; i < 8; i++) {
    const star = new THREE.Mesh(starGeometry, starMaterial.clone());
    const angle = (i / 8) * Math.PI * 2;
    const radius = 0.42;
    const baseY = 0.28 + Math.sin(i * 0.9) * 0.06;
    star.position.set(
      Math.cos(angle) * radius,
      baseY,
      Math.sin(angle) * radius
    );
    star.scale.setScalar(0.7 + Math.random() * 0.5);
    star.userData.isStar = true;
    star.userData.baseY = baseY;
    group.add(star);
  }

  // Small particles
  const particleGeometry = new THREE.SphereGeometry(0.008, 8, 8);
  const particleMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffcc,
    transparent: true,
    opacity: 0.8,
  });

  for (let i = 0; i < 20; i++) {
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const r = 0.35 + Math.random() * 0.15;
    particle.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      0.28 + r * Math.cos(phi) * 0.5,
      r * Math.sin(phi) * Math.sin(theta)
    );
    group.add(particle);
  }

  return group;
}

// Create sun with rays (back side)
function createBackContent(THREE: any) {
  const group = new THREE.Group();

  // Sun core
  const sunGeometry = new THREE.SphereGeometry(0.16, 32, 32);
  const sunMaterial = new THREE.MeshStandardMaterial({
    color: 0xffaa33,
    emissive: 0xffaa33,
    emissiveIntensity: 0.5,
  });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  sun.position.set(0, 0.22, 0);
  group.add(sun);

  // Inner bright core
  const innerGeometry = new THREE.SphereGeometry(0.08, 16, 16);
  const innerMaterial = new THREE.MeshBasicMaterial({
    color: 0xffeeaa,
  });
  const inner = new THREE.Mesh(innerGeometry, innerMaterial);
  inner.position.set(0, 0.22, 0);
  group.add(inner);

  // Sun rays group (for rotation)
  const raysGroup = new THREE.Group();
  raysGroup.name = "raysGroup";
  raysGroup.position.set(0, 0.22, 0);

  const rayGeometry = new THREE.ConeGeometry(0.022, 0.11, 8);
  const rayMaterial = new THREE.MeshStandardMaterial({
    color: 0xffcc55,
    emissive: 0xffcc55,
    emissiveIntensity: 0.35,
  });

  for (let i = 0; i < 12; i++) {
    const ray = new THREE.Mesh(rayGeometry, rayMaterial.clone());
    const angle = (i / 12) * Math.PI * 2;
    const distance = 0.28;
    ray.position.set(
      Math.cos(angle) * distance,
      0,
      Math.sin(angle) * distance
    );
    ray.rotation.z = -angle - Math.PI / 2;
    ray.rotation.x = Math.PI / 2;
    raysGroup.add(ray);
  }

  // Secondary rays (smaller)
  for (let i = 0; i < 12; i++) {
    const ray = new THREE.Mesh(
      new THREE.ConeGeometry(0.015, 0.07, 6),
      rayMaterial.clone()
    );
    const angle = (i / 12) * Math.PI * 2 + Math.PI / 12;
    const distance = 0.32;
    ray.position.set(
      Math.cos(angle) * distance,
      0,
      Math.sin(angle) * distance
    );
    ray.rotation.z = -angle - Math.PI / 2;
    ray.rotation.x = Math.PI / 2;
    raysGroup.add(ray);
  }

  group.add(raysGroup);

  // Floating stars
  const starGeometry = new THREE.TetrahedronGeometry(0.028, 0);
  const starMaterial = new THREE.MeshStandardMaterial({
    color: 0x886644,
    metalness: 0.5,
    roughness: 0.3,
  });

  for (let i = 0; i < 7; i++) {
    const star = new THREE.Mesh(starGeometry, starMaterial.clone());
    star.position.set(
      (Math.random() - 0.5) * 0.55,
      0.05 + Math.random() * 0.38,
      (Math.random() - 0.5) * 0.25
    );
    star.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    star.scale.setScalar(0.8 + Math.random() * 0.4);
    group.add(star);
  }

  // Small glowing particles
  const particleMaterial = new THREE.MeshBasicMaterial({
    color: 0xffeecc,
    transparent: true,
    opacity: 0.7,
  });

  for (let i = 0; i < 15; i++) {
    const particle = new THREE.Mesh(
      new THREE.SphereGeometry(0.006, 6, 6),
      particleMaterial
    );
    const angle = Math.random() * Math.PI * 2;
    const r = 0.2 + Math.random() * 0.25;
    particle.position.set(
      Math.cos(angle) * r,
      0.22 + (Math.random() - 0.5) * 0.3,
      Math.sin(angle) * r
    );
    group.add(particle);
  }

  return group;
}
