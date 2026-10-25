import { Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, RingGeometry, SphereGeometry, TubeGeometry, CatmullRomCurve3, Vector3, BufferGeometry, LineSegments, LineBasicMaterial, Float32BufferAttribute, PointLight, Color, BoxGeometry, PlaneGeometry, CanvasTexture, SRGBColorSpace } from 'three';
import { createAssetSurface, featherSurface, type AssetCache, type AssetSurface } from './ProjectAssetSurface';
import { smooth,range,mix } from '../cinematic/config';
export type Point=(a:number[])=>Vector3;
export const YATRA_ASSETS=['identity','identity-title','trip','map','route-concept','tracking-title','sos','contacts'].map(n=>'yatralok/'+n);
export const PRISHA_ASSETS=['storefront','catalogue','product','product-detail','checkout','payment','portal','orders','revenue','distribution','products'].map(n=>'prisha/'+n);
const ramp=(p:number,a:number,b:number)=>smooth(range(p,a,b));
export function makePath(points:Vector3[],color:string,radius=.026){
 const curve=new CatmullRomCurve3(points,false,'centripetal');
 const material=new MeshBasicMaterial({color,transparent:true,opacity:.8});
 const mesh=new Mesh(new TubeGeometry(curve,100,radius,5,false),material);
 return {mesh,curve,material,reveal(p:number){mesh.visible=p>0;mesh.geometry.setDrawRange(0,Math.floor(p*100)*30);}};
}
function ring(color:string){const m=new MeshBasicMaterial({color,transparent:true,opacity:.6,side:2,depthWrite:false});return new Mesh(new RingGeometry(.94,1,64),m);}
function pin(point:Vector3,color:string){
 const group=new Group();group.position.copy(point);
 const head=new Mesh(new SphereGeometry(.17,12,8),new MeshStandardMaterial({color,emissive:color,emissiveIntensity:.3,roughness:.4}));head.position.y=1.1;
 const stem=makePath([new Vector3(0,.05,0),new Vector3(0,1,0)],color,.012);group.add(head,stem.mesh);return group;
}
function base(cache:AssetCache,point:Point,mobile:boolean){
 const group=new Group(),surfaces:AssetSurface[]=[];
 const surface=(key:string,pos:number[],width:number,aspect:number,rotation=[0,0,0],circle=false)=>{
  const s=createAssetSurface(cache,key,width*(mobile?.55:1),width/aspect*(mobile?(circle?.55:.75):1),circle);s.group.position.copy(point(pos));s.group.rotation.set(rotation[0],rotation[1],rotation[2]);group.add(s.group);surfaces.push(s);return s;
 };
 return {group,surfaces,surface,clear(){surfaces.forEach(s=>s.clear());},active(){return surfaces.filter(s=>s.group.visible).map(s=>s.key);}};
}
export function createYatraLokEnvironment(cache:AssetCache,point:Point,mobile:boolean){
 const env=base(cache,point,mobile),{group,surface}=env;
 const identity=surface('yatralok/identity',[-4,3.7,-12],5.5,530/475,[0,.12,0]);
 const uv=identity.mesh.geometry.attributes.uv;for(let i=0;i<uv.count;i++)uv.setY(i,uv.getY(i)*(365/475));uv.needsUpdate=true;identity.mesh.scale.y*=365/475;identity.group.position.copy(point([-4,3.1,-12]));
 const heading=surface('yatralok/identity-title',[-4,5.65,-11.7],5.5,530/110,[0,.12,0]);
 heading.mesh.renderOrder=3;
 const trip=surface('yatralok/trip',[-5,.45,-19],10,1475/350,[-Math.PI/2,0,-.12]);
 const map=surface('yatralok/map',[1,.12,-27],27,848/500,[-Math.PI/2,0,0]);
 featherSurface(map);
 const routeMap=surface('yatralok/route-concept',[1,.14,-27],27,1063/386,[-Math.PI/2,0,0]);featherSurface(routeMap);
 const title=surface('yatralok/tracking-title',[-1,.20,-18],11,850/49,[-Math.PI/2,0,0]);
 const sos=surface('yatralok/sos',[8,2.6,-32],3.4,1,[0,.18,0],true);
 const contact=surface('yatralok/contacts',[10,.45,-36],5,312/45,[-Math.PI/2,0,0]);
 const route=makePath([[-4,1.4,-11.85],[-5,.6,-14],[-7,.8,-18],[-2,1.4,-25],[4,1.1,-28],[8,.4,-32],[10,.3,-38]].map(point),'#efe0c0',.032);group.add(route.mesh);
 const branches=[[[8,.45,-32],[3,.45,-35],[-4,.45,-34]],[[8,.45,-32],[11,.45,-35],[10,.45,-38]]].map(nodes=>makePath(nodes.map(point),'#b7d3d8',.018));branches.forEach(b=>group.add(b.mesh));
 const pins=[[-5,0,-11],[-2,0,-25],[8,0,-32],[10,0,-38],[-4,0,-34]].map(p=>pin(point(p),'#c4dbe0'));pins.forEach(p=>group.add(p));
 const current=ring('#d8e9ed');current.rotation.x=-Math.PI/2;current.position.copy(point([-2,.5,-25]));group.add(current);
 const signal=ring('#d59c8d');signal.rotation.x=-Math.PI/2;signal.position.copy(point([8,.48,-32]));group.add(signal);
 // Contours extend the blurred product map beyond its original rectangular boundary.
 const positions:number[]=[];const count=mobile?7:15;
 for(let j=0;j<count;j++)for(let i=0;i<64;i++){for(const k of [i,i+1]){const a=k/64*Math.PI*2,r=8+j*.65;const v=point([1+Math.cos(a)*r*1.4,.04+j*.008,-27+Math.sin(a)*r*.62+Math.sin(a*3+j*.17)*.45]);positions.push(...v.toArray());}}
 const contour=new LineSegments(new BufferGeometry().setAttribute('position',new Float32BufferAttribute(positions,3)),new LineBasicMaterial({color:'#99aeb8',transparent:true,opacity:.16}));group.add(contour);
 const roads:ReturnType<typeof makePath>[]=[];
 // Abstract roads are world geometry, never a simulated live Maps API.
 for(let i=0;i<(mobile?5:9);i++){
  const z=-18-i*2.3;
  const road=makePath([[-15,.22,z],[-7,.23,z-1],[0,.26,z+.8],[8,.22,z-1.4],[17,.2,z]].map(point),'#83959b',.018);roads.push(road);group.add(road.mesh);
 }
 for(let i=0;i<5;i++){const x=-10+i*5;const road=makePath([[x,.21,-15],[x+2,.23,-23],[x-1,.24,-31],[x+1,.21,-39]].map(point),'#84969d',.02);roads.push(road);group.add(road.mesh);}
 const river=makePath([[-12,.15,-38],[-8,.16,-32],[-5,.18,-29],[-6,.17,-24],[-3,.16,-17],[0,.15,-12]].map(point),'#608f9c',.13);group.add(river.mesh);
 const light=new PointLight('#b8d7df',0,28,1.5);light.position.copy(point([1,5,-25]));group.add(light);
 return {...env,route,update(p:number,_avatar:Vector3){
  const exit=1-ramp(p,.475,.55),enter=ramp(p,.04,.10);group.visible=p>0&&p<.56;
  identity.show(enter*exit*(1-ramp(p,.19,.24)*.75));heading.show(enter*exit*(1-ramp(p,.19,.24)*.75));
  heading.group.position.copy(point([-4,5.65,-11.7+.35*ramp(p,.105,.13)]));
  identity.group.rotation.y=heading.group.rotation.y=mix(.28,-.13,ramp(p,.105,.13));
  trip.show(ramp(p,.175,.208)*exit*(1-ramp(p,.23,.26)));
  const expansion=ramp(p,.215,.263);map.mesh.scale.set(27*(mobile?.55:1)*mix(.40,1,expansion),27/(848/500)*(mobile?.75:1)*mix(.40,1,expansion),1);
  map.show(ramp(p,.21,.25)*exit*.9*(1-ramp(p,.25,.28)));
  routeMap.show(ramp(p,.25,.28)*exit*.88);title.show(ramp(p,.22,.26)*exit*.9);
  sos.show(ramp(p,.325,.35)*exit);contact.show(ramp(p,.375,.41)*exit);
  route.reveal(.85*ramp(p,.16,.267)+.15*ramp(p,.37,.42));route.material.opacity=(1-ramp(p,.47,.49))*.95;branches.forEach(b=>{b.reveal(ramp(p,.385,.42));b.material.opacity=exit*(1-ramp(p,.477,.51))*.7;});
  pins.forEach((pin,i)=>{pin.visible=i!==2&&p>([.12,.24,.255,.385,.39][i]);pin.scale.setScalar(exit);});
  // The tracked location travels along the established route, then IS the emergency origin.
  pins[1].position.copy(point([-2,0,-25])).lerp(point([8,0,-32]),ramp(p,.29,.357));
  current.position.copy(pins[1].position);current.position.y+=.42;current.visible=p>.23;current.scale.setScalar(1.2+.22*Math.sin(range(p,.25,.32)*Math.PI));current.material.opacity=exit*mix(.65,.18,ramp(p,.329,.357))*(1-ramp(p,.48,.51));
  pins[1].scale.setScalar(exit*(1+.5*ramp(p,.381,.39)*(1-ramp(p,.40,.425))));
  const pulse=range(p,.37,.402);signal.visible=pulse>0&&pulse<1;signal.scale.setScalar(mix(.6,15,pulse));signal.material.opacity=(1-pulse)*.6;
  contour.material.opacity=ramp(p,.18,.25)*exit*.19;
  roads.forEach(r=>{r.reveal(ramp(p,.21,.26));r.material.opacity=exit*.30;});river.reveal(ramp(p,.22,.28));river.material.opacity=exit*.4;
  const response=ramp(p,.37,.383)*(1-ramp(p,.395,.425));light.color.set('#b8d7df').lerp(new Color('#c58e84'),response);light.intensity=exit*(10*ramp(p,.20,.25)+7*response);light.position.copy(point([mix(1,8,response),5,mix(-25,-32,response)]));
  return {yatraLighting:{intensity:light.intensity,color:light.color.getHexString()},trackedLocationId:pins[1].id,trackedLocation:pins[1].position.toArray(),emergencyLocation:pins[1].position.toArray(),sosStage:p<.325?'CALM':p<.355?'DISCOVERY':p<.37?'ANTICIPATION':p<.385?'ACTIVATION':p<.42?'RESPONSE':'CALM',routeProgress:ramp(p,.16,.42),sosProgress:pulse,sosPulseVisible:signal.visible,mapExpansion:expansion};
 }};
}
/** One environment, one transaction. Structural layers are revealed by the same scroll clock. */
export function createPrishaEnvironment(cache:AssetCache,point:Point,mobile:boolean){
 const env=base(cache,point,mobile),{group,surface}=env;
 const storefront=surface('prisha/storefront',[-7,5,-60],21,1908/765,[0,.13,0]);
 const catalogue=surface('prisha/catalogue',[0,4.4,-72],18,1535/541,[0,-.04,0]);
 const product=surface('prisha/product',[3.3,4.7,-71.8],4,340/273);
 const detail=surface('prisha/product-detail',[3.3,2,-71.8],4,340/247);
 const checkout=surface('prisha/checkout',[0,4,-85],12,735/332,[0,-.24,0]);
 const payment=surface('prisha/payment',[0,.4,-84.7],12,735/119,[0,-.24,0]);
 const portal=surface('prisha/portal',[17,3.5,-107],3.8,560/600,[0,-.3,0]);
 // Dashboard components retain their real source hierarchy and become the destination wall.
 const orders=surface('prisha/orders',[13,7,-119],mobile?12:16,1522/159,[0,.03,0]);
 const revenue=surface('prisha/revenue',[13,5.2,-119],16,1522/186,[0,.03,0]);
 const distribution=surface('prisha/distribution',[mobile?13:9,2.2,-118.6],mobile?13:7.5,747/430,[0,.03,0]);
 const products=surface('prisha/products',[17,2.2,-118.6],7.5,746/430,[0,.03,0]);
 // Control points deliberately pass beside checkout; no surface clipping or new pulses.
 const flowPoints=[[3.3,4.7,-70.4],[3.3,1.7,-77],[0,.55,-83.7],[4,2,-95],[7,2.6,-101],[10,2,-107],[11,2,-112],[mobile?13:9,3.7,-118.1]].map(point);
 const flow=makePath(flowPoints,'#e5cd9f',.034);group.add(flow.mesh);
 const discovery=makePath([[-7,1,-60],[-2,1.4,-64],[3.3,4.7,-70.4]].map(point),'#b8c8d4',.024);group.add(discovery.mesh);
 const gate=ring('#b5c9d4');gate.position.copy(flowPoints[3]);gate.scale.setScalar(mobile?1.05:1.8);group.add(gate);
 const verify=ring('#e4d2ad');verify.position.copy(gate.position);group.add(verify);
 const cart=makePath([[1.5,1.5,-77],[1.5,.7,-77],[5,.7,-77],[5,1.5,-77]].map(point),'#b5c2c9',.035);group.add(cart.mesh);
 const packet=new Group();packet.name='prisha-transaction';
 const packetBody=new Mesh(new BoxGeometry(.72,.44,.1),new MeshStandardMaterial({color:'#f0e3c6',emissive:'#ead5ac',emissiveIntensity:.75,roughness:.48,metalness:.15}));
 packet.add(packetBody);group.add(packet);
 const light=new PointLight('#a9c3e4',0,28,1.4);group.add(light);
 const labelTextures:CanvasTexture[]=[];
 function label(text:string,pos:number[],width:number){
  const canvas=document.createElement('canvas');canvas.width=768;canvas.height=80;const ctx=canvas.getContext('2d')!;
  ctx.font='500 28px monospace';ctx.fillStyle='#c3d2dc';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(text,4,40);
  const texture=new CanvasTexture(canvas);texture.colorSpace=SRGBColorSpace;labelTextures.push(texture);
  const mesh=new Mesh(new PlaneGeometry(width*(mobile?.55:1),width/9.6),new MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,opacity:0,toneMapped:false}));mesh.position.copy(point(pos));group.add(mesh);return mesh;
 }
 const paymentLabel=label('RAZORPAY',[2.8,4.2,-95],4);
 // Open architectural shelves and longitudinal rails, not diagram boxes.
 const layers=[{at:.769,end:.790,x:7,z:-101,w:15,label:'EXPRESS / API'}, {at:.790,end:.813,x:10,z:-107,w:17,label:'ORDER / PAYMENT / STOCK'}, {at:.813,end:.837,x:11,z:-112,w:15,label:'SEQUELIZE / MYSQL'}].map((spec,i)=>{
  const deck=new Mesh(new BoxGeometry(spec.w*(mobile?.55:1),.065,4.6*(mobile?.65:1)),new MeshStandardMaterial({color:i===2?'#26343a':'#26323e',roughness:.85,metalness:.18,transparent:true,opacity:0,emissive:'#879eb2',emissiveIntensity:.10}));deck.position.copy(point([spec.x,.65+i*.12,spec.z]));group.add(deck);
  const rails=[-1,1].map(side=>makePath([[spec.x+side*spec.w/2,.8+i*.12,spec.z+2.3],[spec.x+side*spec.w/2,.8+i*.12,spec.z-2.3],[spec.x+side*(spec.w/2-1),.8+i*.12,spec.z-3]].map(point),'#879da9',.018));rails.forEach(r=>group.add(r.mesh));
  const caption=label(spec.label,[spec.x-spec.w/2+.5,1.4,spec.z+1],mobile?8:9);caption.position.x+=mobile?2.2:4.5;
  return {...spec,deck,rails,caption};
 });
 const relationships=[[[10,2,-107],[4,1.05,-109],[4,1.05,-113]],[[10,2,-107],[17,1.05,-109],[17,1.05,-113]]].map(a=>makePath(a.map(point),'#a4b9c6',.025));relationships.forEach(r=>group.add(r.mesh));
 const dataRibs=Array.from({length:mobile?3:6},(_,i)=>makePath([[6+i*1.7,.98,-110],[6+i*1.7,.98,-114]].map(point),'#80939e',.015));dataRibs.forEach(r=>group.add(r.mesh));
 const operationConnections=[[[11,2,-112],[mobile?13:9,3.7,-118.1]],[[11,2,-112],[17,2.2,-118.4]],[[11,2,-112],[13,7,-118.8]]].map(a=>makePath(a.map(point),'#bbc9d3',.02));operationConnections.forEach(r=>group.add(r.mesh));
 const stageKeys=[{p:.646,t:0,stage:'PRODUCT'},{p:.675,t:1/7,stage:'CART'},{p:.701,t:2/7,stage:'CHECKOUT'},{p:.728,t:2/7,stage:'CHECKOUT'},{p:.746,t:3/7,stage:'PAYMENT'},{p:.766,t:3/7,stage:'VERIFICATION'},{p:.790,t:4/7,stage:'API'},{p:.813,t:5/7,stage:'ORDER'},{p:.837,t:6/7,stage:'DATA'},{p:.859,t:1,stage:'ADMIN'},{p:1,t:1,stage:'ADMIN'}];
 let transactionProgress=0;
 return {...env,dispose(){labelTextures.forEach(t=>t.dispose());},update(p:number){
  const enter=ramp(p,.569,.583),dormant=1-ramp(p,.97,1)*.55;group.visible=p>.50;
  const selected=ramp(p,.615,.636),depart=ramp(p,.657,.680),admin=ramp(p,.837,.854),wide=ramp(p,.895,.937);
  storefront.show(enter*(1-ramp(p,.607,.635))*(1-wide)*dormant+wide*dormant*.7);
  storefront.group.rotation.x=-.22*wide;
  catalogue.show(ramp(p,.607,.63)*(1-selected*.85)*(1-ramp(p,.661,.690)));
  product.group.position.copy(point([3.3,4.7,-71.8+1.4*selected]));product.group.scale.setScalar(mix(1,.9,depart));product.show(ramp(p,.615,.636)*(1-depart));
  detail.group.position.copy(point([3.3,2,-71.8+selected]));detail.show(selected*(1-depart));
  let a=stageKeys[0],b=stageKeys[1];for(let i=1;i<stageKeys.length;i++){a=stageKeys[i-1];b=stageKeys[i];if(p<=b.p)break;}
  transactionProgress=mix(a.t,b.t,ramp(p,a.p,b.p));packet.position.copy(flow.curve.getPoint(transactionProgress));packet.rotation.set(.12,mix(0,.28,ramp(p,.766,.837)),0);packet.scale.setScalar(mobile?.85:1);packet.visible=p>=.646;packetBody.material.emissiveIntensity=mix(.75,.3,wide);
  const checkoutAlpha=ramp(p,.674,.696)*(1-ramp(p,.767,.797)*.82)*dormant*(1-wide);
  checkout.show(checkoutAlpha);payment.show(ramp(p,.69,.704)*(1-ramp(p,.767,.797)*.82)*dormant*(1-wide));
  checkout.group.rotation.y=payment.group.rotation.y=mix(-.24,-.06,ramp(p,.676,.696));
  payment.group.position.copy(point([0,.4,-84.7+1.25*ramp(p,.719,.740)]));
  portal.show(0);portal.group.rotation.y=-.3;
  orders.show(admin*dormant);revenue.show(mobile?0:admin*dormant);distribution.show(admin*dormant);products.show(admin*dormant*(mobile?wide*.6:1));
  flow.reveal(ramp(p,.646,.859));flow.material.opacity=dormant*.85;cart.reveal(ramp(p,.646,.672));cart.material.opacity=(1-ramp(p,.75,.8))*.7;
  discovery.reveal(ramp(p,.583,.646));discovery.material.opacity=dormant*.55;
  gate.visible=p>.731;gate.material.opacity=ramp(p,.731,.746)*dormant*.5;paymentLabel.visible=p>.731;paymentLabel.material.opacity=ramp(p,.731,.746)*dormant*.9;
  const pulse=range(p,.748,.773);verify.visible=pulse>0&&pulse<1;verify.scale.setScalar(mix(1,4,pulse));verify.material.opacity=(1-pulse)*.55;
  const backend=ramp(p,.769,.837);
  layers.forEach(layer=>{const reveal=ramp(p,layer.at,layer.end);layer.deck.visible=reveal>0;layer.deck.material.opacity=reveal*dormant*.88;layer.caption.visible=reveal>0;layer.caption.material.opacity=reveal*dormant;layer.rails.forEach(r=>{r.reveal(reveal);r.material.opacity=dormant*.65;});});
  relationships.forEach(r=>{r.reveal(ramp(p,.799,.825));r.material.opacity=dormant*.7;});dataRibs.forEach(r=>{r.reveal(ramp(p,.821,.840));r.material.opacity=dormant*.65;});operationConnections.forEach((r,i)=>{r.reveal(admin);r.material.opacity=dormant*(mobile&&i>0?.15:.55);});
  const neutral=ramp(p,.805,.854);light.color.set('#a9c3e4').lerp(new Color('#e1ded3'),neutral);light.intensity=enter*dormant*18;light.position.copy(point([-4,5,-58])).lerp(packet.position.clone().add(new Vector3(0,2,3)),ramp(p,.632,.69));
  const transactionStage=p<.646?'DORMANT':p<.663?'PRODUCT':p<.688?'CART':p<.732?'CHECKOUT':p<.748?'PAYMENT':p<.768?'VERIFICATION':p<.785?'ORDER':p<.820?'API':p<.85?'DATA':'ADMIN';
  return {transactionProgress,transactionStage,transactionSignalId:packet.id,transactionSignalVisible:packet.visible,transactionPosition:packet.position.toArray(),backendRevealProgress:backend,backendLayers:layers.map(l=>ramp(p,l.at,l.end)),adminRevealProgress:admin,verificationPulse:pulse,productPosition:product.group.position.toArray(),prishaDormancy:1-dormant,prishaLighting:{intensity:light.intensity,color:light.color.getHexString(),position:light.position.toArray()}};
 }};
}
