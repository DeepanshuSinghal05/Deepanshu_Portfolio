import { range,smooth } from '../cinematic/config';
import { projectState } from './projectConfig';
import { updateHoloFallback } from './holoFallback';
export function createProjectPresentation(root:HTMLElement,mobile:boolean,reduced:boolean){
 const el=(s:string)=>root.querySelector<HTMLElement>(s)!;
 const overlay=el('[data-project-overlay]'),poster=el('[data-project-poster]') as HTMLImageElement;let src='';
 const set=(selector:string,text:string)=>{const e=el(selector);if(e.textContent!==text)e.textContent=text;};
 const show=(e:HTMLElement,alpha:number)=>{e.style.opacity=String(alpha);e.style.visibility=alpha>.001?'visible':'hidden';e.inert=alpha<=.001;};
 return {update(p:number){const s=projectState(p),doj=p>=1&&p<1.64,holo=p>=1.64,q=s.local,intro=p<.125||p>.545&&p<.617,resolution=s.beat.id==='resolution'&&s.transition!==1||p>.937;
  root.dataset.projectProgress=p.toFixed(5);root.dataset.projectActive=String(p>0);root.dataset.activeProject=p<.08?'entry':p>2.69?'handoff':p>.967&&p<1?'handoff':s.project.id;root.dataset.projectBeat=s.beat.id;root.dataset.projectHandoff=String(p>=2.715);root.dataset.reducedMotion=String(reduced);
  show(overlay,smooth(range(p,.025,.065)));if(p>0)show(el('[data-story-overlay]'),1-smooth(range(p,.025,.06)));
  const marker=el('[data-project-marker]');show(marker,(1-smooth(range(p,.09,.125))));
  set('[data-project-title]',s.project.title);set('[data-project-descriptor]',s.project.descriptor);
  show(el('.project-title-block'),intro?smooth(range(p,.07,.10))*(p<.2?1-smooth(range(p,.115,.135)):smooth(range(p,.545,.575))):0);
  const beatAlpha=smooth(range(s.local,s.beat.from,s.beat.from+.025));
  set('[data-project-semantic]',intro?'':s.beat.title);show(el('[data-project-semantic]'),(p>.13&&p<.47||p>.617&&p<.967)?beatAlpha:0);
  const note=['tracking','sos','payment','backend','data','operations','resolution'].includes(s.beat.id)?s.beat.copy:'';
  set('[data-project-note]',note);show(el('[data-project-note]'),p>.13&&p<.47||p>.617&&p<.967?beatAlpha:0);
  overlay.dataset.composition=resolution?'resolution':intro?'intro':s.beat.id;
  root.querySelectorAll<HTMLElement>('[data-project-links]').forEach(e=>show(e,e.dataset.projectLinks===s.project.id&&s.beat.id==='resolution'&&(p<.47||p>.937&&p<.978)?1:0));
  show(el('[data-project-handoff]'),p<1?s.handoff:0);set('.project-handoff span',p<1?'DOJ Chatbot':'');set('[data-project-announcement]',p<=0?'':`${s.project.title}. ${s.beat.title}`);
  const asset=s.beat.media?s.project.media[s.beat.media]:undefined;
  // DOM images are fallback-only; WebGL owns all normal media requests.
  if(p>.07&&asset&&(reduced||root.dataset.webglReady==='false')){const next=asset.src.replace('-desktop',mobile?'-mobile':'-desktop');if(next!==src){src=next;poster.src=src;poster.alt=asset.alt;}}
  set('[data-project-fallback-copy]',s.beat.copy);
  overlay.dataset.world=holo?'holo':doj?'doj':s.project.id;
  overlay.dataset.holoState=holo?s.beat.id:'';
  if(doj){
   show(marker,(1-smooth(range(q,.095,.15)))*smooth(range(q,.02,.045)));marker.textContent='PROJECT 03';
   show(el('.project-title-block'),smooth(range(q,.035,.075))*(1-smooth(range(q,.11,.15))));
   const alpha=q>.15&&q<.977?beatAlpha:0;
   set('[data-project-semantic]',s.beat.title);show(el('[data-project-semantic]'),alpha);
   const note=s.beat.id==='model'?'Intended local pipeline · Ollama':s.beat.id==='response'?'Interface demonstration · Not verified against the current corpus.':s.beat.id==='embedding'?'FastAPI · Query embedding':s.beat.id==='question'?'Text or browser speech-to-text.':s.beat.id==='documents'?'Custom PDF dataset · Judges’ service rules':s.beat.id==='retrieval'?'FAISS · Relevant context':s.beat.id==='resolution'?'Local knowledge. Retrieved context.':'';
   set('[data-project-note]',note);show(el('[data-project-note]'),alpha);
   overlay.dataset.composition=s.beat.id;overlay.style.setProperty('--doj-retrieval',String(smooth(range(q,.485,.565))));overlay.style.setProperty('--doj-context',String(smooth(range(q,.575,.66))));
   }else if(holo){
   marker.textContent='PROJECT 04';show(marker,1-smooth(range(q,.08,.12)));
   show(el('.project-title-block'),smooth(range(q,.01,.035))*(1-smooth(range(q,.065,.10))));
   const alpha=q>.045&&q<.964?beatAlpha:0;
   set('[data-project-semantic]',s.beat.title);show(el('[data-project-semantic]'),alpha);
   const note=s.beat.id==='technical'?'Camera → MediaPipe → landmarks → gesture → response':s.beat.id==='resolution'?'Gesture → intent → response.':s.beat.id==='detection'?'21 landmarks · Tracked locally':s.beat.id==='summary'?'TL;DR · Silent demonstration':s.beat.id==='separation'?'Apollo-inspired procedural study':s.beat.id==='normal'?'NOTES / BUILDS / JARVIS / 3D OBJECTS / SHELF':'';
   set('[data-project-note]',note);show(el('[data-project-note]'),alpha);
   overlay.dataset.composition=s.beat.id;overlay.style.setProperty('--holo-gold',String(smooth(range(q,.812,.845))));if(reduced||root.dataset.webglReady==='false')updateHoloFallback(root,q);
   const hands=root.querySelectorAll<SVGGElement>('[data-holo-hand]');const pinch=s.beat.id==='pinch'||s.beat.id==='drag';hands.forEach((e,i)=>{e.style.opacity=q<.03||q>.964||i===1&&!(q>.39&&q<.817)?'0':'1';e.style.transform=pinch?'translateX(12px)':'none';});
  }else marker.textContent='SELECTED WORK';
  if(import.meta.env.DEV&&new URLSearchParams(location.search).has('debug'))root.dataset.projectDebug=JSON.stringify({progress:p,project:s.project.id,beat:s.beat.id,reducedMotion:reduced});
 },dispose(){poster.removeAttribute('src');}};
}
