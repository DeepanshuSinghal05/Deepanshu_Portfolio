import { Color, Mesh, PlaneGeometry, ShaderMaterial } from 'three';
import { range, smooth } from './config';

/** One opaque, unlit far plane: depth atmosphere without transparent layers. */
export function createAtmosphericBackdrop() {
  const material = new ShaderMaterial({
    depthWrite:false,
    uniforms:{calm:{value:0},dark:{value:new Color('#151a20')},cool:{value:new Color('#293b42')},warm:{value:new Color('#3d3830')}},
    vertexShader:`varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`
      varying vec2 vUv; uniform float calm; uniform vec3 dark,cool,warm;
      void main(){
        vec2 uv=vUv;
        float haze=exp(-pow((uv.x-.62)*3.8,2.)-pow((uv.y-mix(.42,.57,calm))*5.,2.));
        float low=exp(-pow((uv.x-.72)*5.,2.)-pow((uv.y-.29)*14.,2.));
        float trace=exp(-pow((uv.x-.7)*230.,2.))*smoothstep(.1,.3,uv.y)*(1.-smoothstep(.58,.8,uv.y));
        vec3 color=mix(dark,cool,haze*.42);
        color=mix(color,warm,low*.24+trace*.055);
        color=mix(dark,color,mix(1.,smoothstep(.37,.5,uv.y),calm));
        gl_FragColor=vec4(color,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const mesh=new Mesh(new PlaneGeometry(220,220),material);
  mesh.position.set(0,-20,-95);mesh.renderOrder=-10;
  return {mesh,update(p:number,mood=0){material.uniforms.calm.value=smooth(range(p,.78,.96));material.uniforms.dark.value.set('#151a20').lerp(new Color('#080e10'),mood);material.uniforms.cool.value.set('#293b42').lerp(new Color('#142c28'),mood);}};
}
