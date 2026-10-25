import { Group, InstancedMesh, BoxGeometry, MeshStandardMaterial, Object3D, Color } from 'three';
import { range, smooth } from './config';

/** Sparse incomplete structural bays at three real depths, not buildings or content. */
export function createOuterEnvironment(mobile: boolean) {
  const group = new Group(), dummy = new Object3D();
  const material = new MeshStandardMaterial({ color: '#ffffff', roughness: .86, metalness: .18, transparent: true });
  const edgeMaterial = new MeshStandardMaterial({ color: '#ffffff', roughness: .65, metalness: .3, transparent: true });
  const count = mobile ? 12 : 24;
  const structure = new InstancedMesh(new BoxGeometry(1, 1, 1), material, count);
  const edges = new InstancedMesh(new BoxGeometry(1, 1, 1), edgeMaterial, count);
  for (let i = 0; i < count; i++) {
    const tier = i < count * 2/3 ? 0 : i < count-2 ? 1 : 2, side = i % 2 ? 1 : -1;
    const x = side * (6 + tier * 5 + Math.sin(i * 2.1) * 2);
    const y = 12 - (i % Math.ceil(count*2/3)) * 4.6 - tier*20, z = [-9,-29,-57][tier];
    dummy.position.set(x, y, z);
    const horizontal = i % 4 === 0;
    dummy.scale.set(horizontal ? 12 + tier * 12 : .48 + tier * 1.2, horizontal ? .45 + tier*.2 : 14 + tier * 16, 1 + tier * .4);
    dummy.rotation.set(0, side * .12, horizontal ? side * .08 : 0); dummy.updateMatrix(); structure.setMatrixAt(i, dummy.matrix);
    structure.setColorAt(i,new Color(['#303c43','#202b33','#19232c'][tier]));
    dummy.position.z += .52 + tier * .2;
    dummy.scale.set(horizontal ? 12 + tier * 5 : .018, horizontal ? .016 : 14 + tier * 9, .016); dummy.updateMatrix(); edges.setMatrixAt(i, dummy.matrix);
    edges.setColorAt(i,new Color(['#6d716d','#303a3e','#19232c'][tier]));
  }
  group.add(structure, edges);
  return { group, update(p: number) {
    const opacity = smooth(range(p, .12, .3)) * (1 - smooth(range(p, .73, .965)));
    const focus=1-.28*smooth(range(p,.49,.56))*(1-smooth(range(p,.65,.73)));
    group.visible = opacity > .001; material.opacity = opacity * .84 * focus; edgeMaterial.opacity = opacity * .3 * focus;
  }, count };
}
