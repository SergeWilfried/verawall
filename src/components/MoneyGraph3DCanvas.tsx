// Heavy WebGL canvas — lazy-loaded (this file is the only one that imports
// three, so it splits into its own chunk that downloads on demand). The parent
// (MoneyGraph3D.tsx) only mounts it when the section is in view AND the viewer
// has not asked for reduced motion. Palette is brand red; the story is
// follow-the-money: a victim payment (green) into a mule account (ink), fanning
// out to cash-out mules (red), with animated pulses moving along the edges.

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const RED = 0xd71a28;
const GREEN = 0x1e9e5a;
const INK = 0x1e262e;
const AMBER = 0xc67c00;

type NodeSpec = { id: string; pos: [number, number, number]; color: number; r: number };
type EdgeSpec = { a: string; b: string; kind: 'in' | 'out' | 'hop' | 'device' };

// A small, hand-placed laundering network (deterministic — no physics jitter).
const NODES: NodeSpec[] = [
  { id: 'victim', pos: [-5.4, 0.6, 0.4], color: GREEN, r: 0.42 },
  { id: 'mule', pos: [0, 0, 0], color: INK, r: 0.72 },
  { id: 'o1', pos: [3.6, 1.9, 0.8], color: RED, r: 0.36 },
  { id: 'o2', pos: [4.4, 0.4, -1.1], color: RED, r: 0.4 },
  { id: 'o3', pos: [3.9, -1.4, 0.6], color: RED, r: 0.34 },
  { id: 'o4', pos: [2.6, -2.5, -0.9], color: RED, r: 0.3 },
  { id: 'o5', pos: [1.8, 2.7, -0.6], color: RED, r: 0.3 },
  { id: 'h1', pos: [6.9, 2.6, 0.2], color: AMBER, r: 0.26 },
  { id: 'h2', pos: [7.3, -0.6, -1.6], color: AMBER, r: 0.26 },
  { id: 'h3', pos: [6.6, -2.2, 1.0], color: AMBER, r: 0.24 },
];

const EDGES: EdgeSpec[] = [
  { a: 'victim', b: 'mule', kind: 'in' },
  { a: 'mule', b: 'o1', kind: 'out' },
  { a: 'mule', b: 'o2', kind: 'out' },
  { a: 'mule', b: 'o3', kind: 'out' },
  { a: 'mule', b: 'o4', kind: 'out' },
  { a: 'mule', b: 'o5', kind: 'out' },
  { a: 'o1', b: 'h1', kind: 'hop' },
  { a: 'o2', b: 'h2', kind: 'hop' },
  { a: 'o3', b: 'h3', kind: 'hop' },
  { a: 'o2', b: 'o3', kind: 'device' }, // shared-device link
];

const byId = (id: string) => NODES.find((n) => n.id === id)!;

export default function MoneyGraph3DCanvas() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const width = mount.clientWidth;
    const height = mount.clientHeight;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(1, 0.5, 15.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // cap DPR for perf
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.cursor = 'grab';

    const root = new THREE.Group();
    scene.add(root);

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const key = new THREE.DirectionalLight(0xffffff, 0.7);
    key.position.set(4, 6, 8);
    scene.add(key);

    // Nodes (sphere + a faint outer ring for the central mule account).
    const nodeMeshes: Record<string, THREE.Mesh> = {};
    for (const n of NODES) {
      const geo = new THREE.SphereGeometry(n.r, 32, 32);
      const mat = new THREE.MeshStandardMaterial({ color: n.color, roughness: 0.45, metalness: 0.05 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...n.pos);
      root.add(mesh);
      nodeMeshes[n.id] = mesh;
    }
    // Halo around the mule hub.
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(1.05, 0.03, 16, 64),
      new THREE.MeshBasicMaterial({ color: RED, transparent: true, opacity: 0.55 }),
    );
    root.add(halo);

    // Edges as thin lines; device link dashed & fainter.
    const lineMats = {
      in: new THREE.LineBasicMaterial({ color: GREEN, transparent: true, opacity: 0.55 }),
      out: new THREE.LineBasicMaterial({ color: RED, transparent: true, opacity: 0.5 }),
      hop: new THREE.LineBasicMaterial({ color: AMBER, transparent: true, opacity: 0.45 }),
      device: new THREE.LineDashedMaterial({ color: 0x9aa4af, transparent: true, opacity: 0.6, dashSize: 0.22, gapSize: 0.16 }),
    };
    for (const e of EDGES) {
      const pa = new THREE.Vector3(...byId(e.a).pos);
      const pb = new THREE.Vector3(...byId(e.b).pos);
      const geo = new THREE.BufferGeometry().setFromPoints([pa, pb]);
      const line = new THREE.Line(geo, lineMats[e.kind]);
      if (e.kind === 'device') line.computeLineDistances();
      root.add(line);
    }

    // Money pulses: small emissive spheres that travel a→b along each carrying
    // edge, conveying direction of flow (in → mule → out → hop).
    const flowEdges = EDGES.filter((e) => e.kind !== 'device');
    const pulseGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const pulses = flowEdges.map((e, i) => {
      const kindColor = e.kind === 'in' ? GREEN : e.kind === 'hop' ? AMBER : RED;
      const mesh = new THREE.Mesh(pulseGeo, new THREE.MeshBasicMaterial({ color: kindColor }));
      root.add(mesh);
      return { mesh, a: new THREE.Vector3(...byId(e.a).pos), b: new THREE.Vector3(...byId(e.b).pos), t: (i * 0.17) % 1 };
    });

    // Pointer drag to rotate; auto-rotate when idle. (Manual, to avoid the
    // OrbitControls addon and keep the chunk small.)
    const BASE_Y = 0.18;
    let dragY = 0; // user drag offset (relative)
    let targetRotX = 0.05;
    let curRotY = BASE_Y;
    let curRotX = targetRotX;
    let autoT = 0; // phase for the idle oscillation
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let idle = 0;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      idle = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      renderer.domElement.style.cursor = 'grabbing';
      renderer.domElement.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      dragY += (e.clientX - lastX) * 0.005;
      dragY = Math.max(-2.2, Math.min(2.2, dragY));
      targetRotX += (e.clientY - lastY) * 0.005;
      targetRotX = Math.max(-0.6, Math.min(0.6, targetRotX));
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      renderer.domElement.style.cursor = 'grab';
      try {
        renderer.domElement.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };
    renderer.domElement.addEventListener('pointerdown', onDown);
    renderer.domElement.addEventListener('pointermove', onMove);
    renderer.domElement.addEventListener('pointerup', onUp);
    renderer.domElement.addEventListener('pointercancel', onUp);

    // Render loop — paused when the tab is hidden.
    let raf = 0;
    let running = true;
    const clock = new THREE.Clock();

    const onVisibility = () => {
      running = document.visibilityState === 'visible';
      if (running) {
        clock.getDelta(); // discard the gap so nothing jumps
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    function tick() {
      if (!running) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      idle += dt;
      // Idle motion: a slow oscillation around the readable orientation (so the
      // victim → mule → fan-out reading is preserved), composed with drag.
      if (!dragging && idle > 0.4) autoT += dt;
      const autoY = Math.sin(autoT * 0.3) * 0.5;
      const targetRotY = BASE_Y + dragY + autoY;
      curRotY += (targetRotY - curRotY) * 0.08;
      curRotX += (targetRotX - curRotX) * 0.08;
      root.rotation.y = curRotY;
      root.rotation.x = curRotX;

      const pulseScale = 1 + Math.sin(clock.elapsedTime * 2) * 0.12;
      halo.scale.setScalar(pulseScale);
      halo.rotation.z += dt * 0.4;

      for (const p of pulses) {
        p.t = (p.t + dt * 0.35) % 1;
        p.mesh.position.lerpVectors(p.a, p.b, p.t);
        const fade = Math.sin(p.t * Math.PI);
        (p.mesh.material as THREE.MeshBasicMaterial).opacity = fade;
        p.mesh.scale.setScalar(0.6 + fade * 0.8);
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      running = false;
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      renderer.domElement.removeEventListener('pointerdown', onDown);
      renderer.domElement.removeEventListener('pointermove', onMove);
      renderer.domElement.removeEventListener('pointerup', onUp);
      renderer.domElement.removeEventListener('pointercancel', onUp);
      renderer.dispose();
      pulseGeo.dispose();
      Object.values(nodeMeshes).forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} aria-hidden="true" />;
}
