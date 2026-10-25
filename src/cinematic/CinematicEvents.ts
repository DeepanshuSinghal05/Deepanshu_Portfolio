/** Opt-in future audio hook. No audio is loaded or played by this module. */
import { cinematicConfig as C } from './config';
export const cinematicEvents = new EventTarget();
const cues = { acceleration: .4, contact: C.timing.impact[0], fracture: C.timing.fracture[0], shatter: C.timing.breakthrough[0], landing: C.timing.landing[1] };
export function emitCinematicCrossings(previous: number, current: number) {
  if (previous < 0 || previous === current) return;
  for (const [cue, progress] of Object.entries(cues)) {
    if ((previous < progress && current >= progress) || (previous >= progress && current < progress)) {
      cinematicEvents.dispatchEvent(new CustomEvent('cue', { detail: { cue, direction: current > previous ? 'forward' : 'reverse', progress, seek: Math.abs(current-previous) > .1 } }));
    }
  }
}
