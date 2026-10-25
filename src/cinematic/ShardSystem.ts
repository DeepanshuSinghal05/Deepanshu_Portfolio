import { Group, Mesh, MeshPhysicalMaterial, Shape, ExtrudeGeometry, Vector3, BufferGeometry, Float32BufferAttribute, LineSegments, LineBasicMaterial } from 'three';
import { cinematicConfig as C, range, smooth } from './config';
type Point = [number, number];
function clip(poly: Point[], nx: number, nz: number, limit: number): Point[] {
  const output: Point[] = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const da = a[0] * nx + a[1] * nz - limit, db = b[0] * nx + b[1] * nz - limit;
    if (da <= 0) output.push(a);
    if ((da <= 0) !== (db <= 0)) { const t = da / (da - db); output.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
  }
  return output;
}
export function createShardSystem(mobile: boolean) {
  const group = new Group(); group.position.fromArray(C.impactPoint);
  let seed = 817;
  const random = () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; };
  const seeds: Point[] = [[0, 0], [.25, .12], [-.2, -.22]];
  for (let i = 0; i < (mobile ? 21 : 39); i++) { const a = random() * Math.PI * 2, r = Math.sqrt(random()) * C.glass.radius; seeds.push([Math.cos(a) * r, Math.sin(a) * r]); }
  const boundary: Point[] = Array.from({ length: 8 }, (_, i) => [Math.cos(i * Math.PI / 4) * C.glass.radius, Math.sin(i * Math.PI / 4) * C.glass.radius]);
  const material = new MeshPhysicalMaterial({ color: '#c7d1d0', metalness: .15, roughness: .09, transparent: true, opacity: .42, depthWrite: false, clearcoat: 1, side: 2 });
  const edgeMaterial = new LineBasicMaterial({ color: '#e3d8bf', transparent: true, opacity: .6, depthWrite: false });
  const crackEdges: { distance: number; values: number[] }[] = [];
  const shards = seeds.map(([sx, sz], index) => {
    let polygon = boundary.map(p => [...p] as Point);
    seeds.forEach(([x, z], j) => { if (j !== index) polygon = clip(polygon, x - sx, z - sz, (x*x + z*z - sx*sx - sz*sz) / 2); });
    const center = new Vector3(polygon.reduce((a,p)=>a+p[0],0)/polygon.length, 0, polygon.reduce((a,p)=>a+p[1],0)/polygon.length);
    const shape = new Shape(); polygon.forEach(([x,z],i)=>i ? shape.lineTo(x-center.x,z-center.z) : shape.moveTo(x-center.x,z-center.z)); shape.closePath();
    const geometry = new ExtrudeGeometry(shape, { depth: .028, bevelEnabled: false, steps: 1 }); geometry.rotateX(Math.PI / 2);
    const mesh = new Mesh(geometry, material); mesh.position.copy(center); group.add(mesh);
    const values: number[] = [];
    polygon.forEach((a, i) => { const b = polygon[(i+1)%polygon.length]; values.push(a[0]-center.x,.012,a[1]-center.z,b[0]-center.x,.012,b[1]-center.z); crackEdges.push({distance:Math.hypot((a[0]+b[0])/2,(a[1]+b[1])/2),values:[a[0],.018,a[1],b[0],.018,b[1]]}); });
    const edges = new LineSegments(new BufferGeometry().setAttribute('position',new Float32BufferAttribute(values,3)), edgeMaterial); mesh.add(edges);
    const direction = new Vector3(center.x*.65 + (random()-.5)*1.6, -(1+random()*4), center.z*.4 + (random()-.5)*5).normalize();
    if (!mobile && index < 2) direction.set(index ? -1.2 : 1.8, 1.2, 6).normalize();
    return { mesh, initialPosition:center, fractureDirection:direction, travelDistance: !mobile&&index<2 ? 11 : 3+random()*6, rotationAxis:new Vector3(random()-.5,random()-.5,random()-.5).normalize(), rotationAmount:(random()-.5)*8, depthBias:random()*3, delay:Math.min(.4,center.length()/14) };
  });
  // First fissures begin at the exact contact, then join the irregular cell network.
  const primaryEdges: { distance:number; values:number[] }[]=[];
  for (let i=0;i<9;i++) {
    const angle=i/9*Math.PI*2+random()*.3, r=2+random()*2;
    const middle:[number,number]=[Math.cos(angle+.1)*r*.45,Math.sin(angle+.1)*r*.45];
    const points:Point[]=[[0,0],middle,[Math.cos(angle)*r,Math.sin(angle)*r]];
    for(let leg=0;leg<2;leg++)for(let step=0;step<6;step++){
      const a=points[leg],b=points[leg+1],u=step/6,v=(step+1)/6;
      primaryEdges.push({distance:leg+u,values:[a[0]+(b[0]-a[0])*u,.02,a[1]+(b[1]-a[1])*u,a[0]+(b[0]-a[0])*v,.02,a[1]+(b[1]-a[1])*v]});
    }
  }
  crackEdges.sort((a,b)=>a.distance-b.distance);
  const crackMaterial = new LineBasicMaterial({ color:'#f1e5cd', transparent:true, opacity:.85, depthWrite:false });
  const cracks = new LineSegments(new BufferGeometry().setAttribute('position',new Float32BufferAttribute(crackEdges.flatMap(e=>e.values),3)),crackMaterial); group.add(cracks);
  primaryEdges.sort((a,b)=>a.distance-b.distance);
  const primary=new LineSegments(new BufferGeometry().setAttribute('position',new Float32BufferAttribute(primaryEdges.flatMap(e=>e.values),3)),crackMaterial);group.add(primary);
  return { group, update(fracture: number, impact: number, visibility: number) {
    group.visible = visibility > 0 && impact > 0;
    primary.geometry.setDrawRange(0,Math.floor(smooth(range(impact,.03,.52))*primaryEdges.length)*2);
    primary.visible=fracture<.2;
    cracks.geometry.setDrawRange(0, Math.floor(smooth(range(impact,.52,1))*crackEdges.length)*2);
    cracks.visible = fracture < .2;
    crackMaterial.opacity = .85 * visibility * (1-range(fracture,0,.2));
    material.opacity = (.16+.12*smooth(fracture)) * visibility; edgeMaterial.opacity = .52 * visibility;
    shards.forEach(s => {
      const t = range(fracture, s.delay, 1) ** (1.1+s.depthBias*.18);
      s.mesh.visible = fracture > 0;
      s.mesh.position.copy(s.initialPosition).addScaledVector(s.fractureDirection, t*s.travelDistance);
      s.mesh.position.y -= t*t*(2+s.depthBias);
      s.mesh.setRotationFromAxisAngle(s.rotationAxis, t*s.rotationAmount);
    });
  }, diagnostics(){return {primaryProgress:primary.geometry.drawRange.count/(primaryEdges.length*2),secondaryProgress:cracks.geometry.drawRange.count/(crackEdges.length*2),displacedShards:shards.filter(s=>s.mesh.position.distanceToSquared(s.initialPosition)>.000001).length};}, snapshot() { return shards.map(s=>({position:s.mesh.position.toArray(),rotation:s.mesh.quaternion.toArray()})); }, count:shards.length };
}
