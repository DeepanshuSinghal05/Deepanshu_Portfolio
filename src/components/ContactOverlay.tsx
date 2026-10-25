import {contactContent as content} from '../contact/contactContent';
import signature from '../assets/identity/ds-signature.svg?url';
export function ContactOverlay({onReplay}:{onReplay:()=>void}){return <section className="contact-overlay" data-contact-overlay aria-label="Contact Deepanshu Singhal">
 <div className="contact-fallback" aria-hidden="true"><svg viewBox="0 0 100 220"><ellipse cx="50" cy="211" rx="30" ry="4"/><circle cx="50" cy="29" r="17"/><path d="M30 56h40l-5 77H35zM33 143h13v65H31zM54 143h13l2 65H54zM18 62h10l-5 72H13zM72 62h10l5 72H77z"/></svg></div>
 <div className="contact-composition">
  <div data-contact-copy><p className="contact-eyebrow">{content.name} <span>/ {content.role}</span></p><h2>Let’s build<br/>what’s next.</h2><p className="contact-support">{content.supporting}</p></div>
  <nav className="contact-actions" data-contact-actions aria-label="Contact and professional profiles">
   <a className="contact-primary" href={`mailto:${content.email}`} aria-label={`Email Deepanshu Singhal at ${content.email}`}>Start a conversation <span aria-hidden="true">↗</span></a>
   <div className="contact-secondary">{content.links.map(link=><a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`${link.label} profile (opens a new tab)`}>{link.label}<span aria-hidden="true">↗</span></a>)}<a href={content.resume.href} download={content.resume.filename} aria-label="Download Deepanshu Singhal’s résumé (Word document)">Résumé <span className="resume-format">DOCX</span><span aria-hidden="true">↓</span></a></div>
  </nav>
 </div>
 <footer className="contact-footer" data-contact-footer><div className="contact-signoff"><img src={signature} alt="" aria-hidden="true"/><p>Designed & built by<br/><strong>Deepanshu Singhal</strong></p></div><button onClick={onReplay}>Revisit the journey <span aria-hidden="true">↑</span></button></footer>
 <p className="sr-only" aria-live="polite" data-contact-announcement />
 </section>;}
