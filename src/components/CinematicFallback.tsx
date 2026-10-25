/** Still-camera interpretation for reduced motion and unavailable WebGL. */
export function CinematicFallback() {
  return <div className="cinematic-fallback" aria-hidden="true">
    <svg viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice">
      <defs><linearGradient id="floor-tone" x2="0" y2="1"><stop stopColor="#30373b"/><stop offset="1" stopColor="#151a20"/></linearGradient></defs>
      <g data-fallback-shaft fill="none" stroke="#b59c75" strokeOpacity=".25">
        <path d="M150 0V700M350 0V700M650 0V700M850 0V700M150 80H850M150 220H850M150 360H850M150 500H850M150 640H850"/>
      </g>
      <g data-fallback-glass><path d="M150 470 500 400 850 470 500 545Z" fill="#c6d0d0" fillOpacity=".12" stroke="#c6d0d0" strokeOpacity=".35"/>
        <path data-fallback-cracks d="M500 470 452 445 360 438M500 470 550 435 600 422M500 470 610 475 738 494M500 470 465 499 420 529M500 470 525 507 545 535" fill="none" stroke="#e2bd82" strokeWidth="1"/>
      </g>
      <g data-fallback-shards fill="#c6d0d0" fillOpacity=".18" stroke="#e2bd82" strokeOpacity=".35"><path d="M300 450 350 425 330 490Z M620 420 685 450 670 470Z M370 530 420 500 410 560Z M710 520 735 470 765 550Z"/></g>
      <g data-fallback-floor><path d="M0 475H1000V700H0Z" fill="url(#floor-tone)"/>
        <path d="M650 220V475M850 220V475M650 220H850M100 467H900M180 400V467M900 350V467" fill="none" stroke="#647472" strokeOpacity=".16"/>
        <path d="M0 580H1000M740 700 665 475M300 700 430 475" fill="none" stroke="#778581" strokeOpacity=".1"/>
      </g>
      <g data-fallback-proxy fill="#b9b4aa" stroke="#151a20" strokeWidth="2">
        <circle cx="500" cy="302" r="21"/><rect x="471" y="326" width="58" height="87" rx="25"/><rect x="449" y="335" width="17" height="80" rx="8"/><rect x="534" y="335" width="17" height="80" rx="8"/><rect x="475" y="412" width="20" height="82" rx="9"/><rect x="505" y="412" width="20" height="82" rx="9"/><path d="M474 490h22v14h-25v-7ZM504 490h22v14h-25v-7Z" fill="#676b6a"/>
      </g>
    </svg>
  </div>;
}
