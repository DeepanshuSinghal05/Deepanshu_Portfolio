/** Professional facts are taken only from the user-supplied résumé. See docs/experience-content-sources.md. */
export type Experience = {
 id:string;company:string;legalName:string;role:string;period:string;contribution:string;work:string[];image:string;caption:string;
 enter:number;read:number;hold:number;exit:number;
};
export const experiences:Experience[]=[
 {id:'colorbar',company:'Colorbar Cosmetics',legalName:'Colorbar Cosmetics Pvt. Ltd.',role:'Full-Stack & Backend Developer Intern',period:'Sep 2025 — Oct 2025',contribution:'Delivered APIs and automated audit workflows for a live loyalty ERP, from requirements to deployment.',work:['REST APIs for loyalty workflows','Twilio OTP integration','JSON / Excel audit pipelines and MySQL optimisation'],image:'colorbar-loyalty',caption:'Loyalty points · member lookup interface',enter:.34,read:.385,hold:.525,exit:.585},
 {id:'acmegrade',company:'Acmegrade',legalName:'Acmegrade Pvt. Ltd.',role:'Web Developer Intern',period:'May 2025 — Jun 2025',contribution:'Delivered a full-stack application through Agile/Scrum sprints, with real-user validation.',work:['Full-stack application delivery','Agile / Scrum development sprints','Application testing with real users'],image:'acmegrade-cart',caption:'Supplied internship work · customer cart',enter:.595,read:.64,hold:.775,exit:.835},
];
export const experienceScroll={desktop:700,mobile:600,reduced:420};
export const finaleEnd=.23;
export function experienceChapter(p:number){return p<.23?'finale':p<.34?'introduction':p<.59?'colorbar':p<.84?'acmegrade':p<.97?'resolution':'contact-handoff';}
