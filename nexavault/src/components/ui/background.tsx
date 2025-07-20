import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three'; // Import Three.js

// Background component for the application, featuring a 3D animated grid
// with illuminative white dots using Three.js, alongside existing SVG elements.
const Background = () => {
  const mountRef = useRef<HTMLDivElement>(null); // Ref for the div where the Three.js canvas will be mounted

  // Callback to create the 3D grid and dots using Three.js
  const create3dElements = useCallback((scene: THREE.Scene) => {
    // Clean up previous meshes if they exist to prevent memory leaks on re-renders
    while (scene.children.length > 0) {
      const child = scene.children[0];
      if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments || child instanceof THREE.Points || child instanceof THREE.Group) {
        if ('geometry' in child && child.geometry) child.geometry.dispose();
        if ('material' in child && child.material) (child.material as THREE.Material).dispose();
        if ('children' in child && Array.isArray(child.children)) {
            child.children.forEach(c => { // Dispose children of groups if any
                if (c instanceof THREE.Mesh || c instanceof THREE.LineSegments || c instanceof THREE.Points) {
                    if ('geometry' in c && c.geometry) c.geometry.dispose();
                    if ('material' in c && c.material) (c.material as THREE.Material).dispose();
                }
            });
        }
      }
      scene.remove(child);
    }

    // --- Grid Lines ---
    const gridDivisions = 30; // Number of lines in each direction
    const gridSize = 20;     // Size of the grid (kept from previous "bigger" request)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xFFFFFF, // White lines
      transparent: true,
      opacity: 0.05,   // Very subtle, faint lines
      linewidth: 0.5   // This property might not have effect in WebGLRenderer unless using LineSegments
    });

    const lines = new THREE.Group();
    const halfSize = gridSize / 2;

    // Horizontal and Vertical lines
    for (let i = 0; i <= gridDivisions; i++) {
      const x = (i / gridDivisions) * gridSize - halfSize;
      const y = (i / gridDivisions) * gridSize - halfSize;

      // Vertical line
      const verticalPoints = [];
      verticalPoints.push(new THREE.Vector3(x, -halfSize, 0));
      verticalPoints.push(new THREE.Vector3(x, halfSize, 0));
      lines.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(verticalPoints), lineMaterial));

      // Horizontal line
      const horizontalPoints = [];
      horizontalPoints.push(new THREE.Vector3(-halfSize, y, 0));
      horizontalPoints.push(new THREE.Vector3(halfSize, y, 0));
      lines.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(horizontalPoints), lineMaterial));
    }

    // Diagonal lines (simplified for a diamond-like pattern effect)
    const diagonalMaterial = new THREE.LineBasicMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.03 // Even more subtle
    });

    const numDiagonalLines = 10;
    for(let i = 0; i < numDiagonalLines; i++) {
        const offset = (i / (numDiagonalLines - 1)) * gridSize;

        // Top-left to bottom-right diagonals
        const diag1Points = [];
        diag1Points.push(new THREE.Vector3(-halfSize + offset, halfSize, 0));
        diag1Points.push(new THREE.Vector3(halfSize, -halfSize + offset, 0));
        lines.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(diag1Points), diagonalMaterial));

        // Top-right to bottom-left diagonals
        const diag2Points = [];
        diag2Points.push(new THREE.Vector3(halfSize - offset, halfSize, 0));
        diag2Points.push(new THREE.Vector3(-halfSize, -halfSize + offset, 0));
        lines.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(diag2Points), diagonalMaterial));
    }

    scene.add(lines);


    // --- Illuminative White Dots ---
    const dotCount = 500; // Number of dots
    const positions = new Float32Array(dotCount * 3);
    const dotColor = new THREE.Color(0xFFFFFF); // White color
    const dotMaterial = new THREE.PointsMaterial({
      color: dotColor,
      size: 0.05, // Size of each dot
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.7, // More visible
      blending: THREE.AdditiveBlending // Makes them glow by adding light
    });

    for (let i = 0; i < dotCount; i++) {
      // Random positions within the grid bounds, slightly distributed in Z for depth
      positions[i * 3] = (Math.random() * gridSize - halfSize) * 1.2; // X
      positions[i * 3 + 1] = (Math.random() * gridSize - halfSize) * 1.2; // Y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2; // Z, gives some depth variation
    }

    const dotGeometry = new THREE.BufferGeometry();
    dotGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const dots = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(dots);

    // Initial subtle rotation for the entire grid system
    lines.rotation.x = Math.PI * 0.05;
    lines.rotation.y = Math.PI * 0.05;
    dots.rotation.x = Math.PI * 0.05;
    dots.rotation.y = Math.PI * 0.05;

    // Center the grid elements
    lines.position.set(0, 0, -2); // Push back slightly
    dots.position.set(0, 0, -2); // Push back slightly

    return { lines, dots };
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = null; // Transparent background to show CSS background

    // --- Camera Setup ---
    const camera = new THREE.PerspectiveCamera(
      75, // FOV
      mountRef.current.clientWidth / mountRef.current.clientHeight, // Aspect ratio
      0.1, // Near clipping plane
      1000 // Far clipping plane
    );
    camera.position.set(0, 0, 5); // Position the camera back

    // --- Renderer Setup ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha: true for transparent background
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    mountRef.current.appendChild(renderer.domElement);

    // Create and add the 3D grid and dots to the scene
    const { lines, dots } = create3dElements(scene);

    // --- Animation Loop ---
    const animate = () => {
      requestAnimationFrame(animate);
      // Subtle continuous rotation for the grid and dots
      if (lines && dots) {
        lines.rotation.y += 0.0005;
        lines.rotation.x += 0.0002;
        dots.rotation.y += 0.0005;
        dots.rotation.x += 0.0002;
      }
      renderer.render(scene, camera);
    };
    animate();

    // --- Responsiveness ---
    const handleResize = () => {
      if (mountRef.current) {
        camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      // Dispose of Three.js resources
      scene.clear();
      renderer.dispose();
      // Explicitly dispose geometries and materials
      if (lines) lines.children.forEach(child => {
        if (child instanceof THREE.Line) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      });
      if (dots) {
        dots.geometry.dispose();
        (dots.material as THREE.Material).dispose();
      }
    };
  }, [create3dElements]);


  return (
    // Main container for the background.
    // Absolute positioning ensures it covers the full viewport,
    // and a low z-index places it behind other content.
    <div className="absolute inset-0 -z-10 h-full w-full bg-[#121220] overflow-hidden"> {/* Background dark purplish-navy */}

      {/* Very vibrant purplish-blue gradient glow in the top-left. */}
      <div
        className="absolute top-[-100px] left-[-100px] h-[800px] w-[800px] rounded-full filter blur-[200px]"
        style={{
          background: 'radial-gradient(circle at center, rgba(130, 80, 255, 0.8) 0%, transparent 50%)', // Vibrant purple-blue
        }}
      ></div>

      {/* Vignette effect for subtle depth. */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow: 'inset 0px 0px 180px rgba(0, 0, 0, 0.8)', // Stronger and wider inner shadow for vignette
        }}
      ></div>

      {/* Three.js canvas for the 3D geometric grid and illuminative dots */}
      <div
        ref={mountRef}
        className="absolute inset-0 h-full w-full"
        style={{ zIndex: 0 }} // Ensure it's behind other content but above the main background color
      ></div>

      {/* 3D Dotted Sphere/Dome Wireframe Illustration (right side). */}
      {/* This remains as an SVG. */}
      <svg
        className="absolute right-[5%] top-[15%] h-[380px] w-[380px]"
        style={{ opacity: 0.15, fill: 'none', stroke: '#5B44F9', strokeWidth: 0.8, zIndex: 1 }} // Added zIndex
      >
        {/* Outer arc of the dome */}
        <path d="M 50 350 Q 185 80 320 350" />

        {/* Inner horizontal dotted lines for the dome structure */}
        {[...Array(7)].map((_, i) => (
          <path
            key={`dome-h-${i}`}
            d={`M ${50 + i * 20} ${350 - i * 40} Q ${185} ${80 + i * 40} ${320 - i * 20} ${350 - i * 40}`}
            style={{ strokeDasharray: '2,4' }}
          />
        ))}

        {/* Vertical/radial dotted lines within the dome */}
        {[...Array(9)].map((_, i) => (
          <line
            key={`dome-v-${i}`}
            x1="185" y1="80"
            x2={50 + (i / 8) * 270} y2="350"
            style={{ strokeDasharray: '2,4' }}
            transform={`rotate(${i * 6 - 24}, 185, 80)`}
          />
        ))}

        {/* Central glowing dot on the dome */}
        <circle cx="185" cy="180" r="3" fill="#FFFFFF" filter="url(#glow)" />
      </svg>

      {/* Mobile Phone Wireframe Illustration (right side, below the sphere). */}
      {/* This remains as an SVG. */}
      <svg
        className="absolute right-[8%] bottom-[10%] h-[450px] w-[280px]"
        style={{ opacity: 0.18, fill: 'none', stroke: '#6F4AFE', strokeWidth: 0.7, zIndex: 1 }} // Added zIndex
      >
        {/*
          Applying a 3D rotation using SVG transform.
          The 'transform' attribute with 'rotateX(-45 140 225)' rotates the SVG content
          45 degrees around its X-axis, giving it a 3D tilted appearance.
          'transform-origin' is set to the center of the SVG for a natural rotation.
        */}
        <g transform="rotateX(-45 140 225)" style={{ transformOrigin: 'center center' }}>
          {/* Main phone body outline, simulating perspective */}
          <path
            d="M 50 400 L 20 50 L 220 70 L 250 420 Z"
            style={{ strokeDasharray: '2,4' }}
          />

          {/* Screen area (inner rectangle with perspective) */}
          <path
            d="M 65 370 L 40 80 L 200 95 L 225 385 Z"
            style={{ strokeDasharray: '2,4', strokeWidth: 0.4 }}
          />

          {/* Additional internal lines to give more detail to the wireframe screen */}
          {[...Array(6)].map((_, i) => (
            <line
              key={`phone-screen-h-${i}`}
              x1={40 + i * 3} y1={80 + i * 50}
              x2={200 - i * 3} y2={95 + i * 50}
              style={{ strokeWidth: 0.2, strokeDasharray: '1,3' }}
            />
          ))}
          {[...Array(4)].map((_, i) => (
            <line
              key={`phone-screen-v-${i}`}
              x1={40 + i * 40} y1="80"
              x2={200 - i * 40} y2="95"
            />
          ))}

          {/* Small glowing dot on the phone screen, mimicking the image. */}
          <circle cx="120" cy="220" r="3" fill="#5B44F9" filter="url(#glow)" />
        </g>
      </svg>
    </div>
  );
};

export default Background;


