import { Link } from 'react-router-dom';

type HeroHeaderProps = {
  ctaLabel: string;
  onCtaClick: () => void;
};

function HeroHeader({ ctaLabel, onCtaClick }: HeroHeaderProps) {
  return (
    <header className="home-header">
      <div className="home-container home-header__container">
        <Link to="/" className="home-header__brand" aria-label="Bloomridge home">
          <img src="/assets/ui/ui_logo.png" alt="" />
        </Link>

        <nav className="home-header__nav" aria-label="Main">
          <a href="#features">
            <span>Features</span>
            <i className="home-header__icon home-header__icon--flower" aria-hidden />
          </a>
          <a href="#collection">
            <span>Collections</span>
            <i className="home-header__icon home-header__icon--jobs" aria-hidden />
          </a>
          <a href="#marketplace">
            <span>Marketplace</span>
            <i className="home-header__icon home-header__icon--docs" aria-hidden />
          </a>
        </nav>

        <button type="button" className="pixel-button home-header__cta" onClick={onCtaClick}>
          {ctaLabel}
        </button>
      </div>
    </header>
  );
}

export default HeroHeader;
