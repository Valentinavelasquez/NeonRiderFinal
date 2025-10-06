// ... (imports iguales)
import {
  Component, ElementRef, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

type FaceKey = 'front' | 'back' | 'left' | 'right' | 'top';
interface FaceState {
  img?: HTMLImageElement | null;
  pattern?: 'stripes' | 'stars' | null;
  texts: { value: string; color: string }[];
}

@Component({
  selector: 'app-personalizacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './personalizacion.html',
  styleUrls: ['./personalizacion.css'],
})
export class PersonalizacionComponent implements OnInit, OnDestroy {
  // UI (sin ngModel)
  selectedFace: FaceKey = 'left';
  text = '';
  textColor = '#ffffff';

  // ---- Ajustes de mapeo UV (nuevo)
  uvZoom = 0.35;               // 0.15..1  (menor = más “zoom”)
  uvRotationRad = 0;           // en radianes
  uvOffsetX = 0;               // -1..1
  uvOffsetY = 0;               // -1..1

  // 2D
  @ViewChild('canvas2d', { static: true }) canvas2d!: ElementRef<HTMLCanvasElement>;
  private ctx2d!: CanvasRenderingContext2D;
  private maskImages: Record<FaceKey, HTMLImageElement> = {} as any;
  private faces: Record<FaceKey, FaceState> = {
    front: { texts: [] }, back: { texts: [] }, left: { texts: [] },
    right: { texts: [] }, top: { texts: [] },
  };

  // 3D
  @ViewChild('viewer3d', { static: true }) viewer3d!: ElementRef<HTMLDivElement>;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private resizeObserver!: ResizeObserver;
  private rafId = 0;
  private paintMats: (THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial)[] = [];

  ngOnInit(): void {
    // 2D
    const ctx = this.canvas2d.nativeElement.getContext('2d');
    if (!ctx) throw new Error('No se pudo crear el contexto 2D');
    this.ctx2d = ctx;

    // Máscaras (usa los nombres de tu carpeta)
    this.loadMask('front', 'assets/masks/Helmet-Frontal.png');
    this.loadMask('right', 'assets/masks/Helmet-Lat-Der.png');
    this.loadMask('left',  'assets/masks/Helmet-Lat-Izq.png');
    this.loadMask('back',  'assets/masks/helmet-back.png');
    this.loadMask('top',   'assets/masks/Helmet-Superior.png');

    // 3D
    this.initThree();
    this.loadHelmetGLB();      // public/assets/models/helmet.glb
    this.animate();

    this.redraw2D(true);
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.controls?.dispose();
    this.renderer?.dispose();
    this.resizeObserver?.disconnect();
  }

  // ---- Handlers UI
  selectFace(face: FaceKey) { this.selectedFace = face; this.redraw2D(); }
  onTextChange(e: Event)  { this.text = (e.target as HTMLInputElement).value ?? ''; }
  onColorChange(e: Event) { this.textColor = (e.target as HTMLInputElement).value ?? '#ffffff'; }
  addText() { if (!this.text.trim()) return; this.faces[this.selectedFace].texts.push({ value: this.text.trim(), color: this.textColor }); this.text = ''; this.redraw2D(true); }
  clearFace()  { this.faces[this.selectedFace] = { texts: [] }; this.redraw2D(true); }
  clearImage() { this.faces[this.selectedFace].img = null;      this.redraw2D(true); }
  applyPattern(k: 'stripes' | 'stars') { this.faces[this.selectedFace].pattern = k; this.redraw2D(true); }
  removePattern() { this.faces[this.selectedFace].pattern = null; this.redraw2D(true); }

  async pickImage(evt: Event) {
    const f = (evt.target as HTMLInputElement).files?.[0];
    if (!f) return;
    const img = new Image();
    img.onload = () => { this.faces[this.selectedFace].img = img; this.redraw2D(true); };
    img.src = URL.createObjectURL(f);
  }

  // ---- NUEVO: sliders de ajuste UV
  onZoomInput(e: Event)     { this.uvZoom = parseFloat((e.target as HTMLInputElement).value); this.updateHelmetTexture(); }
  onRotInput(e: Event)      { const deg = parseFloat((e.target as HTMLInputElement).value); this.uvRotationRad = deg * Math.PI / 180; this.updateHelmetTexture(); }
  onOffsetXInput(e: Event)  { this.uvOffsetX = parseFloat((e.target as HTMLInputElement).value); this.updateHelmetTexture(); }
  onOffsetYInput(e: Event)  { this.uvOffsetY = parseFloat((e.target as HTMLInputElement).value); this.updateHelmetTexture(); }

  // ---- 2D
  private loadMask(face: FaceKey, url: string) {
    const img = new Image();
    img.onload = () => { this.maskImages[face] = img; if (face === this.selectedFace) this.redraw2D(); };
    img.src = url;
  }

  private redraw2D(update3D = false) {
    const cvs = this.canvas2d.nativeElement;
    const ctx = this.ctx2d;
    const W = cvs.width, H = cvs.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#102010';
    ctx.fillRect(0, 0, W, H);

    const mask = this.maskImages[this.selectedFace];
    if (mask) {
      ctx.save();
      ctx.drawImage(mask, 0, 0, W, H);
      ctx.globalCompositeOperation = 'source-in';

      const st = this.faces[this.selectedFace];
      if (st.pattern) {
        const pCanvas = this.makePattern(st.pattern);
        const pat = ctx.createPattern(pCanvas, 'repeat');
        if (pat) { ctx.fillStyle = pat as any; ctx.fillRect(0, 0, W, H); }
      } else {
        ctx.fillStyle = '#1b3c1b';
        ctx.fillRect(0, 0, W, H);
      }

      if (st.img) {
        const iw = st.img.width, ih = st.img.height;
        const sc = Math.min(W / iw, H / ih);
        const dw = iw * sc, dh = ih * sc;
        ctx.drawImage(st.img, (W - dw) / 2, (H - dh) / 2, dw, dh);
      }

      ctx.restore();
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(mask, 0, 0, W, H);
    }

    const texts = this.faces[this.selectedFace].texts;
    if (texts.length) {
      ctx.font = 'bold 72px Poppins, Arial';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      let y = H * 0.55;
      for (const t of texts) {
        ctx.fillStyle = t.color; ctx.strokeStyle = 'rgba(0,0,0,.45)'; ctx.lineWidth = 8;
        ctx.strokeText(t.value, W / 2, y);
        ctx.fillText(t.value,   W / 2, y);
        y += 100;
      }
    }

    if (update3D) this.updateHelmetTexture();
  }

  private makePattern(kind: 'stripes' | 'stars'): HTMLCanvasElement {
    const p = document.createElement('canvas'); const s = 140;
    p.width = s; p.height = s;
    const c = p.getContext('2d')!;
    c.fillStyle = '#0f260f'; c.fillRect(0, 0, s, s);
    if (kind === 'stripes') {
      c.fillStyle = '#60ff60';
      for (let i = -s; i < s * 2; i += 28) { c.save(); c.translate(i, 0); c.rotate(Math.PI/6); c.fillRect(0, 0, 10, s * 2); c.restore(); }
    } else {
      c.fillStyle = '#9cff9c';
      for (let i = 16; i < s; i += 36) for (let j = 16; j < s; j += 36) this.star(c, i, j, 7, 5);
    }
    return p;
  }
  private star(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, spikes: number) {
    const step = Math.PI / spikes; ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) { const rad = i % 2 === 0 ? r : r / 2; ctx.lineTo(x + Math.cos(i * step) * rad, y + Math.sin(i * step) * rad); }
    ctx.closePath(); ctx.fill();
  }

  // ---- 3D
  private initThree() {
    const host = this.viewer3d.nativeElement;
    const bg = 0x0f1416;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(bg);

    this.camera = new THREE.PerspectiveCamera(45, host.clientWidth / host.clientHeight, 0.1, 200);
    this.camera.position.set(0.6, 0.5, 2.2);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(host.clientWidth, host.clientHeight);
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.setClearColor(bg, 1);
    this.renderer.shadowMap.enabled = true;
    host.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.target.set(0, 0.45, 0);

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment()).texture;

    const amb = new THREE.AmbientLight(0xffffff, 0.35); this.scene.add(amb);
    const hemi = new THREE.HemisphereLight(0xffffff, 0x1a1a1a, 0.9); this.scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(2.5, 3.0, 3.5); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x9fd0ff, 0.7); rim.position.set(-3, 2, -2); this.scene.add(rim);

    this.resizeObserver = new ResizeObserver(() => {
      this.camera.aspect = host.clientWidth / host.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(host.clientWidth, host.clientHeight);
    });
    this.resizeObserver.observe(host);
  }

  private loadHelmetGLB() {
    new GLTFLoader().load(
      'assets/models/helmet.glb',
      (gltf) => {
        const root = gltf.scene;

        // Normaliza tamaño/centra
        const box = new THREE.Box3().setFromObject(root);
        const size = new THREE.Vector3(); box.getSize(size);
        const scale = 1.8 / Math.max(size.x, size.y, size.z, 1);
        root.scale.setScalar(scale);
        const box2 = new THREE.Box3().setFromObject(root);
        const center = new THREE.Vector3(); box2.getCenter(center);
        root.position.sub(center); root.position.y += 0.45;

        // Materiales pintables
        this.paintMats = [];
        root.traverse((o) => {
          const mesh = o as THREE.Mesh;
          if (!mesh.isMesh || !mesh.material) return;
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m) => {
            const mat = m as THREE.Material & { name?: string; metalness?: number; roughness?: number; envMapIntensity?: number; transparent?: boolean; opacity?: number; };
            const nm = (mat.name || mesh.name || '').toLowerCase();
            const isVisor    = /visor|glass|shield|lens/.test(nm);
            const isInterior = /inner|foam|liner|interior|pad|mesh|strap/.test(nm);
            const isHardware = /screw|bolt|metal|gasket|rubber|vent|hinge|button/.test(nm);

            if (isVisor) { (mat as any).metalness = 0.85; (mat as any).roughness = 0.12; (mat as any).transparent = true; (mat as any).opacity = 0.6; (mat as any).envMapIntensity = 1.0; return; }
            if (isInterior || isHardware) { (mat as any).envMapIntensity = 0.6; return; }

            (mat as any).metalness = 0.2; (mat as any).roughness = 0.45; (mat as any).envMapIntensity = 1.1;
            if (m instanceof THREE.MeshStandardMaterial || m instanceof THREE.MeshPhysicalMaterial) this.paintMats.push(m);
          });

          mesh.castShadow = true; mesh.receiveShadow = true;
        });

        this.scene.add(root);
        this.updateHelmetTexture();
      },
      undefined,
      (err) => console.error('Error cargando helmet.glb', err)
    );
  }

  /** Aplica el CanvasTexture con transformación (zoom, rotación y offset). */
  private updateHelmetTexture() {
    if (!this.paintMats.length) return;

    const tex = new THREE.CanvasTexture(this.canvas2d.nativeElement);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.flipY = false;
    tex.anisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy());
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;

    // Transformaciones UV:
    // - repeat < 1 = “zoom in” (muestra una porción central más grande)
    // - offset desplaza la imagen
    // - rotation gira alrededor del centro
    tex.center.set(0.5, 0.5);
    tex.rotation = this.uvRotationRad;
    tex.repeat.set(this.uvZoom, this.uvZoom);
    tex.offset.set(0.5 * (1 - this.uvZoom) + this.uvOffsetX * 0.5,
                   0.5 * (1 - this.uvZoom) + this.uvOffsetY * 0.5);

    for (const mat of this.paintMats) {
      mat.map = tex;
      mat.needsUpdate = true;
    }
    this.renderer?.render(this.scene, this.camera);
  }

  private animate = () => {
    this.rafId = requestAnimationFrame(this.animate);
    this.controls?.update();
    this.renderer?.render(this.scene, this.camera);
  };
}
