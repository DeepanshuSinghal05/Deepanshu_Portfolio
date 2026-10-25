import { forwardRef, useImperativeHandle, useRef } from 'react';
import type { AvatarPose } from '../animation/phaseOneState';
import type { HeroAmbient } from '../animation/heroAmbient';

export interface AvatarVisualHandle {
  update: (pose: AvatarPose, ambient: HeroAmbient, width: number, height: number) => void;
}

/** Replace this adapter with a GLB visual implementing the same pose contract. */
const AvatarVisual = forwardRef<AvatarVisualHandle>(function AvatarVisual(_, ref) {
  const element = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const cage = useRef<SVGSVGElement>(null);

  useImperativeHandle(ref, () => ({
    update(pose, ambient, width, height) {
      if (!element.current || !image.current) return;
      element.current.style.transform = `translate3d(${pose.x * width}px, ${pose.y * height}px, ${pose.z}px) rotateX(${pose.rotateX}deg) rotateY(${pose.rotateY}deg) rotateZ(${pose.rotateZ}deg) scale(${pose.scale})`;
      // Scroll transforms stay on the parent; ambient offsets remain screen-sized.
      image.current.style.transform = `translateY(${ambient.photoY / pose.scale}px)`;
      if (cage.current) cage.current.style.transform = `translateY(${(ambient.photoY + ambient.haloY) / pose.scale}px)`;
    },
  }), []);

  return (
    <div className="avatar-pose" ref={element}>
      <div className="avatar-image-wrap">
        <img
          ref={image}
          className="avatar-image"
          src="/images/deepanshu-avatar.png"
          alt="Deepanshu Singhal wearing glasses and a coral shirt"
          width="295"
          height="426"
          fetchPriority="high"
          decoding="async"
          draggable={false}
        />
      </div>
      <svg ref={cage} className="face-cage-fallback" viewBox="0 0 120 160" fill="none" aria-hidden="true">
        <g stroke="currentColor" strokeWidth=".6">
          <path d="M60 3 96 17 116 58 109 111 84 148 48 158 17 127 3 79 12 34Z" />
          <path d="M60 3 81 38 116 58 79 82 109 111 65 124 84 148M12 34 43 42 60 3M3 79 43 42 79 82 81 38M17 127 37 94 3 79M48 158 65 124 37 94 43 42M37 94 79 82 65 124" />
          <path opacity=".45" d="M12 34 70 22 109 111M17 127 58 141 96 17M3 79 105 67 48 158" />
        </g>
      </svg>
    </div>
  );
});

export const Avatar = forwardRef<AvatarVisualHandle>(function Avatar(_, ref) {
  return <div className="avatar-anchor"><AvatarVisual ref={ref} /></div>;
});
