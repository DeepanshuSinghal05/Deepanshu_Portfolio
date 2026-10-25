import {range,smooth,mix} from '../cinematic/config';
const links=[[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[0,17],[17,18],[18,19],[19,20]];
const open=[[0,70],[-17,56],[-34,35],[-46,14],[-53,-9],[-22,15],[-27,-19],[-29,-43],[-29,-66],[0,9],[0,-29],[0,-54],[0,-78],[20,14],[24,-22],[27,-44],[27,-66],[37,24],[45,-2],[51,-22],[54,-41]];
export function updateHoloFallback(root:HTMLElement,q:number){
 const ramp=(a:number,b:number)=>smooth(range(q,a,b)),pinch=(ramp(.235,.262)*(1-ramp(.331,.347))+ramp(.407,.423)*(1-ramp(.775,.787))),stretch=ramp(.423,.465)*(1-ramp(.53,.565)),gold=ramp(.812,.845);
 root.querySelectorAll<SVGGElement>('[data-holo-hand]').forEach((g,i)=>{const pts=open.map(([x,y])=>[x,y]);pts[4]=[mix(pts[4][0],-27,pinch),mix(pts[4][1],-37,pinch)];pts[8]=[mix(pts[8][0],-26,pinch),mix(pts[8][1],-38,pinch)];
  if(q>.777&&q<.817)for(const n of [14,15,16,18,19,20])pts[n][1]=15+(n%4)*4;
  const moved=pts.map(([x,y])=>[i?408-x+stretch*24:195+x-stretch*24,165+y]);
  g.querySelector('path')!.setAttribute('d',links.map(([a,b])=>`M${moved[a]}L${moved[b]}`).join(' '));g.querySelectorAll('circle').forEach((c,j)=>{c.setAttribute('cx',String(moved[j][0]));c.setAttribute('cy',String(moved[j][1]));c.style.opacity=String(Math.max(0,Math.min(1,ramp(.025,.075)*23-j)));});
 });
 const svg=root.querySelector<SVGElement>('.holo-fallback')!;svg.style.color=gold>.5?'#d7ae65':'#8ed6bf';
 const prop=svg.querySelector<SVGElement>('.holo-fallback-prop')!;prop.style.transform=`translate(${stretch*-36}px,${stretch*-18}px) scale(${1+stretch*.12})`;
 const note=svg.querySelector<SVGElement>('.holo-fallback-note')!,reader=ramp(.637,.665),crush=ramp(.686,.713)*(1-ramp(.785,.815));note.style.transform=`translateY(${crush*50}px) scale(${mix(1,1.1,reader)*(1-crush*.48)})`;note.style.transformOrigin='300px 150px';
 svg.querySelector('[data-holo-note-label]')!.textContent=crush>.5?'TL;DR':reader>.5?'READER':'NOTE';
}
