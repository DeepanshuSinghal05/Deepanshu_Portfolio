import { range } from '../cinematic/config';
// Zero acceleration at either end keeps root travel compatible with future walk/stop clips.
export const travelEase=(v:number)=>v*v*v*(v*(v*6-15)+10);
export const storyConfig = {
  scroll:{desktop:820,mobile:720,reduced:420},
  avatar:{scale:1,groundOffset:0,orientationOffset:0,walkDirection:[0,0,-1] as const,cameraFramingOffset:[0,1.1,0] as const},
  mobile:{travelScale:.6,widthScale:.55},
  pathPoints:[[0,0,0],[0,0,-5],[-3,0,-12],[2,0,-22],[4,0,-31],[-2,0,-41],[0,0,-48]],
  // Root travel eases into a true pause at every reading beat.
  travel:[{start:.235,end:.29,from:0,to:.12},{start:.335,end:.415,from:.12,to:.30},{start:.46,end:.54,from:.30,to:.49},{start:.59,end:.67,from:.49,to:.68},{start:.72,end:.80,from:.68,to:.84},{start:.85,end:.95,from:.84,to:1}],
  final:{avatarRotation:[0,.25,0] as const,desktopCameraOffset:[-2.4,2,8] as const,desktopTargetOffset:[-2.4,1.2,0] as const,mobileCameraOffset:[-.65,3.2,9.5] as const,mobileTargetOffset:[-.65,2.4,0] as const,fov:40},
} as const;
export type StoryAvatarState='IDLE'|'TURNING'|'WALKING'|'STOPPING';
export function storyTravel(p:number){
  let distance=0;
  for(const leg of storyConfig.travel)distance+=(leg.to-leg.from)*travelEase(range(p,leg.start,leg.end));
  return distance;
}
export function storyAvatarState(p:number):StoryAvatarState{
  if(p>=.19&&p<.235)return 'TURNING';
  if(p>=.95&&p<.985)return 'STOPPING';
  for(const leg of storyConfig.travel)if(p>=leg.start&&p<leg.end)return range(p,leg.start,leg.end)>.85?'STOPPING':'WALKING';
  return 'IDLE';
}
