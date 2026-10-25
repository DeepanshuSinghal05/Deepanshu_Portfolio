import { range, smooth } from '../cinematic/config';
export type MediaAsset={src:string;aspect:number;alt:string};
export type ProjectBeat={id:string;from:number;title:string;copy:string;media?:string};
export type ProjectDefinition={id:string;title:string;descriptor:string;accent:string;start:number;end:number;beats:ProjectBeat[];media:Record<string,MediaAsset>;links:{label:string;url:string}[]};
// Existing Project Worlds retain their original absolute scroll allocation. DOJ occupies 1–1.64. Holo appends 1.64–2.72.
export const projectExtent=2.72;
export const projectScroll={desktop:2200,mobile:1800,reduced:1200};
const asset=(world:string,name:string,aspect:number,alt:string):MediaAsset=>({src:`/worlds/${world}/${name}-desktop.webp`,aspect,alt});
export const projects:ProjectDefinition[]=[{
 id:'yatralok',title:'YatraLok',descriptor:'Tourist Safety Platform',accent:'#9bcad1',start:.08,end:.47,
 media:{identity:asset('yatralok','identity',530/475,'Digital tourist identity with personal values masked.'),trip:asset('yatralok','trip',1475/350,'Actual trip workspace.'),tracking:asset('yatralok','route-concept',1063/386,'Supplied route concept used for the environmental expansion; browser tracking itself is evidenced by the original recording.'),sos:asset('yatralok','sos',1,'Actual SOS control. The visual response network is conceptual; the application button changes local UI state.')},
 beats:[{id:'intro',from:0,title:'YatraLok',copy:'Tourist Safety Platform',media:'identity'},
 {id:'identity',from:.10,title:'Digital identity',copy:'A digital travel identity. Personal values masked.',media:'identity'},
 {id:'journey',from:.25,title:'A journey, connected.',copy:'Identity gives a trip its context.',media:'trip'},
 {id:'tracking',from:.38,title:'Live tracking',copy:'Recorded tracking opens into a supplied route concept. The extended safety route is conceptual.',media:'tracking'},
 {id:'sos',from:.67,title:'One action. A wider connection.',copy:'Response flow is conceptual. No alert is dispatched.',media:'sos'},
 {id:'resolution',from:.86,title:'Identity → location → safety',copy:'React · Express · MySQL · Google Maps · Twilio OTP · Ethereum digital ID',media:'tracking'}],
 links:[{label:'View repository',url:'https://github.com/DeepanshuSinghal05/Yatralok'}]
},{
 id:'prisha-enterprises',title:'Prisha Enterprises',descriptor:'Full-Stack Commerce Platform',accent:'#cfbea0',start:.56,end:.95,
 media:{storefront:asset('prisha','storefront',1908/765,'Prisha Enterprises real storefront.'),catalogue:asset('prisha','catalogue',1535/541,'Real product catalogue; the selected 43-inch television separates into depth.'),checkout:asset('prisha','checkout',735/332,'Actual order summary, delivery and total; personal details excluded.'),payment:asset('prisha','payment',735/119,'Actual Razorpay payment action. Verification flow is based on server source, not a completed payment recording.'),portal:asset('prisha','portal',560/600,'Real Admin Portal with login values masked.'),admin:asset('prisha','distribution',747/430,'Actual order status distribution. Dashboard values are demo UI, not business achievements.')},
 beats:[{id:'storefront',from:0,title:'Prisha Enterprises',copy:'Full-Stack Commerce Platform',media:'storefront'},
 {id:'catalogue',from:.13,title:'From discovery to a decision.',copy:'One product leaves the catalogue.',media:'catalogue'},
 {id:'cart',from:.26,title:'Cart',copy:'The same product continues into the order.',media:'catalogue'},
 {id:'checkout',from:.34,title:'Checkout',copy:'Products. Delivery. Payment.',media:'checkout'},
 {id:'payment',from:.46,title:'Payment verification',copy:'Server-side signature verification. A conceptual transaction, not a recorded payment.',media:'payment'},
 {id:'backend',from:.53,title:'Behind the storefront.',copy:'One transaction continues through the Express API into order, payment and stock logic.',media:'payment'},
 {id:'data',from:.66,title:'The order becomes data.',copy:'Sequelize and MySQL connect the transaction to operations.',media:'portal'},
 {id:'operations',from:.71,title:'Order operations',copy:'Real administration UI. Values shown are demo data.',media:'admin'},
 {id:'resolution',from:.93,title:'From storefront to operations.',copy:'React · Express · Sequelize · MySQL · Razorpay',media:'admin'}],
 links:[{label:'Visit live project',url:'https://prishaent.in'},{label:'View source',url:'https://github.com/DeepanshuSinghal05/Prisha_Enterprises'}]
}];
projects.push({
 id:'doj-chatbot',title:'Department of Justice',descriptor:'Virtual Assistant',accent:'#c6deed',start:1,end:1.64,
 media:{home:asset('doj','homepage',1917/981,'Supplied DOJ project homepage; this is a student project, not a government deployment claim.'),chat:asset('doj','chat_interface',1917/978,'Supplied empty chat interface with text and browser speech input.'),response:asset('doj','response',1756/896,'Supplied consumer-complaint conversation demonstration. Its exact content is not verified against the documented judges service-rules corpus.')},
 beats:[
 {id:'entry',from:0,title:'Department of Justice',copy:'Virtual Assistant · Smart India Hackathon project',media:'home'},
 {id:'homepage',from:.10,title:'A front door to knowledge.',copy:'A browser interface for the assistant.',media:'home'},
 {id:'question',from:.205,title:'A question begins here.',copy:'Text or browser speech-to-text.',media:'chat'},
 {id:'embedding',from:.31,title:'A question becomes a signature.',copy:'FastAPI · Query embedding. An editorial abstraction of the documented architecture.',media:'chat'},
 {id:'documents',from:.41,title:'A controlled knowledge source.',copy:'Custom PDF corpus: judges’ salaries and conditions of service. Documents become indexed chunks.',media:'chat'},
 {id:'retrieval',from:.485,title:'Find what matters.',copy:'FAISS retrieval selects relevant context from the custom dataset.',media:'chat'},
 {id:'context',from:.575,title:'Relevant context. Only.',copy:'The selected context joins the question.',media:'chat'},
 {id:'model',from:.665,title:'Local model. Controlled data.',copy:'Ollama · Documented intended architecture; the checked-in code retains the earlier cloud prototype.',media:'chat'},
 {id:'return',from:.755,title:'The answer returns.',copy:'Question and context form an organized response.',media:'chat'},
 {id:'response',from:.84,title:'Back to the person asking.',copy:'Interface demonstration. This conversation is not verified against the current corpus.',media:'response'},
 {id:'resolution',from:.92,title:'From question to grounded answer.',copy:'Custom dataset · FAISS retrieval · Intended local Ollama generation',media:'response'}],links:[]
});
projects.push({
 id:'holo-gesture',title:'Holo Gesture',descriptor:'Hands become the interface.',accent:'#82cdb7',start:1.64,end:projectExtent,
 media:{normal:asset('holo','normal_mode',1917/976,'Supplied Holo Normal Mode: floating notes and folders, shelf and 3D props. Camera blocked is the recorded screenshot state.'),jarvis:asset('holo','jarvis_golden_mode',1917/976,'Supplied JARVIS Mode: gold system accents coexist with teal content orbs.')},
 beats:[
 {id:'sensor',from:0,title:'Hands become the interface.',copy:'Camera → local hand tracking. Scroll-driven demonstration; no camera access.'},
 {id:'detection',from:.045,title:'Hand detected.',copy:'21 landmarks describe the hand. A visual explanation of MediaPipe input.'},
 {id:'normal',from:.105,title:'Holo. Hands on.',copy:'The real interface: notes, builds, JARVIS, 3D objects and shelf.',media:'normal'},
 {id:'depth',from:.185,title:'Beyond the screen.',copy:'One interface orb becomes a spatial object.'},
 {id:'pinch',from:.232,title:'Pinch.',copy:'Thumb and index close. The orb responds.'},
 {id:'drag',from:.275,title:'Move your hand. Move the object.',copy:'A small following lag makes the held object tangible.'},
 {id:'throw',from:.327,title:'Release. Momentum.',copy:'Release preserves motion before the orb settles.'},
 {id:'two-hands',from:.39,title:'Two hands. One object.',copy:'Both hands attach to the Apollo-inspired prop.'},
 {id:'stretch',from:.423,title:'Stretch.',copy:'Hand separation controls object scale.'},
 {id:'separation',from:.467,title:'Open the structure.',copy:'A controlled exploded view. Procedural Apollo-inspired study, not the original scan.'},
 {id:'recombine',from:.53,title:'Bring it back together.',copy:'Shrink the object. Its components return.'},
 {id:'note',from:.577,title:'Information has a place.',copy:'Pinch, move and release a spatial note.'},
 {id:'reader',from:.635,title:'Stretch to read.',copy:'A note opens into a reader. Generic structure; no invented article.'},
 {id:'summary',from:.685,title:'Crush to a summary.',copy:'The source supports a spoken TL;DR. This portfolio shows a silent voice indicator.'},
 {id:'scene',from:.735,title:'The space responds.',copy:'Two pinches in empty space zoom and rotate the environment.'},
 {id:'reset',from:.777,title:'Peace. Reset.',copy:'The peace gesture restores objects smoothly.'},
 {id:'jarvis',from:.817,title:'JARVIS.',copy:'The same system. A warmer mode.',media:'jarvis'},
 {id:'technical',from:.89,title:'Tracked locally.',copy:'Camera → MediaPipe → landmarks → gesture → object response. Self-hosted tracking with a CDN asset fallback in the original source.'},
 {id:'resolution',from:.922,title:'Hands become the interface.',copy:'Gesture → intent → response.'},
 {id:'settle',from:.964,title:'',copy:'The hands fade. The objects settle. The path remains open.'}
 ],links:[]
});
export const futureProjects=[] as const;
export const projectWorlds=[...projects.map(p=>({...p,status:'implemented'})),...futureProjects];
export function projectState(p:number){
 const index=p>=1.64?3:p>=1?2:p>=.56?1:0,project=projects[index],local=range(p,project.start,project.end);
 let beatIndex=0;project.beats.forEach((b,i)=>{if(local>=b.from)beatIndex=i;});
 return {p,index,project,local,beat:project.beats[beatIndex],beatIndex,transition:range(p,.47,.56),entry:smooth(range(p,.025,.08)),handoff:p<1?smooth(range(p,.967,1)):smooth(range(p,2.69,projectExtent)),active:p>.025};
}
