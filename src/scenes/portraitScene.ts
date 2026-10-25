import {
  Color, EdgesGeometry, IcosahedronGeometry, LineBasicMaterial, LineSegments,
  PerspectiveCamera, Scene, WebGLRenderer,
} from 'three';
import { createCinematicWorld } from '../cinematic/CinematicWorld';
import type { PhaseOneState } from '../animation/phaseOneState';
import type { HeroAmbient } from '../animation/heroAmbient';

export interface PortraitScene {
  resize: (width: number, height: number, avatarWidth: number, anchorX: number, anchorY: number) => void;
  render: (state: PhaseOneState, time?: number, cinematicProgress?: number, storyProgress?:number, experienceProgress?:number,projectProgress?:number,contactProgress?:number,ambient?:HeroAmbient) => void;
  dispose: () => void;
}

/** A real, faceted ellipsoid registered to the source portrait's head coordinates. */
export function createPortraitScene(container: HTMLElement, onLost: () => void, worldMount: HTMLElement, mobile: boolean): PortraitScene {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' });
  if (!context) throw new Error('Use the vector face cage when WebGL is unavailable.');
  const renderer = new WebGLRenderer({ canvas, context, alpha: true, antialias: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, innerWidth <= 700 ? 1.25 : 1.5));
  canvas.setAttribute('aria-hidden', 'true');
  container.appendChild(canvas);
  const world = createCinematicWorld(renderer, mobile, worldMount.closest<HTMLElement>('.opening')!);
  let inWorld = false;
  const scene = new Scene();
  const camera = new PerspectiveCamera(40, 1, 1, 3000);
  camera.position.z = 1500;
  const shell = new IcosahedronGeometry(1, 1);
  const geometry = new EdgesGeometry(shell, 1);
  shell.dispose();
  const material = new LineBasicMaterial({ color: '#917854', transparent: true, opacity: .18, depthWrite: false });
  const cage = new LineSegments(geometry, material);
  scene.add(cage);
  let width = 1, height = 1, avatarWidth = 1, anchorX = .5, anchorY = .5;
  let pointerX = 0, pointerY = 0, easedX = 0, easedY = 0;
  let last = '';
  const ivoryColor = new Color('#917854');
  const inkColor = new Color('#e2bd82');
  const stage = container.parentElement!;
  const pointer = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    pointerX = event.clientX / width - .5;
    pointerY = event.clientY / height - .5;
  };
  const resetPointer = () => { pointerX = 0; pointerY = 0; };
  const contextLost = (event: Event) => { event.preventDefault(); onLost(); };
  canvas.addEventListener('webglcontextlost', contextLost);
  stage.addEventListener('pointermove', pointer, { passive: true });
  stage.addEventListener('pointerleave', resetPointer);
  return {
    resize(w, h, a, x, y) {
      width = w; height = h; avatarWidth = a; anchorX = x; anchorY = y;
      camera.aspect = w / h;
      camera.fov = 2 * Math.atan(h / (2 * camera.position.z)) * 180 / Math.PI;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      world.resize(w, h);
      last = '';
    },
    render(state, time = 0, cinematicProgress = 0, storyProgress=0,experienceProgress=0,projectProgress=0,contactProgress=0,ambient={photoY:0,haloY:0,time:0}) {
      if(state.progress>.03&&worldMount.closest<HTMLElement>('.opening')!.dataset.workActive!=='true')world.prepareAvatar();
      if (cinematicProgress > 0) {
        if (!inWorld) { worldMount.appendChild(canvas); inWorld = true; world.resize(width, height); }
        world.render(cinematicProgress, time,storyProgress,experienceProgress,projectProgress,contactProgress);
        if (import.meta.env.DEV && new URLSearchParams(location.search).has('debug')) worldMount.dataset.debug = JSON.stringify(world.snapshot(cinematicProgress));
        return;
      }
      worldMount.closest<HTMLElement>('.opening')!.dataset.avatarLoadingVisible='false';
      if (inWorld) { container.appendChild(canvas); inWorld = false; last = ''; }
      const { avatar, darkness, idleWeight } = state;
      easedX += (pointerX - easedX) * .08;
      easedY += (pointerY - easedY) * .08;
      const turn = (easedX * .3 + Math.sin(ambient.time * .42) * .045) * idleWeight;
      const tilt = easedY * .16 * idleWeight;
      const floatY = ambient.photoY + ambient.haloY;
      const key = `${avatar.x.toFixed(5)}:${avatar.y.toFixed(5)}:${avatar.scale.toFixed(5)}:${darkness.toFixed(4)}:${turn.toFixed(4)}:${tilt.toFixed(4)}:${floatY.toFixed(4)}`;
      if (last === key) return;
      last = key;
      // The original 295 × 426 image has its head center at approximately (147.5, 50).
      const size = avatarWidth * avatar.scale;
      cage.position.set((anchorX - .5 + avatar.x) * width, (.5 - anchorY - avatar.y) * height + size * .5525 - floatY, 0);
      cage.scale.set(size * .15, size * .185, size * .132);
      cage.rotation.set(-.08 + tilt, .25 + turn + darkness * .12, -.08);
      material.color.copy(ivoryColor).lerp(inkColor, darkness);
      material.opacity = .18 - darkness * .07;
      renderer.render(scene, camera);
    },
    dispose() {
      canvas.removeEventListener('webglcontextlost', contextLost);
      stage.removeEventListener('pointermove', pointer);
      stage.removeEventListener('pointerleave', resetPointer);
      world.dispose(); geometry.dispose(); material.dispose(); renderer.dispose(); if(!context.isContextLost())renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
