import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getPhaseOneEndPose, PHASE_ONE, type PhaseOneState } from './phaseOneState';

gsap.registerPlugin(ScrollTrigger);

type Options = { root: HTMLElement; state: PhaseOneState; mobile: boolean; reduced: boolean };

export function createPhaseOneTimeline({ root, state, mobile, reduced }: Options) {
  const select = gsap.utils.selector(root);
  const paths = Array.from(root.querySelectorAll<SVGPathElement>('[data-signature] path'));
  paths.forEach(path => {
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
  });

  let previousStage = '';
  const timeline = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      id: 'phase-one',
      trigger: root,
      start: 'top top',
      end: () => `+=${root.querySelector<HTMLElement>('[data-stage]')!.clientHeight * (reduced ? 1.2 : mobile ? 2.7 : 3.2)}`,
      scrub: true,
      invalidateOnRefresh: true,
    },
    onUpdate: () => {
      const progress = timeline.progress();
      root.dataset.progress = progress.toFixed(4);
      const stage = progress >= PHASE_ONE.complete ? 'complete' : progress >= PHASE_ONE.signatureStart ? 'signature' : 'portrait';
      if (stage === previousStage) return;
      previousStage = stage;
      root.dataset.phase = stage;
      const number = root.querySelector('[data-stage-number]');
      const name = root.querySelector('[data-stage-name]');
      const announcement = root.querySelector('[data-announcement]');
      if (number) number.textContent = stage === 'complete' ? '03' : stage === 'signature' ? '02' : '01';
      if (name) name.textContent = stage === 'complete' ? 'PROLOGUE COMPLETE' : stage === 'signature' ? 'THE SIGNATURE' : 'THE OPENING';
      if (announcement) announcement.textContent = stage === 'complete' ? 'Signature complete. End of the opening.' : stage === 'signature' ? 'Drawing the DS signature.' : '';
      const openingLink = root.querySelector('[data-nav-opening]');
      const identityLink = root.querySelector('[data-nav-identity]');
      if (stage === 'portrait') {
        openingLink?.setAttribute('aria-current', 'step');
        identityLink?.removeAttribute('aria-current');
      } else {
        identityLink?.setAttribute('aria-current', 'step');
        openingLink?.removeAttribute('aria-current');
      }
    },
  });

  timeline
    .addLabel('hero', 0)
    .addLabel('anticipation', .6)
    .addLabel('reframe', 1.2)
    .addLabel('signature', 3.7)
    .addLabel('hold', 7.8)
    .addLabel('handoff', 9.4)
    .to(state, { progress: 1, duration: PHASE_ONE.duration }, 0)
    .to(select('[data-progress]'), { scaleX: 1, duration: PHASE_ONE.duration }, 0)
    .to(select('[data-hero-copy]'), { autoAlpha: 0, y: reduced ? 0 : -15, duration: 1.55, ease: 'power1.inOut' }, .65)
    .to(select('[data-name-first]'), { x: reduced ? 0 : -65, y: reduced ? 0 : -18, autoAlpha: 0, duration: 2.3, ease: 'power1.inOut' }, .55)
    .to(select('[data-name-last]'), { x: reduced ? 0 : -35, y: reduced ? 0 : 12, autoAlpha: 0, duration: 2.25, ease: 'power1.inOut' }, .75)
    .to(select('[data-scroll-invitation]'), { autoAlpha: 0, duration: .9 }, .65)
    .to(select('[data-darkness]'), { opacity: 1, duration: 1.3, ease: 'power1.inOut' }, .55)
    .to(select('[data-stage]'), { color: '#f4f0e8', duration: 1.3, ease: 'power1.inOut' }, .55)
    .to(state, { darkness: 1, idleWeight: 0, duration: 1.6, ease: 'power1.inOut' }, .55)
    .to(select('[data-portrait-mat]'), { opacity: 1, duration: 1.25 }, .75)
    .to(select('[data-transition-type]'), { autoAlpha: 1, duration: 1.2 }, 1)
    .fromTo(select('[data-type-first]'), { xPercent: reduced ? 0 : 9 }, { xPercent: reduced ? 0 : -9, duration: 8.2 }, .8)
    .fromTo(select('[data-type-last]'), { xPercent: reduced ? 0 : -9 }, { xPercent: reduced ? 0 : 9, duration: 8.2 }, .8)
    .to(select('.portrait-webgl, .face-cage-fallback'), { autoAlpha: 0, duration: 1.25 }, 1.05)
    .to(select('.avatar-image'), { filter: 'saturate(.24) contrast(1.02) brightness(.76)', duration: 3.2 }, 1.6);

  const frameClip = () => {
    const style = getComputedStyle(root.querySelector('[data-stage]')!);
    return `inset(${style.getPropertyValue('--frame-top').trim()} ${style.getPropertyValue('--frame-side').trim()} ${style.getPropertyValue('--frame-bottom').trim()} ${style.getPropertyValue('--frame-side').trim()})`;
  };
  timeline.fromTo(select('[data-portrait-window]'), { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: frameClip, duration: reduced ? 1.3 : 6.7, ease: reduced ? 'none' : 'power2.out' }, .7);

  const resolvePose = () => {
    const stage = root.querySelector<HTMLElement>('[data-stage]')!;
    const anchor = root.querySelector<HTMLElement>('.avatar-anchor')!;
    return getPhaseOneEndPose(mobile, { width: stage.clientWidth, height: stage.clientHeight, avatarWidth: anchor.offsetWidth, anchorY: anchor.offsetTop / stage.clientHeight });
  };
  const endPose = { x: () => resolvePose().x, y: () => resolvePose().y, scale: () => resolvePose().scale };
  const startPose = { x: 0, y: 0, scale: 1 };
  if (reduced) {
    timeline
      .to(select('.avatar-anchor'), { opacity: 0, duration: 1.1 }, 1)
      .fromTo(state.avatar, startPose, { ...endPose, duration: 0, immediateRender: false }, 2.3)
      .to(select('.avatar-anchor'), { opacity: 1, duration: 1.1 }, 2.8);
  } else {
    timeline.fromTo(state.avatar, startPose, { ...endPose, duration: 6.7, ease: 'power2.out' }, .7);
  }

  timeline
    .to(select('[data-identity-label]'), { autoAlpha: 1, duration: .65 }, 3.2)
    .to(paths[0], { strokeDashoffset: 0, duration: 1.65, ease: 'power1.inOut' }, 3.7)
    .to(paths[1], { strokeDashoffset: 0, duration: 1.55, ease: 'power1.inOut' }, 5.3)
    .to(paths[2], { strokeDashoffset: 0, duration: .75, ease: 'power1.out' }, 6.9)
    .to(select('[data-signature]'), { scale: reduced ? 1 : 1.045, duration: 1.65, ease: 'power1.out' }, 6.4)
    .fromTo(select('[data-signature-caption]'), { y: reduced ? 0 : 12 }, { y: 0, autoAlpha: 1, duration: 1.15, ease: 'power2.out' }, 7.15)
    .to(select('[data-identity-rule]'), { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, 8.25)
    .to(select('[data-replay]'), { autoAlpha: 1, duration: .5 }, 9.1);

  return timeline;
}
