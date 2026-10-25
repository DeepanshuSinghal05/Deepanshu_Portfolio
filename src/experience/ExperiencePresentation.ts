import {experiences,experienceChapter} from './experienceContent';
import {range,smooth} from '../cinematic/config';
const ramp=(p:number,a:number,b:number)=>smooth(range(p,a,b));
export function createExperiencePresentation(root:HTMLElement,reduced:boolean){
 const overlay=root.querySelector<HTMLElement>('[data-experience-overlay]')!,select=(s:string)=>overlay.querySelector<HTMLElement>(s)!;
 const show=(el:HTMLElement,alpha:number,travel=0)=>{el.style.opacity=String(alpha);el.style.visibility=alpha>.001?'visible':'hidden';el.inert=alpha<=.001;el.setAttribute('aria-hidden',String(alpha<=.001));el.style.transform=`translateY(${reduced?0:travel}px)`;};
 return {update(p:number){
  const warm=ramp(p,.15,.29),active=p>0,chapter=experienceChapter(p);root.dataset.experienceActive=String(active);root.dataset.experienceProgress=p.toFixed(5);root.dataset.experiencePhase=chapter;root.dataset.contactReady=String(p>=.997);
  overlay.style.setProperty('--experience-warmth',String(warm));show(overlay,active?1:0);
  if(active){const project=root.querySelector<HTMLElement>('[data-project-overlay]')!;project.style.opacity='0';project.style.visibility='hidden';project.inert=true;root.dataset.projectHandoff='false';}
  const finale=ramp(p,.10,.14)*(1-ramp(p,.17,.215));show(select('[data-experience-finale]'),finale,(1-finale)*12);
  const intro=ramp(p,.245,.275)*(1-ramp(p,.31,.355));show(select('[data-experience-intro]'),intro,(1-intro)*12);
  let visibleMarker='';experiences.forEach(e=>{const enter=ramp(p,e.enter,e.read),exit=ramp(p,e.hold,e.exit),alpha=enter*(1-exit);show(select(`[data-experience-marker="${e.id}"]`),alpha,(1-enter)*20-exit*24);if(alpha>.5)visibleMarker=e.id;});
  overlay.dataset.marker=visibleMarker;
  const ending=ramp(p,.85,.90)*(1-ramp(p,.96,.99));show(select('[data-experience-ending]'),ending,(1-ending)*10);
  const fallback=select('.experience-fallback');fallback.style.backgroundColor=`color-mix(in srgb, #e9e4da ${warm*100}%, #080e10)`;fallback.style.setProperty('--career-progress',String(ramp(p,.245,.4)));fallback.style.setProperty('--experience-settle',String(ramp(p,.86,.98)));
  const announcement=select('[data-experience-announcement]'),entry=experiences.find(e=>e.id===visibleMarker);const text=!active?'':entry?`${entry.company}. ${entry.role}. ${entry.period}.`:chapter==='finale'?'Built through experience.':chapter==='introduction'?'Experience. Building beyond the classroom.':chapter==='resolution'?'Still building.':'';if(announcement.textContent!==text)announcement.textContent=text;
 }};
}
