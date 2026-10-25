import { storyChapters, storyIntroduction as intro, storyHandoff } from '../story/storyContent';
import '../styles/story.css';
export function StoryOverlay(){
  return <>
    <div className="story-overlay" data-story-overlay aria-hidden="true">
      <div className="story-location"><span>DEEPANSHU SINGHAL</span><span>03 / THE JOURNEY</span></div>
      <div className="story-introduction" data-story-introduction>
        <p className="story-greeting" data-intro-greeting>{intro.greeting}</p>
        <h2 className="story-name" data-intro-name>{intro.name}</h2>
        <p className="story-intro-copy" data-intro-copy>{intro.copy}</p>
        <p className="story-role" data-intro-role>{intro.role}</p>
      </div>
      {storyChapters.map(chapter=><section key={chapter.id} className={`story-chapter story-copy-${chapter.side}`} data-story-chapter={chapter.id}>
        <p className="story-eyebrow">{chapter.eyebrow}</p>
        <h2>{chapter.title}</h2>
        <p className="story-copy">{chapter.copy}</p>
        <p className="story-detail">{chapter.detail}</p>
      </section>)}
      <div className="story-handoff" data-story-handoff><p className="story-eyebrow">{storyHandoff.eyebrow}</p><h2>{storyHandoff.title}</h2></div>
      <p className="story-scroll-cue" data-story-scroll-cue>SCROLL TO FOLLOW <span>↓</span></p>
    </div>
    <section className="sr-only" aria-label="Deepanshu's story">
      <h2>{intro.greeting} {intro.name}</h2><p>{intro.role}. {intro.copy}</p>
      {storyChapters.map(chapter=><section key={chapter.id}><h3>{chapter.eyebrow}</h3><p>{chapter.title} {chapter.copy} {chapter.detail}.</p></section>)}
    </section>
    <p className="sr-only" aria-live="polite" data-story-announcement />
    <div className="story-fallback" data-story-fallback aria-hidden="true">
      <svg viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice">
        <path d="M0 480H1000V700H0Z" fill="#20272b"/>
        <path data-story-fallback-line d="M660 575 570 525 470 510 350 460 470 405 680 395 740 345" fill="none" stroke="#b5a080" strokeWidth="1.5" pathLength="1"/>
        <g data-story-fallback-structure fill="none" stroke="#77847f" strokeOpacity=".35"><path d="M340 475V390H430M470 450V360H600V430M590 480V405H680V345H760M380 490 560 425 720 470"/></g>
        <g data-story-fallback-avatar fill="#b9b4aa" transform="translate(710 460)">
          <circle cy="-96" r="16"/><rect x="-22" y="-77" width="44" height="66" rx="20"/><rect x="-36" y="-70" width="12" height="64" rx="6"/><rect x="24" y="-70" width="12" height="64" rx="6"/><rect x="-19" y="-12" width="15" height="66" rx="7"/><rect x="4" y="-12" width="15" height="66" rx="7"/>
        </g>
      </svg>
    </div>
  </>;
}
