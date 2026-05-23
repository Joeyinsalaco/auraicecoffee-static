import React from 'react';
import { createRoot } from 'react-dom/client';
import site from './site-data.json';
import './styles.css';

const theme = site.theme || {};
const page = (site.pages || []).find((p) => p.id === site.activePageId) || (site.pages || [])[0];
const flavours = site.flavours || [];

function cssVarStyles() {
  return {
    '--bg': theme.pageBackground || '#F7F1E8',
    '--text': theme.pageText || '#15110E',
    '--muted': theme.mutedText || '#5C5148',
    '--cream': theme.cream || '#FFF9EF',
    '--gold': theme.gold || '#D4AF37',
    '--coffee': theme.coffee || '#7A5C3E',
    '--radius': `${theme.radius || 34}px`,
    '--shadow-size': `${theme.shadow || 34}px`,
    '--header-bg': theme.headerBackground || '#FFF9EF',
    '--header-text': theme.headerText || '#15110E',
    '--button-bg': theme.headerButtonBackground || '#15110E',
    '--button-text': theme.headerButtonText || '#fff',
    '--footer-bg': theme.footerBackground || '#15110E',
    '--footer-text': theme.footerText || '#FFF9EF',
  };
}

function getImageUrl(key) {
  if (!key) return '';
  if (site.customImages?.[key]) return site.customImages[key];
  return '';
}

function Can({ flavour, className = '' }) {
  const id = typeof flavour === 'string' ? flavour : flavour?.id;
  const item = flavours.find((f) => f.id === id) || flavours[0] || {};
  const palette = {
    vanilla: ['#fff3c7', '#d4af37', '#fffaf0'],
    caramel: ['#f2c27b', '#a05f2c', '#fff0d8'],
    mocha: ['#422617', '#120b08', '#e5c19d'],
  }[item.id] || ['#fff3c7', '#d4af37', '#fffaf0'];

  return (
    <div className={`can-wrap ${className}`} style={{ rotate: `${item.rotation || 0}deg` }}>
      <div className="can" style={{ '--can-a': palette[0], '--can-b': palette[1], '--can-c': palette[2] }}>
        <div className="can-top" />
        <div className="can-shine" />
        <div className="can-label">
          <span className="can-number">{item.number || '01'}</span>
          <strong>AURA</strong>
          <small>{item.name || 'Vanilla Gold'}</small>
        </div>
        <div className="can-bottom" />
      </div>
      <div className="can-shadow" />
    </div>
  );
}

function SectionBackground({ section }) {
  const image = getImageUrl(section.bgImage);
  const style = section.bgType === 'image' && image
    ? { backgroundImage: `linear-gradient(rgba(0,0,0,${(section.overlay || 0) / 100}), rgba(0,0,0,${(section.overlay || 0) / 100})), url(${image})` }
    : section.bgType === 'gradient'
      ? { background: `linear-gradient(135deg, ${section.gradientA || section.bgColor}, ${section.gradientB || section.bgColor})` }
      : { background: section.bgColor || 'var(--bg)' };
  return <div className="section-bg" style={style} />;
}

function SectionHeader({ section, light = false }) {
  const titleStyle = section.titleGradient ? {
    backgroundImage: `linear-gradient(100deg, ${section.titleGradientA || 'currentColor'}, ${section.titleGradientB || 'currentColor'})`,
  } : undefined;

  return (
    <div className="section-copy">
      {section.eyebrow && <p className="eyebrow">{section.eyebrow.trim()}</p>}
      {section.title && <h2 className={section.titleGradient ? 'gradient-title' : ''} style={titleStyle}>{section.title}</h2>}
      {section.body && <p className={light ? 'light-body' : ''}>{section.body}</p>}
      {section.button && <a className="primary-btn" href={section.id === 'hero' ? '#flavours' : '#drop'}>{section.button}</a>}
    </div>
  );
}

function HeroSection({ section }) {
  return (
    <section id={section.id} className="section hero-section" style={{ paddingTop: section.paddingTop, paddingBottom: section.paddingBottom }}>
      <SectionBackground section={section} />
      <div className="container split-grid">
        <SectionHeader section={section} />
        <div className="hero-art">
          <div className="glow-orb orb-one" />
          <div className="glow-orb orb-two" />
          <Can flavour={section.image || 'vanilla'} className="hero-can" />
          <div className="floating-card top-card">Cold brew energy</div>
          <div className="floating-card bottom-card">Creamy finish</div>
        </div>
      </div>
    </section>
  );
}

function FlavoursSection({ section }) {
  return (
    <section id={section.id} className="section flavours-section" style={{ paddingTop: section.paddingTop, paddingBottom: section.paddingBottom }}>
      <SectionBackground section={section} />
      <div className="container">
        <SectionHeader section={section} />
        <div className="flavour-grid">
          {flavours.map((flavour) => (
            <article className="flavour-card" key={flavour.id}>
              <Can flavour={flavour} />
              <div>
                <span>{flavour.number}</span>
                <h3>{flavour.name}</h3>
                <p className="tagline">{flavour.tagline}</p>
                <p>{flavour.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CardsSection({ section }) {
  return (
    <section id={section.id} className="section cards-section dark" style={{ paddingTop: section.paddingTop, paddingBottom: section.paddingBottom }}>
      <SectionBackground section={section} />
      <div className="container">
        <SectionHeader section={section} light />
        <div className="card-grid">
          {(section.cards || []).map((card) => (
            <article className="info-card" key={card.id}>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection({ section }) {
  return (
    <section id={section.id} className="section cta-section" style={{ paddingTop: section.paddingTop, paddingBottom: section.paddingBottom }}>
      <SectionBackground section={section} />
      <div className="container centered">
        <SectionHeader section={section} />
        <form className="waitlist" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="Enter your email" aria-label="Email address" />
          <button type="submit">Join</button>
        </form>
      </div>
    </section>
  );
}

function RenderSection({ section }) {
  if (section.type === 'hero') return <HeroSection section={section} />;
  if (section.type === 'flavours') return <FlavoursSection section={section} />;
  if (section.type === 'cards') return <CardsSection section={section} />;
  if (section.type === 'cta') return <CtaSection section={section} />;
  return <CardsSection section={section} />;
}

function Header() {
  return (
    <header className="site-header">
      <a className="logo" href="#hero">{theme.brand || 'AURA'}</a>
      <nav>
        <a href="#flavours">Flavours</a>
        <a href="#about">About</a>
        <a href="#drop">Drop</a>
      </nav>
      <a className="header-btn" href="#drop">Join Waitlist</a>
    </header>
  );
}

function Footer() {
  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <h2>{theme.brand || 'AURA'}</h2>
          <p>{site.footer?.text}</p>
        </div>
        <a className="footer-btn" href="#drop">{site.footer?.button || 'Join Waitlist'}</a>
      </div>
    </footer>
  );
}

function App() {
  return (
    <main style={cssVarStyles()}>
      <Header />
      {(page?.sections || []).map((section) => <RenderSection section={section} key={section.id} />)}
      <Footer />
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
