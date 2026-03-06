import { Link } from 'react-router-dom';

function HeroHeader() {
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

        <Link to="/play" className="pixel-button">
          Play now
        </Link>
      </div>
    </header>
  );
}

export default HeroHeader;
