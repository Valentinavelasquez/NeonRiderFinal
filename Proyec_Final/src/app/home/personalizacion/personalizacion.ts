import {
  Component, ElementRef, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

type FaceKey = 'front' | 'back' | 'left' | 'right' | 'top';

interface FaceState {
  img?: HTMLImageElement | null;
  pattern?: 'stripes' | 'stars' | null;
  texts: { value: string; color: string }[];
  // Transformaciones del “sticker” (imagen/patrón) sobre la cara
  scale: number;    // 0..1   (zoom)
  rotDeg: number;   // -180..180
  offsetX: number;  // -1..1
  offsetY: number;  // -1..1
}

@Component({
  selector: 'app-personalizacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './personalizacion.html',
  styleUrls: ['./personalizacion.css'],
})
export class PersonalizacionComponent implements OnInit, OnDestroy {
  // Estado UI
  selectedFace: FaceKey = 'front';

  // Vista previa 2D (panel izquierdo)
  @ViewChild('preview', { static: true }) preview!: ElementRef<HTMLCanvasElement>;
  private previewCtx!: CanvasRenderingContext2D;

  // Canvases por cara (offscreen) para el atlas
  public faces: Record<FaceKey, FaceState> = {
    front: { texts: [], pattern: null, img: null, scale: 0.35, rotDeg: 0, offsetX: 0, offsetY: 0 },
    back : { texts: [], pattern: null, img: null, scale: 0.35, rotDeg: 0, offsetX: 0, offsetY: 0 },
    left : { texts: [], pattern: null, img: null, scale: 0.35, rotDeg: 0, offsetX: 0, offsetY: 0 },
    right: { texts: [], pattern: null, img: null, scale: 0.35, rotDeg: 0, offsetX: 0, offsetY: 0 },
    top  : { texts: [], pattern: null, img: null, scale: 0.35, rotDeg: 0, offsetX: 0, offsetY: 0 },
  };
  private faceCanvas: Record<FaceKey, HTMLCanvasElement> = {} as any;
  private faceCtx: Record<FaceKey, CanvasRenderingContext2D> = {} as any;
  private maskImages: Record<FaceKey, HTMLImageElement> = {} as any;
  private patternImgs: { stripes?: HTMLImageElement; stars?: HTMLImageElement } = {};

  // Atlas final (offscreen) que se usa como textura en el 3D
  private atlasCanvas!: HTMLCanvasElement;
  private atlasCtx!: CanvasRenderingContext2D;
  private shellTexture!: THREE.CanvasTexture;

  // 3D
  @ViewChild('viewer3d', { static: true }) viewer3d!: ElementRef<HTMLDivElement>;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private resizeObserver!: ResizeObserver;

  // mallas reales donde aplicaremos la “pintura”
  private paintMeshes: THREE.Mesh[] = [];

  // ---------- Ciclo Angular ----------
  ngOnInit(): void {
    // preview 2D
    const pctx = this.preview.nativeElement.getContext('2d');
    if (!pctx) throw new Error('No se pudo crear el contexto 2D de preview');
    this.previewCtx = pctx;

    // crea canvases por cara (resolución generosa)
    (['front','back','left','right','top'] as FaceKey[]).forEach(k => {
      const c = document.createElement('canvas');
      c.width = c.height = 1024;
      this.faceCanvas[k] = c;
      const cx = c.getContext('2d')!;
      this.faceCtx[k] = cx;
    });

    // atlas
    this.atlasCanvas = document.createElement('canvas');
    // 4 columnas * 1024 x 1024 alto
    this.atlasCanvas.width  = 4096;
    this.atlasCanvas.height = 1024;
    this.atlasCtx = this.atlasCanvas.getContext('2d')!;

    // máscaras
    this.loadMask('front', '/assets/masks/Helmet-Frontal.png');
    this.loadMask('back',  '/assets/masks/helmet-back.png');
    this.loadMask('left',  '/assets/masks/Helmet-Lat-Izq.png');
    this.loadMask('right', '/assets/masks/Helmet-Lat-Der.png');
    this.loadMask('top',   '/assets/masks/Helmet-Superior.png');

    // patrones (imágenes repetibles)
    this.loadPattern('stripes', '/assets/patterns/stripes.png');
    this.loadPattern('stars',   '/assets/patterns/star.png');

    // 3D
    this.initThree();

    // Dibujo inicial
    (['front','back','left','right','top'] as FaceKey[]).forEach(k => this.drawFace(k));
    this.composeAtlas();
    this.updatePreview();
  }

  ngOnDestroy(): void {
    this.controls?.dispose();
    this.renderer?.dispose();
    this.resizeObserver?.disconnect();
  }

  // ---------- Carga de recursos 2D ----------
  private loadMask(face: FaceKey, url: string) {
    const img = new Image();
    img.onload = () => { this.maskImages[face] = img; this.drawFace(face); if (face===this.selectedFace) this.updatePreview(); };
    img.src = url;
  }

  private loadPattern(kind: 'stripes' | 'stars', url: string) {
    const img = new Image();
    img.onload = () => { (this.patternImgs as any)[kind] = img; this.drawFace(this.selectedFace); };
    img.src = url;
  }

  // ---------- UI ----------
  selectFace(face: FaceKey) {
    this.selectedFace = face;
    this.updatePreview();
  }

  async pickImage(evt: Event) {
    const file = (evt.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      this.faces[this.selectedFace].img = img;
      this.drawFace(this.selectedFace);
      this.composeAtlas();
      this.updatePreview();
    };
    img.src = URL.createObjectURL(file);
  }

  clearImage() {
    this.faces[this.selectedFace].img = null;
    this.drawFace(this.selectedFace);
    this.composeAtlas();
    this.updatePreview();
  }

  applyPattern(kind: 'stripes'|'stars') {
    this.faces[this.selectedFace].pattern = kind;
    this.drawFace(this.selectedFace);
    this.composeAtlas();
    this.updatePreview();
  }
  removePattern() {
    this.faces[this.selectedFace].pattern = null;
    this.drawFace(this.selectedFace);
    this.composeAtlas();
    this.updatePreview();
  }

  onZoomInput(e: Event)   { this.faces[this.selectedFace].scale   = Number((e.target as HTMLInputElement).value); this.drawFace(this.selectedFace); this.composeAtlas(); this.updatePreview(); }
  onRotInput(e: Event)    { this.faces[this.selectedFace].rotDeg  = Number((e.target as HTMLInputElement).value); this.drawFace(this.selectedFace); this.composeAtlas(); this.updatePreview(); }
  onOffsetXInput(e: Event){ this.faces[this.selectedFace].offsetX = Number((e.target as HTMLInputElement).value); this.drawFace(this.selectedFace); this.composeAtlas(); this.updatePreview(); }
  onOffsetYInput(e: Event){ this.faces[this.selectedFace].offsetY = Number((e.target as HTMLInputElement).value); this.drawFace(this.selectedFace); this.composeAtlas(); this.updatePreview(); }

  // ---------- Dibujo de una cara 2D ----------
  private drawFace(face: FaceKey) {
    const c = this.faceCanvas[face];
    const ctx = this.faceCtx[face];
    const W = c.width, H = c.height;
    ctx.clearRect(0,0,W,H);

    // Fondo guía
    ctx.fillStyle = '#16231e';
    ctx.fillRect(0,0,W,H);

    const mask = this.maskImages[face];
    if (!mask) return;

    // 1) pinta máscara (blanca) y entra en modo recorte (source-in)
    ctx.save();
    ctx.drawImage(mask, 0,0, W,H);
    ctx.globalCompositeOperation = 'source-in';

    // color base oscuro
    ctx.fillStyle = '#1b1f20';
    ctx.fillRect(0,0,W,H);

    // 2) patrón si hay
    const st = this.faces[face];
    if (st.pattern && (this.patternImgs as any)[st.pattern]) {
      const pimg = (this.patternImgs as any)[st.pattern] as HTMLImageElement;
      const p = ctx.createPattern(pimg, 'repeat');
      if (p) {
        ctx.save();
        // rotación de patrón junto con la imagen
        ctx.translate(W/2, H/2);
        ctx.rotate(THREE.MathUtils.degToRad(st.rotDeg));
        ctx.translate(-W/2, -H/2);
        ctx.fillStyle = p as any;
        ctx.fillRect(0,0,W,H);
        ctx.restore();
      }
    }

    // 3) imagen del usuario
    if (st.img) {
      const scl = 0.25 + st.scale * 2.0; // rango 0.25..2.25
      const rad = THREE.MathUtils.degToRad(st.rotDeg);
      const centerX = W/2 + st.offsetX * (W/2);
      const centerY = H/2 + st.offsetY * (H/2);

      const iw = st.img.width, ih = st.img.height;
      const ar = iw/ih;
      let dw = W * scl, dh = dw / ar;
      if (dh < H * 0.25) { dh = H * 0.25; dw = dh * ar; }

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rad);
      ctx.drawImage(st.img, -dw/2, -dh/2, dw, dh);
      ctx.restore();
    }

    ctx.restore();

    // contorno guía
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(mask, 0,0,W,H);
  }

  private updatePreview() {
    const pv = this.preview.nativeElement;
    const W = pv.width, H = pv.height;
    this.previewCtx.clearRect(0,0,W,H);
    const src = this.faceCanvas[this.selectedFace];
    this.previewCtx.drawImage(src, 0, 0, W, H);
  }

  // ---------- Atlas -> textura para el 3D ----------
  private composeAtlas() {
    const W = this.atlasCanvas.width, H = this.atlasCanvas.height;
    const bw = W/4;

    this.atlasCtx.clearRect(0,0,W,H);
    this.atlasCtx.fillStyle = '#101415';
    this.atlasCtx.fillRect(0,0,W,H);

    this.atlasCtx.drawImage(this.faceCanvas.front, 0*bw, 0, bw, H);
    this.atlasCtx.drawImage(this.faceCanvas.right, 1*bw, 0, bw, H);
    this.atlasCtx.drawImage(this.faceCanvas.back , 2*bw, 0, bw, H);
    this.atlasCtx.drawImage(this.faceCanvas.left , 3*bw, 0, bw, H);
    // banda superior para “top”
    this.atlasCtx.drawImage(this.faceCanvas.top, 0, 0, W, H*0.28);

    // margen para evitar costura U=1/0
    this.atlasCtx.drawImage(this.faceCanvas.front, W-8, 0, 8, H);

    if (!this.shellTexture) {
      this.shellTexture = new THREE.CanvasTexture(this.atlasCanvas);
      this.shellTexture.flipY = false; // glTF
      this.shellTexture.colorSpace = THREE.SRGBColorSpace;
      this.shellTexture.wrapS = THREE.RepeatWrapping;
      this.shellTexture.wrapT = THREE.ClampToEdgeWrapping;
    } else {
      (this.shellTexture as THREE.CanvasTexture).image = this.atlasCanvas;
    }
    this.shellTexture.needsUpdate = true;

    // refresca material en mallas ya detectadas
    this.paintMeshes.forEach(m => {
      const apply = (mm: THREE.MeshStandardMaterial) => {
        mm.map = this.shellTexture;
        mm.color.set('#ffffff');
        mm.roughness = 0.45;
        mm.metalness = 0.1;
        mm.envMapIntensity = 1.0;
        mm.needsUpdate = true;
      };
      if (Array.isArray(m.material)) (m.material as any[]).forEach(x => apply(x));
      else apply(m.material as THREE.MeshStandardMaterial);
    });
  }

  // ---------- Three.js ----------
  private initThree() {
    const host = this.viewer3d.nativeElement;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x121a1d);

    this.camera = new THREE.PerspectiveCamera(45, host.clientWidth/host.clientHeight, 0.1, 100);
    this.camera.position.set(0.3, 1.2, 2.6);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(host.clientWidth, host.clientHeight);
    // this.renderer.physicallyCorrectLights = true;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    const hemi = new THREE.HemisphereLight(0xffffff, 0x223344, 1.1);
    this.scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff, 2.0);
    dir.position.set(3, 5, 3);
    dir.castShadow = false;
    this.scene.add(dir);

    new GLTFLoader().load(
      '/assets/models/helmet.glb',
      (gltf) => {
        const root = gltf.scene;

        // Oculta decals/logos si existen
        root.traverse(o => {
          const m = o as THREE.Mesh;
          if (!m.isMesh) return;
          const nm = (m.name || '').toLowerCase();
          const matName = Array.isArray(m.material)
            ? (m.material as any[]).map(mm => (mm?.name || '')).join(' ').toLowerCase()
            : ((m.material as any)?.name || '').toLowerCase();
          if (/logo|label|decal|sticker|bell/.test(nm + ' ' + matName)) {
            m.visible = false;
          }
        });

        // Candidatos “pintura”
        const candidates: THREE.Mesh[] = [];
        root.traverse(o => {
          const m = o as THREE.Mesh;
          if (!m.isMesh) return;
          const mat = m.material as THREE.Material | THREE.Material[];
          const matName = Array.isArray(mat)
            ? mat.map(mm => (mm?.name||'')).join(' ').toLowerCase()
            : ((mat as any)?.name||'').toLowerCase();
          const nm = (m.name || '').toLowerCase();
          const likely = /shell|paint|carcasa|exterior|helmet|casco|body/.test(nm + ' ' + matName);
          if (likely) candidates.push(m);
        });

        // Si nada “likely”, toma la malla opaca más grande
        if (candidates.length === 0) {
          let best: THREE.Mesh | null = null, bestArea = 0;
          root.traverse(o => {
            const m = o as THREE.Mesh;
            if (!m.isMesh) return;
            const mat = m.material as any;
            const isTransparent = Array.isArray(mat) ? mat.some((mm: any) => mm?.transparent) : !!mat?.transparent;
            if (isTransparent) return;
            const box = new THREE.Box3().setFromObject(m);
            const s = new THREE.Vector3(); box.getSize(s);
            const a = s.x*s.y + s.x*s.z + s.y*s.z;
            if (a > bestArea) { bestArea = a; best = m; }
          });
          if (best) candidates.push(best);
        }

        this.paintMeshes = candidates;

        // UVs esféricos + material estándar con nuestro atlas
        this.paintMeshes.forEach(m => {
          this.ensureSphericalUVs(m);

          const toStd = (mm: any) => {
            let mat = mm as THREE.MeshStandardMaterial;
            if (!(mat instanceof THREE.MeshStandardMaterial)) {
              mat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.45, metalness: 0.1 });
            }
            mat.map = this.shellTexture;
            mat.color.set('#ffffff');
            mat.roughness = 0.45; mat.metalness = 0.1;
            mat.envMapIntensity = 1.0;
            mat.needsUpdate = true;
            return mat;
          };
          if (Array.isArray(m.material)) m.material = (m.material as any[]).map(toStd);
          else m.material = toStd(m.material);
        });

        this.scene.add(root);

        // si el GLB carga antes que nuestro primer atlas, forza 1º composición
        this.composeAtlas();
      },
      undefined,
      (err) => console.error('Error GLB', err)
    );

    this.resizeObserver = new ResizeObserver(() => {
      this.camera.aspect = host.clientWidth / host.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(host.clientWidth, host.clientHeight);
    });
    this.resizeObserver.observe(host);

    this.animate();
  }

  private animate = () => {
    requestAnimationFrame(this.animate);
    this.controls?.update();
    this.renderer?.render(this.scene, this.camera);
  };

  // UVs esféricos si el modelo no trae unos útiles
  private ensureSphericalUVs(mesh: THREE.Mesh) {
    const geom = mesh.geometry as THREE.BufferGeometry;
    const posAttr = geom.attributes['position'] as THREE.BufferAttribute;
    if (!posAttr) return;

    const uv = new Float32Array(posAttr.count * 2);
    const v = new THREE.Vector3();

    for (let i = 0; i < posAttr.count; i++) {
      v.fromBufferAttribute(posAttr, i);
      const r = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z) || 1;
      const lon = Math.atan2(v.z, v.x);
      const lat = Math.asin(THREE.MathUtils.clamp(v.y / r, -1, 1));
      let u = (lon / (2*Math.PI)) + 0.5;
      const w = (lat / Math.PI) + 0.5;
      if (u < 0) u += 1; else if (u > 1) u -= 1;
      uv[i*2] = u; uv[i*2+1] = 1 - w;
    }

    geom.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    (geom.attributes['uv'] as THREE.BufferAttribute).needsUpdate = true;
    geom.computeVertexNormals();
    geom.computeBoundingSphere();
  }
}
