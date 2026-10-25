import { createStoryTrajectory } from '../story/StoryTrajectory';
import { createProjectTrajectory } from '../projects/ProjectTrajectory';
import { createDOJTrajectory } from '../projects/DOJTrajectory';
import { createHoloTrajectory } from '../projects/HoloTrajectory';
import { createExperienceTrajectory } from '../experience/ExperienceTrajectory';
import { range, smooth } from './config';
import type { CharacterFrame } from './CharacterAnimation';
import type { StoryPose } from '../story/StoryTrajectory';

/** Arc-length tables sample the existing routes, including lateral world exits.
 * Gait phase depends on absolute path distance, never render history or velocity.
 */
export function createCharacterMotion(mobile:boolean){
  const story=createStoryTrajectory(mobile),project=createProjectTrajectory(mobile);
  const doj=createDOJTrajectory(mobile,project.sample(1)),holo=createHoloTrajectory(mobile,doj.sample(1));
  const experience=createExperienceTrajectory(mobile,holo.sample(1));
  const samplers={story:story.sample,project:(p:number)=>p>1.64?holo.sample(range(p,1.64,2.72)):p>1?doj.sample(range(p,1,1.64)):project.sample(p),experience:experience.sample};
  const tables=new Map<string,{values:Float64Array;turns:Float64Array;extent:number;offset:number}>();
  let prefix=0;
  for(const section of ['story','project','experience'] as const){
    const extent=section==='project'?2.72:1,count=Math.ceil(extent*1000),values=new Float64Array(count+1),sample=samplers[section];
    const poses=Array.from({length:count+1},(_,i)=>sample(i/count*extent));
    for(let i=1;i<=count;i++)values[i]=values[i-1]+poses[i].position.distanceTo(poses[i-1].position);
    const raw=new Float64Array(count+1),turns=new Float64Array(count+1);
    let previousTurn=0,moving=false;
    for(let i=1;i<count;i++){
      const delta=poses[i+1].position.clone().sub(poses[i-1].position),speed=delta.length()/(2*extent/count);
      const heading=Math.atan2(delta.x,delta.z)-poses[i].rotation;
      let turn=Math.atan2(Math.sin(heading),Math.cos(heading));
      if(speed>.01){
        if(moving){while(turn-previousTurn>Math.PI)turn-=Math.PI*2;while(turn-previousTurn<-Math.PI)turn+=Math.PI*2;}
        else{const authoredTurn=poses[i+1].rotation-poses[i-1].rotation;if(authoredTurn*turn<0&&Math.abs(turn)>Math.PI/2)turn+=Math.sign(authoredTurn)*Math.PI*2;}
        previousTurn=turn;moving=true;
      }else moving=false;
      // Authored entrances/exits own large turns. Correct only modest route-heading
      // differences; lateral composition shifts must not spin the character.
      raw[i]=Math.max(-.55,Math.min(.55,turn))*smooth(Math.min(1,speed/25));
    }
    // Anticipate/finish a direction change over a short scroll interval rather than
    // snapping yaw as soon as the walk weight rises. No history-dependent damping.
    const radius=15;
    for(let i=0;i<=count;i++){
      let total=0,weight=0;
      for(let k=-radius;k<=radius;k++){const w=radius+1-Math.abs(k);total+=(raw[Math.max(0,Math.min(count,i+k))])*w;weight+=w;}
      const p=i/count*extent;turns[i]=total/weight*smooth(range(p,0,.025))*(1-smooth(range(p,extent-.025,extent)));
    }
    tables.set(section,{values,turns,extent,offset:prefix});prefix+=values[count];
  }
  return (section:CharacterFrame['section'],p:number):CharacterFrame&{turnOffset?:number}=>{
    if(section==='cinematic'||section==='contact')return {section,progress:p,distance:section==='contact'?prefix:0};
    const table=tables.get(section)!,index=Math.max(0,Math.min(table.values.length-1,p/table.extent*(table.values.length-1))),i=Math.floor(index),f=index-i;
    const distance=table.offset+table.values[i]+((table.values[i+1]??table.values[i])-table.values[i])*f;
    const a=samplers[section](Math.max(0,p-.0001)),b=samplers[section](Math.min(table.extent,p+.0001));
    const displacement=b.position.sub(a.position),speed=displacement.length()/.0002;
    const turnProgress=section==='story'&&p>=.19&&p<=.235?range(p,.19,.235):section==='project'&&p>=.047&&p<=.11?range(p,.047,.11):section==='experience'&&p>=.835&&p<=.97?range(p,.835,.97):undefined;
    return {section,progress:p,distance,walkWeight:smooth(Math.min(1,speed/25)),turnProgress,turnOffset:table.turns[i]+((table.turns[i+1]??table.turns[i])-table.turns[i])*f};
  };
}

export function faceTravel(pose:StoryPose,frame:CharacterFrame&{turnOffset?:number}){
  pose.rotation+=frame.turnOffset??0;
}
