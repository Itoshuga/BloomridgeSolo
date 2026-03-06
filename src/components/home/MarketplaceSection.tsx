import { MARKET_ITEMS } from './home-data';

function MarketplaceSection() {
  return (
    <section className="section section--shop" id="marketplace">
      <div className="home-container">
        <header className="section-header">
          <p className="eyebrow">MARKETPLACE</p>
          <h2>Trade seeds, tools and crafted goods with a game-ready store UI.</h2>
        </header>

        <div className="market-grid">
          {MARKET_ITEMS.map((item) => (
            <article className="pixel-card market-card" key={item.id}>
              <img
                src={item.image}
                alt={`${item.title} pixel-art icon`}
                width={112}
                height={112}
                loading="lazy"
                decoding="async"
              />
              <h3>{item.title}</h3>
              <p className="market-price">{item.price}</p>
              <button type="button" className="btn btn--primary btn--small">
                {item.cta}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MarketplaceSection;
