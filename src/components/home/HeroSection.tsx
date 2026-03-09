import HeroHeader from './HeroHeader';

type HeroSectionProps = {
  headerCtaLabel: string;
  onHeaderCtaClick: () => void;
  onHeroPlayClick: () => void;
  heroPlayLabel: string;
};

function HeroSection({
  headerCtaLabel,
  onHeaderCtaClick,
  onHeroPlayClick,
  heroPlayLabel,
}: HeroSectionProps) {
  return (
    <section className="hero-section" id="home">
      <div className="header-container">
        <HeroHeader ctaLabel={headerCtaLabel} onCtaClick={onHeaderCtaClick} />
      </div>

      <div className="home-container hero-container">
        <div className="hero-layout hero-layout--airy">
          <article className="hero-copy hero-copy--airy">
            <p className="eyebrow">Simulation agricole cozy</p>
            <h1>Cultive ton ile. Developpe ta ferme.</h1>
            <p className="hero-text">Plante, recolte et echange avec d’autres fermiers..</p>

            <div className="hero-award-line">
              <strong>Une nouvelle aventure commence</strong>
              <p className="hero-community-copy">Rejoins les premiers fermiers et batis ton ile.</p>
            </div>

            {/* <div className="hero-signup-line">
              <span className="hero-gem" aria-hidden />
              <span className="hero-signup-code">Signup code = FRIDAY_BONUS</span>
              <span className="hero-signup-timer">(9 hours left)</span>
            </div> */}

            <div className="hero-cta-tags" aria-label="Hero highlights">
              <span className="hero-cta-tag">Cozy Game</span>
              <span className="hero-cta-tag">100 Players</span>
              <span className="hero-cta-tag">Daily Events</span>
            </div>

            <div className="hero-actions">
              <button type="button" className="pixel-button" onClick={onHeroPlayClick}>
                {heroPlayLabel}
              </button>
            </div>

          </article>
            <div className="hero-map-shell">
              <img
                className="hero-map-image"
                src="/assets/map_landing.gif"
                alt="Landing map preview"
                width={860}
                height={540}
                loading="eager"
                decoding="async"
              />

              <div className="hero-map-note">
                <span>*Prices are reflective of last known in-game sale.</span>
              </div>
            </div>
        </div>
      </div>

      <div
        className="wave wave-bottom w-full text-white absolute"
        style={{
          bottom: '0px',
          color: '#fcfdfd',
          backgroundImage: 'url(/cloud-top.png)',
          height: '248px',
          backgroundRepeat: 'repeat-x',
          backgroundSize: '1320px 248px',
          backgroundPosition: 'left bottom',
          imageRendering: 'pixelated',
        }}
        aria-hidden="true"
      />
    </section>
  );
}

export default HeroSection;
