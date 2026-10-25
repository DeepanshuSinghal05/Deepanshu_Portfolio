import {smooth,range} from '../cinematic/config';
export function createContactPresentation(root:HTMLElement,reduced:boolean){
 const overlay=root.querySelector<HTMLElement>('[data-contact-overlay]')!;
 const show=(el:HTMLElement,alpha:number,travel=0)=>{el.style.opacity=String(alpha);el.style.visibility=alpha>.001?'visible':'hidden';el.inert=alpha<.95;el.setAttribute('aria-hidden',String(alpha<=.001));el.style.transform=`translateY(${reduced?0:(1-alpha)*travel}px)`;};
 return {update(p:number){
  const active=p>.001;root.dataset.contactActive=String(active);root.dataset.contactProgress=p.toFixed(5);root.dataset.contactSettled=String(p>=.78);
  show(overlay,active?1:0);show(overlay.querySelector('[data-contact-copy]')!,smooth(range(p,.28,.46)),14);show(overlay.querySelector('[data-contact-actions]')!,smooth(range(p,.44,.61)),8);show(overlay.querySelector('[data-contact-footer]')!,smooth(range(p,.62,.77)),0);
  if(active){const previous=root.querySelector<HTMLElement>('[data-experience-overlay]')!;previous.inert=true;previous.style.opacity=String(1-smooth(range(p,0,.1)));}
  overlay.style.setProperty('--contact-open',String(smooth(range(p,.08,.58))));
  const announcement=overlay.querySelector('[data-contact-announcement]')!;const text=p>=.61?'Deepanshu Singhal. Let’s build what’s next. Email, LinkedIn, GitHub, and résumé links are available.':'';if(announcement.textContent!==text)announcement.textContent=text;
 }};
}
