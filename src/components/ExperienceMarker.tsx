import type {Experience} from '../experience/experienceContent';
export function ExperienceMarker({entry,index}:{entry:Experience;index:number}){return <article className="experience-marker" data-experience-marker={entry.id} aria-label={`${entry.legalName}, ${entry.role}`}>
 <div className="experience-text"><p className="experience-index">0{index+1} / PROFESSIONAL EXPERIENCE</p>
 <h3>{entry.company}</h3>
 <p className="experience-role">{entry.role}</p>
 <p className="experience-period">{entry.period}</p>
 <p className="experience-contribution">{entry.contribution}</p>
 <div className="experience-work"><h4>What I worked on</h4><ul>{entry.work.map(item=><li key={item}>{item}</li>)}</ul></div></div>
 <div className="experience-evidence"><figure><img loading="lazy" decoding="async" src={`/experience/${entry.image}-desktop.webp`} srcSet={`/experience/${entry.image}-mobile.webp 640w, /experience/${entry.image}-desktop.webp 1200w`} sizes="(max-width:700px) 90vw, 43vw" width="1200" height={entry.id==='colorbar'?713:320} alt={entry.id==='colorbar'?'Colorbar loyalty points screen with a member mobile-number lookup and search action':'Acmegrade internship cart screen with product rows, total and Place Order action'}/><figcaption>{entry.caption}</figcaption></figure>{entry.id==='acmegrade'&&<figure className="experience-secondary"><img loading="lazy" decoding="async" src="/experience/acmegrade-product-mobile.webp" width="640" height="328" alt="Internship product-entry form for name, price, description and image"/><figcaption>Vendor product entry</figcaption></figure>}</div>
 </article>;}
