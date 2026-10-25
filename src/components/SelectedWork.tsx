import {useEffect,useRef,useState,type CSSProperties,type KeyboardEvent} from 'react';
import {workProjects,type WorkImage,type WorkProject} from '../work/workContent';
const hashProject=()=>workProjects.find(p=>`#project-${p.id}`===location.hash)?.id;
function Evidence({image,primary=false}:{image:WorkImage;primary?:boolean}){return <figure className={primary?'work-image work-image-primary':'work-image'}><img src={`${image.src}-desktop.webp`} srcSet={`${image.src}-mobile.webp 640w, ${image.src}-desktop.webp 1200w`} sizes="(max-width:700px) 90vw, 60vw" loading="lazy" decoding="async" width="1200" height="720" alt={image.alt}/><figcaption>{image.caption}</figcaption></figure>;}
export function ProjectDetail({project,index}:{project:WorkProject;index:number}){return <article className="work-detail" role="tabpanel" id="work-detail" aria-labelledby={`tab-${project.id}`} tabIndex={0} key={project.id}>
 <header><p className="work-kicker">0{index+1} / {project.type}</p><h3>{project.name}</h3><p className="work-lede">{project.lede}</p></header>
 <Evidence image={project.images[0]} primary/>
 <section className="work-prose"><h4>Overview</h4><p>{project.overview}</p></section>
 <section className="work-prose"><h4>What it does</h4><ul>{project.features.map(f=><li key={f}>{f}</li>)}</ul></section>
 <section className="work-prose work-tech"><h4>Technology</h4><p>{project.technology.map(t=><span key={t}>{t}</span>)}</p></section>
 <section className="work-prose"><h4>Under the surface</h4><ol className="work-flow">{project.architecture.map(a=><li key={a}>{a}</li>)}</ol><p>{project.technical}</p></section>
 <section className="work-prose"><h4>The interesting problem</h4><p>{project.challenge}</p></section>
 {project.note&&<aside className="work-note">{project.note}</aside>}
 {project.links.length>0&&<nav className="work-links" aria-label={`${project.name} links`}>{project.links.map(l=><a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">{l.label} <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>)}</nav>}
 <div className="work-supporting">{project.images.slice(1).map(i=><Evidence key={i.src} image={i}/>)}</div>
 </article>;}
export function SelectedWork(){
 const [horizontal,setHorizontal]=useState(()=>innerWidth<=700);
 const [selected,setSelected]=useState(()=>hashProject()??'yatralok');const buttons=useRef<(HTMLButtonElement|null)[]>([]);const section=useRef<HTMLElement>(null);
 const index=workProjects.findIndex(p=>p.id===selected),project=workProjects[index];
 useEffect(()=>{const change=()=>{const id=hashProject();if(id)setSelected(id);};const mq=matchMedia('(max-width:700px)'),orient=()=>setHorizontal(mq.matches);mq.addEventListener('change',orient);window.addEventListener('hashchange',change);return()=>{mq.removeEventListener('change',orient);window.removeEventListener('hashchange',change);};},[]);
 const choose=(i:number)=>{setSelected(workProjects[i].id);history.replaceState(null,'',`${location.pathname}${location.search}#project-${workProjects[i].id}`);const top=section.current!.getBoundingClientRect().top+scrollY;if(scrollY>top+220)window.dispatchEvent(new CustomEvent('portfolio:navigate',{detail:{section:'work',offset:220}}));};
 const key=(e:KeyboardEvent,i:number)=>{const horizontal=innerWidth<=700;let next=i;if(e.key===(horizontal?'ArrowRight':'ArrowDown'))next=(i+1)%4;else if(e.key===(horizontal?'ArrowLeft':'ArrowUp'))next=(i+3)%4;else if(e.key==='Home')next=0;else if(e.key==='End')next=3;else return;e.preventDefault();buttons.current[next]?.focus({preventScroll:true});if(horizontal)buttons.current[next]?.scrollIntoView({block:'nearest',inline:'nearest'});choose(next);};
 return <section id="selected-work" className="selected-work" data-selected-work ref={section} style={{'--work-accent':project.accent} as CSSProperties} aria-labelledby="work-title">
  <header className="work-heading"><p className="work-kicker">A CLOSER LOOK / 04 PROJECTS</p><h2 id="work-title" tabIndex={-1}>Selected <em>work.</em></h2><p>The systems behind the experience.</p></header>
  <div className="work-layout"><aside className="work-index"><p className="work-kicker">EXPLORE THE WORK</p><div role="tablist" aria-orientation={horizontal?'horizontal':'vertical'} aria-label="Select a project" className="work-tabs">{workProjects.map((p,i)=><button key={p.id} ref={el=>{buttons.current[i]=el;}} role="tab" id={`tab-${p.id}`} aria-controls="work-detail" aria-selected={selected===p.id} tabIndex={selected===p.id?0:-1} onClick={()=>choose(i)} onKeyDown={e=>key(e,i)}><span className="work-number">0{i+1}</span><span><strong>{p.name}</strong><small>{p.type}</small></span><span className="work-index-arrow" aria-hidden="true">↗</span></button>)}</div><p className="work-index-note">Four different problems.<br/>One curiosity for building.</p></aside><ProjectDetail project={project} index={index}/></div>
  <footer className="work-end"><span>Behind every system, a person.</span><a href="#contact" onClick={e=>{e.preventDefault();window.dispatchEvent(new CustomEvent('portfolio:navigate',{detail:{section:'contact'}}));}}>Let’s build what’s next <span aria-hidden="true">↓</span></a></footer>
 </section>;
}
