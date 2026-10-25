import gsap from 'gsap';
import { cinematicConfig as C, range, smooth } from './config';
export function createAnimationDirector(root: HTMLElement, mobile: boolean, reduced: boolean) {
  const state = { progress: 0 };
  const stage = root.querySelector<HTMLElement>('[data-stage]')!;
  const phaseOneDistance = () => stage.clientHeight * (reduced ? 1.2 : mobile ? 2.7 : 3.2);
  const distance = () => stage.clientHeight * (reduced ? C.scroll.reduced : mobile ? C.scroll.mobile : C.scroll.desktop) / 100;
  // StoryDirector owns total document extent; this trigger retains its exact range.
  const timeline = gsap.timeline({ scrollTrigger: { id: 'phase-two', trigger: root, start: () => `top+=${phaseOneDistance()} top`, end: () => `+=${distance()}`, scrub: true, invalidateOnRefresh: true }, onUpdate: () => {
    const p = state.progress;
    root.dataset.cinematicProgress = p.toFixed(5);
    root.dataset.cinematicPhase = p === 0 ? 'identity' : p < .19 ? 'spatial' : p < .44 ? 'descent' : p < .56 ? 'approach' : p < .64 ? 'impact' : p < .76 ? 'breakthrough' : p < .87 ? 'landing' : p < .96 ? 'recovery' : 'settled';
    root.style.setProperty('--world-opacity', String(range(p, .01, .12)));
    root.style.setProperty('--editorial-opacity', String(1 - range(p, .015, .12)));
    const world = root.querySelector<HTMLElement>('[data-cinematic-world]')!;
    const frame = getComputedStyle(stage), expansion = 1-smooth(range(p,.08,.22));
    const inset = (key: string) => parseFloat(frame.getPropertyValue(key))*expansion;
    world.style.clipPath = `inset(${inset('--frame-top')}% ${inset('--frame-side')}% ${inset('--frame-bottom')}% ${inset('--frame-side')}%)`;
    const layer = root.querySelector<HTMLElement>('.editorial-layer')!;
    layer.style.transform = reduced ? '' : p > 0 ? `perspective(1200px) rotateX(${range(p,0,.12)*5}deg) scale(${1-range(p,0,.12)*.045})` : '';
    layer.inert = p > .12;
    layer.setAttribute('aria-hidden', String(p > .12));
    const opacity = (name: string, value: number) => root.querySelector<SVGElement>(`[data-fallback-${name}]`)?.setAttribute('opacity', String(value));
    opacity('shaft', 1-range(p,.85,.96)); opacity('glass', range(p,.44,.55)*(1-range(p,.62,.68)));
    opacity('cracks', range(p,.56,.595)); opacity('shards', range(p,.62,.68)*(1-range(p,.73,.81))); opacity('floor', range(p,.76,.87));
    root.querySelector('.cinematic-fallback svg')?.setAttribute('viewBox', mobile ? '300 0 400 700' : '0 0 1000 700');
    root.querySelector('[data-fallback-proxy]')?.setAttribute('transform', `translate(${smooth(range(p,.91,1))*(mobile ? 85 : 220)} 0)`);
    const label = root.querySelector('[data-cinematic-announcement]');
    if (label) label.textContent = p >= .96 ? 'Landing complete.' : p >= .64 ? 'Through the glass.' : p >= .56 ? 'Glass impact.' : p >= .19 ? 'Descending.' : '';
  }});
  timeline.to(state, { progress: 1, duration: 1, ease: 'none' });
  return { state, timeline, phaseOneDistance };
}
