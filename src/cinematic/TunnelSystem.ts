import { Group, InstancedMesh, BoxGeometry, MeshStandardMaterial, Object3D, MeshPhysicalMaterial, Mesh, CylinderGeometry, BackSide, BufferGeometry, Float32BufferAttribute, Points, PointsMaterial, LineSegments, LineBasicMaterial } from 'three';
import { cinematicConfig as C, progressAt, smooth, range } from './config';
export function createTunnelSystem(mobile: boolean) {
  const group = new Group();
  const material = new MeshStandardMaterial({ color: '#424b4f', metalness: .6, roughness: .38, transparent: true });
  const markerMaterial = new MeshStandardMaterial({ color: '#8d8474', emissive: '#71634b', emissiveIntensity: .08, metalness: .65, roughness: .35, transparent: true });
  const detailMaterial = new MeshStandardMaterial({ color: '#b9a786', metalness: .6, roughness: .4, transparent: true });
  const dummy = new Object3D(), segments = 8, levels = C.tunnel.bays.length;
  const rails = new InstancedMesh(new BoxGeometry(.22, 58, .32), material, segments);
  const rings = new InstancedMesh(new BoxGeometry(3.4, .12, .19), markerMaterial, segments * levels);
  const joints = new InstancedMesh(new BoxGeometry(.36, .25, .38), material, segments * levels);
  const details = new InstancedMesh(new BoxGeometry(3.4, .009, .009), detailMaterial, segments * levels);
  for (let i = 0; i < segments; i++) {
    const angle = i / segments * Math.PI * 2;
    dummy.position.set(Math.sin(angle) * C.tunnel.radius, -22, Math.cos(angle) * C.tunnel.radius); dummy.rotation.set(0, 0, 0); dummy.updateMatrix(); rails.setMatrixAt(i, dummy.matrix);
    for (let j = 0; j < levels; j++) {
      const mid = angle + Math.PI / segments;
      const radius = C.tunnel.radius + (j === 8 ? .65 : j === 9 ? .3 : 0);
      dummy.scale.set(radius / C.tunnel.radius, (i === 0 || i === 7) ? .18 : j % 3 === 0 ? 1.8 : .6, 1);
      dummy.position.set(Math.sin(mid) * radius * .924, C.tunnel.bays[j], Math.cos(mid) * radius * .924);
      dummy.rotation.y = mid; dummy.updateMatrix(); rings.setMatrixAt(j * segments + i, dummy.matrix);
      dummy.position.y += .34; dummy.scale.y = 1; dummy.updateMatrix(); details.setMatrixAt(j * segments + i, dummy.matrix);
      dummy.position.set(Math.sin(angle) * radius, C.tunnel.bays[j], Math.cos(angle) * radius); dummy.scale.set(1,1,1); dummy.updateMatrix(); joints.setMatrixAt(j * segments + i, dummy.matrix);
    }
  }
  const wallMaterial = new MeshPhysicalMaterial({ color: '#9dadaf', transparent: true, opacity: .065, roughness: .18, metalness: .25, side: BackSide, depthWrite: false });
  const walls = new Mesh(new CylinderGeometry(C.tunnel.radius, C.tunnel.radius, 58, 8, 1, true), wallMaterial); walls.position.y = -22;
  group.add(rails, rings, joints, details, walls);
  const particles = new Float32Array((mobile ? C.atmosphere.mobileParticles : C.atmosphere.particles) * 3);
  for (let i = 0; i < particles.length; i += 3) { particles[i] = Math.sin(i * 12.989) * 4; particles[i + 1] = -((i * 7.319) % 52); particles[i + 2] = Math.cos(i * 3.717) * 4; }
  const dustMaterial = new PointsMaterial({ color: '#c3b49d', size: .022, transparent: true, opacity: .25, depthWrite: false });
  const dust = new Points(new BufferGeometry().setAttribute('position', new Float32BufferAttribute(particles, 3)), dustMaterial); group.add(dust);
  const streakPositions=new Float32Array(particles.length*2);
  const streakGeometry=new BufferGeometry().setAttribute('position',new Float32BufferAttribute(streakPositions,3));
  const streakMaterial=new LineBasicMaterial({color:'#aba99d',transparent:true,opacity:0,depthWrite:false});
  const streaks=new LineSegments(streakGeometry,streakMaterial);group.add(streaks);
  return { group, update(p: number, velocity = 0) {
    const t = progressAt(p), focus = smooth(range(p,.49,.56)) * (1-smooth(range(p,.65,.73)));
    const alpha = smooth(t.tunnel) * (1 - smooth(range(p,.69,.96))) * (1-focus*.24);
    group.visible = alpha > .001; material.opacity = alpha * .95; markerMaterial.opacity = alpha * .72; detailMaterial.opacity = alpha * .2; wallMaterial.opacity = alpha * .035;
    if (!group.visible) return;
    dustMaterial.opacity = alpha * (.13 + .14 * t.speed) * (1 - .7*smooth(t.glass));
    dust.position.y = t.speed * 1.3 + velocity * .16;
    dust.scale.y = 1 + velocity * .025;
    const energy = smooth(range(p,.31,.46))*(1-smooth(range(p,.49,.56)));
    streakMaterial.opacity=alpha*energy*(.035+velocity*.025);
    for(let i=0;i<particles.length;i+=3){const j=i*2;streakPositions[j]=streakPositions[j+3]=particles[i];streakPositions[j+1]=particles[i+1];streakPositions[j+4]=particles[i+1]+.04+energy*.08+velocity*.06;streakPositions[j+2]=streakPositions[j+5]=particles[i+2];}
    (streakGeometry.attributes.position as Float32BufferAttribute).array.set(streakPositions);streakGeometry.attributes.position.needsUpdate=true;
    streaks.position.y=dust.position.y;
  }};
}
