type Props = { navigate: (progress: number) => void };

export function Navigation({ navigate }: Props) {
  return (
    <header className="navigation">
      <a className="nameplate" href="#opening" onClick={event => { event.preventDefault(); navigate(0); }} aria-label="Deepanshu Singhal, return to opening">
        <span>Deepanshu</span><span>Singhal<span className="nameplate-dot">.</span></span>
      </a>
      <nav className="chapter-navigation" aria-label="Opening chapters">
        <button onClick={() => navigate(0)} data-nav-opening aria-current="step"><span>01</span> Opening</button>
        <span className="nav-divider" aria-hidden="true" />
        <button onClick={() => navigate(1)} data-nav-identity><span>02</span> Identity</button>
        <button onClick={()=>window.dispatchEvent(new CustomEvent('portfolio:navigate',{detail:{section:'work',transition:true}}))}><span>03</span> Projects</button>
      </nav>
      <a className="contact-link" href="#contact" onClick={event=>{event.preventDefault();window.dispatchEvent(new CustomEvent('portfolio:navigate',{detail:{section:'contact',transition:true}}));}}>Let’s talk <span aria-hidden="true">↗</span></a>
    </header>
  );
}
