import { CinematicFallback } from './CinematicFallback';
import { StoryOverlay } from './StoryOverlay';
import { ProjectOverlay } from './ProjectOverlay';
import { ExperienceOverlay } from './ExperienceOverlay';
import { ContactOverlay } from './ContactOverlay';
import { SelectedWork } from './SelectedWork';
import { useCallback, useRef } from 'react';
import { Avatar, type AvatarVisualHandle } from './Avatar';
import { Navigation } from './Navigation';
import { Signature } from './Signature';
import { usePhaseOne } from '../animation/usePhaseOne';

export function Opening() {
  const root = useRef<HTMLElement>(null);
  const avatar = useRef<AvatarVisualHandle>(null);
  const controls = usePhaseOne(root, avatar);
  const navigate = useCallback((progress: number) => controls.current?.scrollTo(progress), [controls]);

  return (
    <main id="opening" className="opening" ref={root} data-phase="portrait">
      <a className="skip-link" href="#identity-end" onClick={event => { event.preventDefault(); navigate(1); controls.current?.focusIdentity(); }}>Skip to identity</a>
      <div className="opening-stage" data-stage>
        <div className="cinematic-world" data-cinematic-world aria-hidden="true" />
        <CinematicFallback />
        <div className="editorial-layer">
        <div className="stage-darkness" aria-hidden="true" data-darkness />
        <div className="stage-texture" aria-hidden="true" />
        <svg className="contour-field" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" data-hero-copy>
          <g fill="none" stroke="currentColor" strokeWidth=".65">
            <path d="M-130 520C140 170 350 570 510-60M-80 760C60 300 570 390 635-80M-30 1040C-120 410 280 630 340 860M970-100C1120 280 830 420 1030 590S1410 850 1530 370M1050 1050C980 560 1350 370 1540 480" />
          </g>
        </svg>
        <Navigation navigate={navigate} />

        <div className="hero-eyebrow" data-hero-copy><span className="tiny-star" aria-hidden="true">✳</span> Intelligence, with a human touch.</div>
        <h1 className="hero-name" aria-label="Deepanshu Singhal">
          <span className="hero-name-first" data-name-first aria-hidden="true">DEEPANSHU</span>
          <span className="hero-name-last" data-name-last aria-hidden="true">Singhal<span className="name-period">.</span></span>
        </h1>

        <div className="transition-type" aria-hidden="true" data-transition-type>
          <div className="transition-type-first" data-type-first>HUMAN INTENT. HUMAN INTENT. HUMAN INTENT.</div>
          <div className="transition-type-last" data-type-last>INTELLIGENT SYSTEMS. INTELLIGENT SYSTEMS.</div>
        </div>
        <div className="portrait-window" data-portrait-window>
          <div className="portrait-mat" aria-hidden="true" data-portrait-mat />
          <div className="portrait-webgl" data-webgl aria-hidden="true" />
          <Avatar ref={avatar} />
        </div>

        <div className="hero-introduction" data-hero-copy>
          <p className="role-label">AI PRODUCT ENGINEER</p>
          <p className="intro-statement">From intelligence<br />to something <em>real.</em></p>
          <p className="intro-detail">RAG systems. AI agents.<br />Full-stack delivery.</p>
          <a className="hero-project-action" href="#selected-work" onClick={event=>{event.preventDefault();window.dispatchEvent(new CustomEvent('portfolio:navigate',{detail:{section:'work',transition:true}}));}}>Explore projects <span aria-hidden="true">↗</span></a>
        </div>
        <div className="portrait-index" data-hero-copy><span>HUMAN CURIOSITY.<br />ARTIFICIAL INTELLIGENCE.</span><p>Built with purpose.<br /><strong>From idea to production.</strong></p></div>

        <Signature />
        <div className="ending-description sr-only" id="identity-end" tabIndex={-1}>Deepanshu Singhal. AI Product Engineer. End of the opening.</div>

        <footer className="opening-footer">
          <p className="location"><span className="status-dot" aria-hidden="true" />Ghaziabad, India <span className="location-separator">/</span> <span>Remote & global</span></p>
          <div className="scroll-controls">
            <button className="scroll-invitation" data-scroll-invitation onClick={() => navigate(0.48)}><span className="scroll-arrow" aria-hidden="true">↓</span> Scroll to discover</button>
            <button className="replay-button" data-replay onClick={() => navigate(0)}><span aria-hidden="true">↑</span> Back to the beginning</button>
          </div>
          <div className="sequence-progress" aria-hidden="true"><span data-stage-number>01</span><span className="progress-track"><span data-progress /></span><span data-stage-name>THE OPENING</span></div>
        </footer>
        <p className="sr-only" aria-live="polite" data-announcement />
        </div>
        <StoryOverlay />
        <ProjectOverlay />
        <ExperienceOverlay />
        <ContactOverlay onReplay={() => navigate(0)} />
        <button className="cinematic-replay" onClick={() => navigate(0)}>↑ Back to the beginning</button>
        <p className="sr-only" aria-live="polite" data-cinematic-announcement />
      </div>
      <SelectedWork />
      <div className="section-navigation-cover" data-navigation-cover aria-hidden="true" />
      <p className="sr-only" role="status" data-navigation-status />
    </main>
  );
}
