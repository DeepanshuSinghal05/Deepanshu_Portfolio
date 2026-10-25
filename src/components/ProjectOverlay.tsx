import { projects } from '../projects/projectConfig';
export function ProjectOverlay(){return <>
 <section className="project-overlay" data-project-overlay aria-label="Selected project worlds">
  <p className="project-marker" data-project-marker>SELECTED WORK</p>
  <div className="project-title-block"><h2 data-project-title /><p data-project-descriptor /></div>
  <p className="project-semantic" data-project-semantic />
  <p className="project-note" data-project-note />
  <svg className="holo-fallback" viewBox="0 0 600 340" role="img" aria-label="Local hand landmarks pinch an orb, stretch a spatial prop, manipulate notes and reset in JARVIS mode">
   <rect className="holo-sensor-fallback" x="65" y="20" width="470" height="265" rx="4" />
   {[0,1].map(i=><g key={i} data-holo-hand={i}><path data-holo-skeleton /><g data-holo-joints>{Array.from({length:21},(_,j)=><circle key={j} r="2.2" />)}</g></g>)}
   <g className="holo-fallback-orb"><circle cx="305" cy="140" r="28"/><circle cx="305" cy="140" r="31"/></g>
   <g className="holo-fallback-prop"><path d="M265 173l22-69h26l22 69z"/><path d="M267 181h66M287 97h26"/><path d="M284 170l10-63m22 63-10-63"/></g>
   <g className="holo-fallback-note"><rect x="247" y="90" width="106" height="123" rx="2"/><path d="M263 111h47m-47 20h74m-74 14h74m-74 14h56m-56 14h74m-74 14h40"/><text x="300" y="239" textAnchor="middle" data-holo-note-label>NOTE</text></g>
   <text x="300" y="324" textAnchor="middle">HAND → GESTURE → OBJECT RESPONSE</text>
  </svg>
  <svg className="doj-knowledge-fallback" viewBox="0 0 600 340" role="img" aria-label="Question signature selects three relevant document chunks, which converge into the local model and response">
   <g className="doj-fallback-documents">{Array.from({length:12},(_,i)=><rect key={i} className={[1,5,9].includes(i)?'selected-context':''} x={70+(i%3)*150} y={45+Math.floor(i/3)*53} width="118" height="32" rx="2" />)}</g>
   <g className="doj-fallback-query"><path d="M265 268h70m-62 10h54m-46 10h38" /></g>
   <text x="300" y="326" textAnchor="middle">QUESTION → RELEVANT CONTEXT → RESPONSE</text>
  </svg>
  <figure className="project-media-fallback"><img data-project-poster alt="" decoding="async"/><figcaption data-project-fallback-copy /></figure>
  <nav className="project-links" aria-label="Project links">{projects.map(project=><div key={project.id} data-project-links={project.id}>{project.links.map(link=><a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">{link.label}<span aria-hidden="true">↗</span></a>)}</div>)}</nav>
  <div className="project-handoff" data-project-handoff><p>The path continues</p><span>DOJ Chatbot</span></div>
  <p className="sr-only" data-project-announcement aria-live="polite" />
 </section>
 <section className="sr-only" aria-label="Project story transcript">{projects.map(project=><section key={project.id}><h2>{project.title}</h2><p>{project.descriptor}</p>{project.beats.map(beat=><section key={beat.id}><h3>{beat.title}</h3><p>{beat.copy}</p>{beat.media&&<p>{project.media[beat.media].alt}</p>}</section>)}</section>)}</section>
 </>;}
