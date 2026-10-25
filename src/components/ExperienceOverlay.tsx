import {experiences} from '../experience/experienceContent';
import {ExperienceMarker} from './ExperienceMarker';
export function ExperienceOverlay(){return <>
 <section className="experience-overlay" data-experience-overlay aria-label="Professional experience">
  <div className="experience-fallback" aria-hidden="true"><div className="career-fallback"><b/><b/><b/><span>{experiences[0].period.match(/\d{4}/)?.[0]}</span></div><i/><i/><i/><svg viewBox="0 0 100 220"><ellipse cx="50" cy="211" rx="30" ry="4"/><circle cx="50" cy="29" r="17"/><path d="M30 56h40l-5 77H35zM33 143h13v65H31zM54 143h13l2 65H54zM18 62h10l-5 72H13zM72 62h10l5 72H77z"/></svg></div>
  <div className="experience-statement" data-experience-finale><h2>Built through<br/><em>experience.</em></h2></div>
  <div className="experience-intro" data-experience-intro><p className="experience-index">EXPERIENCE</p><h2>Building beyond<br/>the classroom.</h2></div>
  {experiences.map((entry,index)=><ExperienceMarker entry={entry} index={index} key={entry.id}/>)}
  <div className="experience-statement experience-ending" data-experience-ending><h2>Still building.</h2></div>
  <p className="sr-only" aria-live="polite" data-experience-announcement />
 </section>
 <section className="sr-only" aria-label="Professional experience transcript"><h2>Built through experience.</h2>{experiences.map(e=><section key={e.id}><h3>{e.legalName}</h3><p>{e.role}. {e.period}.</p><p>{e.contribution}</p></section>)}<p>Still building.</p></section>
 </>;}
