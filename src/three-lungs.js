/**
 * 3D Procedural Respiratory Visualization (Three.js)
 * High-performance, lightweight, zero external 3D file dependencies.
 * Features:
 * - Anatomical trachea with cartilaginous rings
 * - Primary & secondary bronchial arborization
 * - Translucent left (2 lobes) and right (3 lobes) lungs
 * - Procedural airflow particles circulating through airways
 * - Calming physiological respiratory rhythm (breathing cycle)
 * - Interactive pointer parallax with damping
 * - Viewport visibility-aware animation pausing (IntersectionObserver)
 * - Graceful WebGL fallback handling
 */

import * as THREE from 'three';

export class RespiratoryVisualization {
  /**
   * @param {HTMLElement} container - The DOM container element
   */
  constructor(container) {
    this.container = container;
    this.animationFrameId = null;
    this.isVisible = true;
    this.clock = new THREE.Clock();
    
    // Mouse tracking with damping
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    
    // Breathing cycle phase
    this.breathTime = 0;
    
    // Check WebGL availability
    if (!this.checkWebGLSupport()) {
      this.renderFallback();
      return;
    }

    try {
      this.init();
      this.setupLighting();
      this.buildRespiratorySystem();
      this.buildAirflowParticles();
      this.setupEventListeners();
      this.setupIntersectionObserver();
      this.animate();
    } catch (err) {
      console.warn('Three.js initialization failed, falling back to static visual:', err);
      this.renderFallback();
    }
  }

  checkWebGLSupport() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  detectSoftwareRenderer(renderer) {
    try {
      const gl = renderer.getContext();
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param) || '');
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    } catch (e) {
      return false;
    }
  }

  init() {
    const width = this.container.clientWidth || 540;
    const height = this.container.clientHeight || 560;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.set(0, 0, 8.5);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.isSoftwareGl = this.detectSoftwareRenderer(this.renderer);
    
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.75));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    // Attach to DOM
    this.container.innerHTML = '';
    this.renderer.domElement.className = 'w-full h-full pointer-events-auto cursor-grab active:cursor-grabbing';
    this.renderer.domElement.style.touchAction = 'none';
    this.container.appendChild(this.renderer.domElement);

    // Root model group
    this.respiratoryGroup = new THREE.Group();
    this.scene.add(this.respiratoryGroup);
  }

  setupLighting() {
    // Ambient cool fill from midnight navy to teal
    const hemiLight = new THREE.HemisphereLight(0x25C5E8, 0x050D1A, 0.9);
    this.scene.add(hemiLight);

    // Key Light: Crisp Cyan-Blue
    const keyLight = new THREE.DirectionalLight(0x00F2FE, 2.4);
    keyLight.position.set(4, 5, 5);
    this.scene.add(keyLight);

    // Secondary Fill Light: Soft Medical Blue
    const fillLight = new THREE.DirectionalLight(0x1677D2, 1.6);
    fillLight.position.set(-4, -2, 3);
    this.scene.add(fillLight);

    // Rim/Backlight: Warm luminous accent for cinematic depth separation
    const rimLight = new THREE.DirectionalLight(0x38BDF8, 2.0);
    rimLight.position.set(0, 4, -4);
    this.scene.add(rimLight);

    // Point Light in center for internal glow of trachea/carina
    const coreGlow = new THREE.PointLight(0x25C5E8, 1.8, 6);
    coreGlow.position.set(0, 0.3, 0.4);
    this.scene.add(coreGlow);
  }

  buildRespiratorySystem() {
    // ----------------------------------------------------
    // Materials
    // ----------------------------------------------------
    // Translucent lung parenchyma material with rim glow
    this.lungMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0E3A6E,
      emissive: 0x0A2B52,
      emissiveIntensity: 0.35,
      roughness: 0.28,
      metalness: 0.1,
      transmission: this.isSoftwareGl ? 0 : 0.65,
      transparent: true,
      opacity: this.isSoftwareGl ? 0.75 : 0.82,
      ior: 1.38,
      thickness: 1.2,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
      wireframe: false,
      depthWrite: false
    });

    // Trachea & Bronchi material (cartilaginous look, luminous cyan)
    this.airwayMaterial = new THREE.MeshStandardMaterial({
      color: 0x25C5E8,
      emissive: 0x1677D2,
      emissiveIntensity: 0.7,
      roughness: 0.35,
      metalness: 0.2
    });

    // Fine bronchial branch material
    this.fineBranchMaterial = new THREE.MeshBasicMaterial({
      color: 0x67E8F9,
      transparent: true,
      opacity: 0.65
    });

    // ----------------------------------------------------
    // 1. Trachea (Windpipe)
    // ----------------------------------------------------
    const tracheaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 2.4, -0.1),
      new THREE.Vector3(0, 1.6, 0.0),
      new THREE.Vector3(0, 0.8, 0.05),
      new THREE.Vector3(0, 0.3, 0.1) // Carina point
    ]);
    const tracheaGeo = new THREE.TubeGeometry(tracheaCurve, 24, 0.19, 16, false);
    const tracheaMesh = new THREE.Mesh(tracheaGeo, this.airwayMaterial);
    this.respiratoryGroup.add(tracheaMesh);

    // Cartilaginous rings along trachea
    const ringGeo = new THREE.TorusGeometry(0.205, 0.022, 8, 20);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x99F6E4,
      emissive: 0x0D9488,
      emissiveIntensity: 0.5,
      roughness: 0.4
    });
    for (let y = 0.5; y <= 2.2; y += 0.17) {
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(0, y, 0.02);
      ring.rotation.x = Math.PI / 2;
      this.respiratoryGroup.add(ring);
    }

    // ----------------------------------------------------
    // 2. Primary Bronchi (Left & Right bifurcation at Carina)
    // ----------------------------------------------------
    // Right Main Bronchus (shorter, wider, steeper)
    const rightBronchusCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.3, 0.1),
      new THREE.Vector3(-0.35, 0.05, 0.08),
      new THREE.Vector3(-0.75, -0.25, 0.02),
      new THREE.Vector3(-1.15, -0.55, -0.05)
    ]);
    const rightBronchusGeo = new THREE.TubeGeometry(rightBronchusCurve, 16, 0.14, 12, false);
    const rightBronchus = new THREE.Mesh(rightBronchusGeo, this.airwayMaterial);
    this.respiratoryGroup.add(rightBronchus);

    // Left Main Bronchus (longer, narrower, more horizontal)
    const leftBronchusCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.3, 0.1),
      new THREE.Vector3(0.45, 0.1, 0.08),
      new THREE.Vector3(0.95, -0.15, 0.02),
      new THREE.Vector3(1.35, -0.45, -0.05)
    ]);
    const leftBronchusGeo = new THREE.TubeGeometry(leftBronchusCurve, 16, 0.125, 12, false);
    const leftBronchus = new THREE.Mesh(leftBronchusGeo, this.airwayMaterial);
    this.respiratoryGroup.add(leftBronchus);

    // ----------------------------------------------------
    // 3. Secondary & Tertiary Bronchial Arborization
    // ----------------------------------------------------
    this.createBranchTree(-1.15, -0.55, -0.05, -1); // Right branches
    this.createBranchTree(1.35, -0.45, -0.05, 1);   // Left branches

    // ----------------------------------------------------
    // 4. Procedural Lung Parenchyma (Left and Right Lobes)
    // ----------------------------------------------------
    // Right Lung (Anatomically larger, 3 lobes, slight conical pear shape)
    this.rightLungGroup = new THREE.Group();
    const rightLungGeo = this.createProceduralLungGeometry({
      isLeft: false,
      scaleX: 1.25,
      scaleY: 2.1,
      scaleZ: 1.15
    });
    this.rightLungMesh = new THREE.Mesh(rightLungGeo, this.lungMaterial);
    this.rightLungGroup.position.set(-1.3, -0.45, 0);
    this.rightLungGroup.add(this.rightLungMesh);
    this.respiratoryGroup.add(this.rightLungGroup);

    // Left Lung (Anatomically slightly smaller, 2 lobes, cardiac notch indentation)
    this.leftLungGroup = new THREE.Group();
    const leftLungGeo = this.createProceduralLungGeometry({
      isLeft: true,
      scaleX: 1.18,
      scaleY: 2.05,
      scaleZ: 1.08
    });
    this.leftLungMesh = new THREE.Mesh(leftLungGeo, this.lungMaterial);
    this.leftLungGroup.position.set(1.3, -0.45, 0);
    this.leftLungGroup.add(this.leftLungMesh);
    this.respiratoryGroup.add(this.leftLungGroup);

    // Add faint inner wireframe/rib structure for medical visualization feel
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38BDF8,
      wireframe: true,
      transparent: true,
      opacity: 0.07
    });
    const rightWire = new THREE.Mesh(rightLungGeo.clone(), wireMat);
    rightWire.scale.multiplyScalar(0.985);
    this.rightLungGroup.add(rightWire);

    const leftWire = new THREE.Mesh(leftLungGeo.clone(), wireMat);
    leftWire.scale.multiplyScalar(0.985);
    this.leftLungGroup.add(leftWire);
  }

  createBranchTree(originX, originY, originZ, sideMultiplier) {
    const branchCoords = [
      // Superior lobe branch
      { dx: 0.35 * sideMultiplier, dy: 0.65, dz: 0.15, r: 0.06 },
      { dx: 0.55 * sideMultiplier, dy: 0.95, dz: 0.22, r: 0.035 },
      { dx: 0.2 * sideMultiplier, dy: 0.85, dz: -0.15, r: 0.035 },
      // Middle/Lateral branch
      { dx: 0.65 * sideMultiplier, dy: -0.15, dz: 0.25, r: 0.055 },
      { dx: 0.95 * sideMultiplier, dy: -0.25, dz: 0.12, r: 0.03 },
      // Inferior/Basal branches
      { dx: 0.25 * sideMultiplier, dy: -0.85, dz: 0.1, r: 0.06 },
      { dx: 0.5 * sideMultiplier, dy: -1.25, dz: 0.2, r: 0.04 },
      { dx: 0.15 * sideMultiplier, dy: -1.35, dz: -0.15, r: 0.035 },
      { dx: -0.15 * sideMultiplier, dy: -1.15, dz: 0.1, r: 0.035 }
    ];

    branchCoords.forEach((b) => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(originX, originY, originZ),
        new THREE.Vector3(originX + b.dx * 0.5, originY + b.dy * 0.5, originZ + b.dz * 0.5),
        new THREE.Vector3(originX + b.dx, originY + b.dy, originZ + b.dz)
      ]);
      const geo = new THREE.TubeGeometry(curve, 10, b.r, 8, false);
      const mesh = new THREE.Mesh(geo, this.fineBranchMaterial);
      this.respiratoryGroup.add(mesh);
    });
  }

  /**
   * Generates a smooth, procedural anatomical lung geometry
   */
  createProceduralLungGeometry({ isLeft, scaleX, scaleY, scaleZ }) {
    // Start from an subdivided ellipsoid sphere
    const geo = new THREE.SphereGeometry(1, 36, 36);
    const pos = geo.attributes.position;
    const v = new THREE.Vector3();

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);

      // Anatomical shaping:
      // Apex: Narrower at top (y > 0.3)
      // Base: Broad diaphragmatic surface at bottom (y < -0.3)
      // Medial hilum: Indentation toward center (x ~ 0)
      
      const normalizedY = (v.y + 1) / 2; // 0 (bottom) to 1 (top)
      
      // Taper apex
      const apexTaper = 0.55 + 0.45 * Math.sin(normalizedY * Math.PI * 0.85);
      v.x *= apexTaper;
      v.z *= apexTaper;

      // Base concave curve for diaphragm
      if (v.y < -0.5) {
        const bottomFactor = Math.abs(v.y + 0.5) / 0.5;
        v.y += bottomFactor * 0.2 * (1 - Math.sqrt(v.x * v.x + v.z * v.z));
      }

      // Cardiac notch indentation on left lung
      if (isLeft) {
        if (v.x < 0.2 && v.y > -0.4 && v.y < 0.3 && v.z > -0.1) {
          const notchStrength = Math.cos((v.y + 0.05) * Math.PI) * 0.32;
          v.x += Math.max(0, notchStrength);
        }
      } else {
        // Right lung medial curve
        if (v.x > -0.2 && v.y > -0.3 && v.y < 0.4) {
          v.x -= 0.12 * (1 - Math.abs(v.y));
        }
      }

      // Coastal surface rounding
      v.x *= scaleX;
      v.y *= scaleY;
      v.z *= scaleZ;

      pos.setXYZ(i, v.x, v.y, v.z);
    }

    geo.computeVertexNormals();
    return geo;
  }

  buildAirflowParticles() {
    const particleCount = 140;
    const positions = new Float32Array(particleCount * 3);
    const particleProgress = new Float32Array(particleCount);
    const particleSpeed = new Float32Array(particleCount);
    const particleBranch = new Uint8Array(particleCount); // 0 = right, 1 = left

    // Airways pathways waypoints
    this.rightAirwayPath = [
      new THREE.Vector3(0, 2.3, 0),
      new THREE.Vector3(0, 0.4, 0.05),
      new THREE.Vector3(-0.7, -0.2, 0.02),
      new THREE.Vector3(-1.3, -0.6, -0.05),
      new THREE.Vector3(-1.6, -1.2, 0.1)
    ];

    this.leftAirwayPath = [
      new THREE.Vector3(0, 2.3, 0),
      new THREE.Vector3(0, 0.4, 0.05),
      new THREE.Vector3(0.8, -0.15, 0.02),
      new THREE.Vector3(1.35, -0.5, -0.05),
      new THREE.Vector3(1.55, -1.15, 0.1)
    ];

    for (let i = 0; i < particleCount; i++) {
      particleProgress[i] = Math.random();
      particleSpeed[i] = 0.15 + Math.random() * 0.25;
      particleBranch[i] = i % 2 === 0 ? 0 : 1;

      // Seed initial position
      positions[i * 3] = (Math.random() - 0.5) * 0.2;
      positions[i * 3 + 1] = 2.0;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particleProgress = particleProgress;
    this.particleSpeed = particleSpeed;
    this.particleBranch = particleBranch;

    // Glowing particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(37, 197, 232, 0.85)');
    grad.addColorStop(0.7, 'rgba(22, 119, 210, 0.3)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    const particleMat = new THREE.PointsMaterial({
      size: 0.18,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.airflowParticles = new THREE.Points(particleGeo, particleMat);
    this.respiratoryGroup.add(this.airflowParticles);
  }

  setupEventListeners() {
    this.onWindowResize = () => {
      if (!this.container || !this.renderer || !this.camera) return;
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      if (width === 0 || height === 0) return;
      
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    };
    window.addEventListener('resize', this.onWindowResize);

    // Mouse parallax tracking with strict damping limits
    this.onPointerMove = (e) => {
      const rect = this.container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      // Clamp values
      this.mouse.targetX = Math.max(-1, Math.min(1, x));
      this.mouse.targetY = Math.max(-1, Math.min(1, y));
    };
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
  }

  setupIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        this.isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.05 });

    this.observer.observe(this.container);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    // Respect pause if out of viewport to save battery & CPU
    if (!this.isVisible) return;

    const delta = Math.min(this.clock.getDelta(), 0.1);
    this.breathTime += delta;

    // ----------------------------------------------------
    // 1. Calming Physiological Breathing Cycle (~4.2 sec)
    // ----------------------------------------------------
    // Inhalation: slight expansion in lateral (X) and anterior-posterior (Z)
    // Exhalation: gentle elastic recoil
    const breathCycle = Math.sin(this.breathTime * 1.5); // Period ~4.18s
    const breathScale = 1.0 + breathCycle * 0.045;
    const breathScaleZ = 1.0 + breathCycle * 0.06;

    if (this.rightLungGroup && this.leftLungGroup) {
      this.rightLungGroup.scale.set(breathScale, 1.0 + breathCycle * 0.02, breathScaleZ);
      this.leftLungGroup.scale.set(breathScale, 1.0 + breathCycle * 0.02, breathScaleZ);
      
      // Lung slight elevation during inhalation (costal excursion)
      const excursion = breathCycle * 0.035;
      this.rightLungGroup.position.y = -0.45 + excursion;
      this.leftLungGroup.position.y = -0.45 + excursion;
    }

    // ----------------------------------------------------
    // 2. Airflow Particles Motion
    // ----------------------------------------------------
    if (this.airflowParticles) {
      const posAttr = this.airflowParticles.geometry.attributes.position;
      const posArray = posAttr.array;
      const pCount = this.particleProgress.length;

      for (let i = 0; i < pCount; i++) {
        // Advance particle
        this.particleProgress[i] += this.particleSpeed[i] * delta * (1.2 + breathCycle * 0.3);
        if (this.particleProgress[i] > 1.0) {
          this.particleProgress[i] = 0;
        }

        const t = this.particleProgress[i];
        const path = this.particleBranch[i] === 0 ? this.rightAirwayPath : this.leftAirwayPath;

        // Linear spline interpolation across 5 points
        const scaledT = t * (path.length - 1);
        const idx = Math.min(Math.floor(scaledT), path.length - 2);
        const frac = scaledT - idx;

        const p0 = path[idx];
        const p1 = path[idx + 1];

        // Add subtle radial jitter for dispersed airway flow
        const jitter = Math.sin(t * 12 + i) * 0.04;

        posArray[i * 3] = p0.x + (p1.x - p0.x) * frac + jitter;
        posArray[i * 3 + 1] = p0.y + (p1.y - p0.y) * frac;
        posArray[i * 3 + 2] = p0.z + (p1.z - p0.z) * frac + jitter;
      }
      posAttr.needsUpdate = true;
    }

    // ----------------------------------------------------
    // 3. Smooth Damped Pointer Parallax & Gentle Floating
    // ----------------------------------------------------
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Gentle base floating oscillation
    const floatY = Math.sin(this.breathTime * 0.8) * 0.08;
    const slowRotation = Math.sin(this.breathTime * 0.4) * 0.08;

    this.respiratoryGroup.position.y = floatY;
    this.respiratoryGroup.rotation.y = slowRotation + this.mouse.x * 0.35;
    this.respiratoryGroup.rotation.x = -this.mouse.y * 0.2;

    this.renderer.render(this.scene, this.camera);
  }

  renderFallback() {
    this.container.innerHTML = `
      <div class="w-full h-full flex flex-col items-center justify-center p-6 text-center">
        <div class="relative w-48 h-48 mb-4">
          <svg class="w-full h-full text-[#25C5E8] animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2v20M7 5a4 4 0 0 1 4 4v11M17 5a4 4 0 0 0-4 4v11"/>
            <path d="M7 10c-2.5 0-4.5 2-4.5 4.5S4.5 19 7 19h1M17 10c2.5 0 4.5 2 4.5 4.5S19.5 19 17 19h-1"/>
          </svg>
          <div class="absolute inset-0 bg-[#25C5E8]/10 rounded-full blur-2xl"></div>
        </div>
        <p class="text-xs uppercase tracking-widest text-[#25C5E8] font-semibold">Thoracic & Pulmonary Visualizer</p>
        <p class="text-xs text-white/60 mt-1">Surgical & Clinical Respiratory Science</p>
      </div>
    `;
  }

  dispose() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.observer) {
      this.observer.disconnect();
    }
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('pointermove', this.onPointerMove);

    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
  }
}
