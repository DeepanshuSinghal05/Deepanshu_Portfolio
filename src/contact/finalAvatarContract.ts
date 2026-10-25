import {createContactTrajectory} from './ContactTrajectory';
import {storyConfig} from '../story/storyConfig';

/** AvatarRig owns all transforms; optional local bounds reproduce character-aware final framing. */
export function finalAvatarContract(mobile:boolean,aspect:number,characterBounds?:number[][]){
 const trajectory=createContactTrajectory(mobile);trajectory.setAspect(aspect);trajectory.setCharacterBounds(characterBounds);const pose=trajectory.finalPose;
 return {
  finalAvatarPosition:pose.position.toArray(),finalAvatarRotation:[0,pose.rotation,0],
  finalAvatarScale:[storyConfig.avatar.scale,storyConfig.avatar.scale,storyConfig.avatar.scale],
  cameraPosition:pose.camera.toArray(),cameraTarget:pose.target.toArray(),cameraFov:pose.fov,
  groundY:pose.position.y,expectedLocalHeight:2.1,localOrigin:'Between soles',upAxis:'+Y',forwardAxis:'+Z',
  lighting:{key:{color:'#f5f1e7',intensity:1.25,relativePosition:[4,6,5]},rim:{color:'#e6dfd3',intensity:.5,relativePosition:[-5,2,-3]},ambient:{color:'#e8e0d2',intensity:.4},hemisphere:{sky:'#fff2df',ground:'#343c43',intensity:1.1},environmentIntensity:.35},
  hooks:['setLandingPose(compression, recovery)','setStoryPose(pose)'],finalState:'IDLE',
 };
}
