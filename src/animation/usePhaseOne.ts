import { projectExtent } from '../projects/projectConfig';
import { useLayoutEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import type { AvatarVisualHandle } from '../components/Avatar';
import type { PortraitScene } from '../scenes/portraitScene';
import { createPhaseOneState } from './phaseOneState';
import { sampleHeroAmbient } from './heroAmbient';
import { createAnimationDirector } from '../cinematic/AnimationDirector';
import { createPhaseOneTimeline } from './phaseOneTimeline';
import { projects as projectDefinitions } from '../projects/projectConfig';
import { createStoryDirector } from '../story/StoryDirector';

type Controls = { scrollTo: (progress: number) => void; focusIdentity: () => void };

export function usePhaseOne(rootRef: RefObject<HTMLElement | null>, avatarRef: RefObject<AvatarVisualHandle | null>) {
  const controls = useRef<Controls | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const media = gsap.matchMedia();
    let retainedProgress: { phaseOne: number; phaseTwo: number; phaseThree:number; phaseProjects:number; phaseExperience:number; phaseContact:number;workOffset?:number } | undefined;
    let ambientTime=0;

    media.add({ mobile: '(max-width: 700px)', desktop: '(min-width: 701px)', reduced: '(prefers-reduced-motion: reduce)' }, context => {
      const mobile = Boolean(context.conditions?.mobile);
      const reduced = Boolean(context.conditions?.reduced);
      const state = createPhaseOneState();
      root.dataset.webglReady = 'false';
      root.dataset.ready = 'false';
      let disposed = false;
      let visible = !document.hidden;
      let scene: PortraitScene | undefined;
      let width = 0, height = 0, avatarWidth = 0, anchorX = 0, anchorY = 0;
      let lastFrameTime = -1;
      let lastPose = '';
      let previousAmbientTick:number|undefined;
      let workSleeping=false;
      let resizeProgress:typeof retainedProgress;
      let navigationCovered=false;
      const navigationCover=root.querySelector<HTMLElement>('[data-navigation-cover]')!;
      let navigationTween:gsap.core.Tween|undefined;

      const stage = root.querySelector<HTMLElement>('[data-stage]')!;
      const anchor = root.querySelector<HTMLElement>('.avatar-anchor')!;
      const mount = root.querySelector<HTMLElement>('[data-webgl]')!;
      const lenis = new Lenis({
        autoRaf: false,
        smoothWheel: !reduced,
        syncTouch: false,
        lerp: .105,
        wheelMultiplier: .85,
      });
      const unsubscribe = lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.lagSmoothing(0);
      const director = createAnimationDirector(root, mobile, reduced);
      const storyDirector=createStoryDirector(root,mobile,reduced);
      const timeline = createPhaseOneTimeline({ root, state, mobile, reduced });

      const measure = () => {
        storyDirector.layout();
        workSleeping=false;
        width = stage.clientWidth; height = stage.clientHeight;
        avatarWidth = anchor.offsetWidth;
        anchorX = anchor.offsetLeft / width;
        anchorY = anchor.offsetTop / height;
        scene?.resize(width, height, avatarWidth, anchorX, anchorY);
        lastPose = '';
      };
      measure();

      const render = (time: number) => {
        if (!visible || disposed) { previousAmbientTick=undefined; return; }
        lenis.raf(time * 1000);
        const ambientActive=!reduced&&!navigationCovered&&director.state.progress===0&&state.idleWeight>0;
        if(ambientActive&&previousAmbientTick!==undefined)ambientTime+=Math.min(.1,Math.max(0,time-previousAmbientTick));
        previousAmbientTick=ambientActive?time:undefined;
        const inWork=window.scrollY>=storyDirector.workStart()&&window.scrollY<storyDirector.contactStart();
        root.dataset.workActive=String(inWork);
        if (root.dataset.ready === 'true'&&!resizeProgress) retainedProgress = { phaseOne: timeline.progress(), phaseTwo: director.state.progress,phaseThree:storyDirector.state.progress,phaseProjects:storyDirector.projectState.progress,phaseExperience:storyDirector.experienceState.progress,phaseContact:storyDirector.contactState.progress,workOffset:inWork?window.scrollY-storyDirector.workStart():undefined };
        if(navigationCovered)return;
        if(inWork&&workSleeping)return;
        workSleeping=inWork;
        // Lenis, the scrubbed timeline, and all visuals share GSAP's ticker.
        // One paused clock drives the nested image and existing cage, never the scroll pose.
        const ambient=sampleHeroAmbient(ambientTime,reduced?0:state.idleWeight,mobile);
        if (time - lastFrameTime < 1 / 45 && state.idleWeight > 0) return;
        const poseKey = `${Object.values(state.avatar).join(':')}:${ambient.photoY.toFixed(4)}:${ambient.haloY.toFixed(4)}`;
        if (poseKey !== lastPose) {
          avatarRef.current?.update(state.avatar, ambient, width, height);
          lastPose = poseKey;
        }
        scene?.render(state, time, director.state.progress,storyDirector.state.progress,storyDirector.experienceState.progress,storyDirector.projectState.progress,storyDirector.contactState.progress,ambient);
        lastFrameTime = time;
      };
      gsap.ticker.add(render);
      render(0);

      const fallback = () => {
        if (disposed) return;
        root.dataset.webglReady = 'false';
        if (scene) { scene.dispose(); scene = undefined; }
        storyDirector.projectTimeline.eventCallback('onUpdate')?.();
        const experience=storyDirector.experienceTimeline.scrollTrigger!;
        storyDirector.experienceTimeline.progress(gsap.utils.clamp(0,1,(window.scrollY-experience.start)/(experience.end-experience.start)));
        storyDirector.experienceTimeline.eventCallback('onUpdate')?.();
        const contact=storyDirector.contactTimeline.scrollTrigger!;
        storyDirector.contactTimeline.progress(gsap.utils.clamp(0,1,(window.scrollY-contact.start)/(contact.end-contact.start)));
        storyDirector.contactTimeline.eventCallback('onUpdate')?.();
      };
      if (!reduced) {
        import('../scenes/portraitScene').then(({ createPortraitScene }) => {
          if (disposed) return;
          try {
            scene = createPortraitScene(mount, fallback, root.querySelector<HTMLElement>('[data-cinematic-world]')!, mobile);
            measure();
            scene.render(state, 0, director.state.progress,storyDirector.state.progress,storyDirector.experienceState.progress,storyDirector.projectState.progress,storyDirector.contactState.progress,sampleHeroAmbient(ambientTime,state.idleWeight,mobile));
            root.dataset.webglReady = 'true';
          } catch {
            fallback();
          }
        }).catch(fallback);
      }

      controls.current = {
        scrollTo(progress) {
          const trigger = timeline.scrollTrigger!;
          const target = trigger.start + (trigger.end - trigger.start) * Math.min(1, Math.max(0, progress));
          lenis.scrollTo(target, { duration: reduced ? 0 : 1.8, immediate: reduced });
        },
        focusIdentity() {
          root.querySelector<HTMLElement>('#identity-end')?.focus({ preventScroll: true });
        },
      };

      let resizeTimer: ReturnType<typeof setTimeout>;
      const restoreProgress=(progress:NonNullable<typeof retainedProgress>)=>{
        const first=timeline.scrollTrigger!,second=director.timeline.scrollTrigger!,third=storyDirector.timeline.scrollTrigger!,projects=storyDirector.projectTimeline.scrollTrigger!,experience=storyDirector.experienceTimeline.scrollTrigger!,contact=storyDirector.contactTimeline.scrollTrigger!;
        const at=(trigger:typeof first,p:number)=>trigger.start+(trigger.end-trigger.start)*p;
        const target=progress.workOffset!==undefined?storyDirector.workStart()+progress.workOffset:progress.phaseContact>0?at(contact,progress.phaseContact):progress.phaseExperience>0?at(experience,progress.phaseExperience):progress.phaseProjects>0?at(projects,progress.phaseProjects/projectExtent):progress.phaseThree>0?at(third,progress.phaseThree):progress.phaseTwo>0?at(second,progress.phaseTwo):at(first,progress.phaseOne);
        lenis.scrollTo(target,{immediate:true});ScrollTrigger.update();
      };
      const resize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (disposed) return;
          measure(); lenis.resize(); ScrollTrigger.refresh();
          if(resizeProgress){restoreProgress(resizeProgress);resizeProgress=undefined;}
        }, 120);
      };
      const viewportResize=()=>{resizeProgress??=retainedProgress;resize();};
      const visibility = () => { visible = !document.hidden; previousAmbientTick=undefined; if (visible) lastPose = ''; };
      const keyboard = (event: KeyboardEvent) => {
        if(event.defaultPrevented)return;
        if (!['Home', 'End', 'PageUp', 'PageDown', 'ArrowUp', 'ArrowDown', ' '].includes(event.key)) return;
        if ((event.target as HTMLElement)?.closest('input, textarea, select, [contenteditable="true"]')) return;
        // Yield pending wheel inertia before the browser performs native keyboard scrolling.
        lenis.scrollTo(window.scrollY, { immediate: true });
      };
      const synchronizeRefresh = () => {
        const trigger = timeline.scrollTrigger;
        if (!trigger || disposed) return;
        // Refresh can reset a newly constructed timeline while native restored scroll
        // stays stationary. Commit that same scroll-derived frame once, after layout.
        timeline.progress(gsap.utils.clamp(0, 1, (window.scrollY - trigger.start) / (trigger.end - trigger.start)));
        // ScrollTrigger can restore the playhead with callbacks suppressed.
        // Refresh the chapter/ARIA metadata even when the playhead already matches.
        timeline.eventCallback('onUpdate')?.();
        const second = director.timeline.scrollTrigger!;
        director.timeline.progress(gsap.utils.clamp(0, 1, (window.scrollY - second.start) / (second.end - second.start)));
        director.timeline.eventCallback('onUpdate')?.();
        const third=storyDirector.timeline.scrollTrigger!;
        storyDirector.timeline.progress(gsap.utils.clamp(0,1,(window.scrollY-third.start)/(third.end-third.start)));
        storyDirector.timeline.eventCallback('onUpdate')?.();
        const projects=storyDirector.projectTimeline.scrollTrigger!;
        storyDirector.projectTimeline.progress(gsap.utils.clamp(0,1,(window.scrollY-projects.start)/(projects.end-projects.start)));
        storyDirector.projectTimeline.eventCallback('onUpdate')?.();
        const experience=storyDirector.experienceTimeline.scrollTrigger!;
        storyDirector.experienceTimeline.progress(gsap.utils.clamp(0,1,(window.scrollY-experience.start)/(experience.end-experience.start)));
        storyDirector.experienceTimeline.eventCallback('onUpdate')?.();
        const contact=storyDirector.contactTimeline.scrollTrigger!;
        storyDirector.contactTimeline.progress(gsap.utils.clamp(0,1,(window.scrollY-contact.start)/(contact.end-contact.start)));
        storyDirector.contactTimeline.eventCallback('onUpdate')?.();
      };
      window.addEventListener('resize', viewportResize);
      window.addEventListener('keydown', keyboard);
      document.addEventListener('visibilitychange', visibility);
      ScrollTrigger.addEventListener('refreshInit', measure);
      ScrollTrigger.addEventListener('refresh', synchronizeRefresh);
      const workObserver=new ResizeObserver(resize);workObserver.observe(root.querySelector('[data-selected-work]')!);
      const navigateSection=(event:Event)=>{
        const {section,offset=0,transition=false}=(event as CustomEvent<{section:string;offset?:number;transition?:boolean}>).detail;
        if(root.dataset.navigating==='true')return;
        const target=section==='work'?storyDirector.workStart()+offset:storyDirector.contactTimeline.scrollTrigger!.end;
        const arrive=()=>{navigationCovered=false;workSleeping=false;ScrollTrigger.update();synchronizeRefresh();if(section==='contact'||offset===0)root.querySelector<HTMLElement>(section==='work'?'#work-title':'.contact-primary')?.focus({preventScroll:true});};
        if(reduced||!transition){lenis.scrollTo(target,{immediate:true});arrive();return;}
        root.dataset.navigating='true';root.querySelector('[data-navigation-status]')!.textContent=section==='work'?'Opening Selected Work.':'Opening Contact.';
        navigationTween=gsap.to(navigationCover,{autoAlpha:1,duration:.18,ease:'power1.out',onComplete:()=>{
          navigationCovered=true;
          lenis.scrollTo(target,{duration:.52,lock:true,force:true,onComplete:()=>{
            if(disposed)return;arrive();
            navigationTween=gsap.to(navigationCover,{autoAlpha:0,duration:.30,ease:'power1.inOut',delay:.03,onComplete:()=>{root.dataset.navigating='false';root.querySelector('[data-navigation-status]')!.textContent=section==='work'?'Selected Work. Choose a project to explore.':'Contact. Email and professional links are available.';}});
          }});
        }});
      };
      window.addEventListener('portfolio:navigate',navigateSection);

      // Initial CSS is complete; refresh only after local fonts/image settle.
      Promise.allSettled([
        document.fonts.ready,
        ...Array.from(root.querySelectorAll<HTMLImageElement>('img[src]:not([loading="lazy"])')).map(image => image.decode()),
      ]).then(() => {
        if (disposed) return;
        measure(); lenis.resize(); ScrollTrigger.refresh();
        const progress = retainedProgress;
        if (progress !== undefined) {
          const first = timeline.scrollTrigger!, second = director.timeline.scrollTrigger!,third=storyDirector.timeline.scrollTrigger!;
          const projects=storyDirector.projectTimeline.scrollTrigger!;
          const experience=storyDirector.experienceTimeline.scrollTrigger!;
          const contact=storyDirector.contactTimeline.scrollTrigger!;
          const target = progress.phaseContact>0?contact.start+(contact.end-contact.start)*progress.phaseContact:progress.phaseExperience>0?experience.start+(experience.end-experience.start)*progress.phaseExperience:progress.phaseProjects>0?projects.start+(projects.end-projects.start)*progress.phaseProjects/projectExtent:progress.phaseThree>0?third.start+(third.end-third.start)*progress.phaseThree:progress.phaseTwo > 0 ? second.start + (second.end - second.start) * progress.phaseTwo : first.start + (first.end - first.start) * progress.phaseOne;
          lenis.scrollTo(progress.workOffset!==undefined?storyDirector.workStart()+progress.workOffset:target, { immediate: true });
          ScrollTrigger.update();
        }
        const requestedProject=projectDefinitions.find(project=>project.id===new URLSearchParams(location.search).get('project'));
        if(progress===undefined&&window.scrollY<1&&requestedProject){
          const trigger=storyDirector.projectTimeline.scrollTrigger!;
          lenis.scrollTo(trigger.start+(trigger.end-trigger.start)*(requestedProject.start+.03)/projectExtent,{immediate:true});
          ScrollTrigger.update();
        }
        const section=new URLSearchParams(location.search).get('section');
        if(progress===undefined&&(section==='work'||['#projects','#selected-work'].includes(location.hash)||location.hash.startsWith('#project-'))){lenis.scrollTo(storyDirector.workStart(),{immediate:true});ScrollTrigger.update();}
        if(progress===undefined&&window.scrollY<1&&(section==='finale'||section==='experience')){
          const trigger=storyDirector.experienceTimeline.scrollTrigger!;
          lenis.scrollTo(trigger.start+(trigger.end-trigger.start)*(section==='finale'?.03:.40),{immediate:true});
          ScrollTrigger.update();
        }
        if(progress===undefined&&window.scrollY<1&&(section==='contact'||location.hash==='#contact')){
          const trigger=storyDirector.contactTimeline.scrollTrigger!;
          lenis.scrollTo(trigger.end,{immediate:true});ScrollTrigger.update();
        }
        synchronizeRefresh();
        root.dataset.ready = 'true';
      });

      return () => {
        disposed = true;
        navigationTween?.kill();navigationCovered=false;root.dataset.navigating='false';gsap.set(navigationCover,{autoAlpha:0});
        clearTimeout(resizeTimer);
        gsap.ticker.remove(render);
        unsubscribe(); lenis.destroy();
        timeline.scrollTrigger?.kill(); timeline.kill();
        director.timeline.scrollTrigger?.kill(); director.timeline.kill();
        storyDirector.timeline.scrollTrigger?.kill();storyDirector.timeline.kill();
        storyDirector.projectTimeline.scrollTrigger?.kill();storyDirector.projectTimeline.kill();
        storyDirector.experienceTimeline.scrollTrigger?.kill();storyDirector.experienceTimeline.kill();
        storyDirector.contactTimeline.scrollTrigger?.kill();storyDirector.contactTimeline.kill();storyDirector.dispose();
        scene?.dispose();
        window.removeEventListener('resize', viewportResize);
        workObserver.disconnect();window.removeEventListener('portfolio:navigate',navigateSection);
        window.removeEventListener('keydown', keyboard);
        document.removeEventListener('visibilitychange', visibility);
        ScrollTrigger.removeEventListener('refreshInit', measure);
        ScrollTrigger.removeEventListener('refresh', synchronizeRefresh);
        controls.current = null;
        root.dataset.webglReady = 'false';
        root.dataset.ready = 'false';
      };
    }, root);

    return () => media.revert();
  }, [rootRef, avatarRef]);

  return controls;
}
