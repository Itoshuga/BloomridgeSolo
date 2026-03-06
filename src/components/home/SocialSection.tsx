const COMMUNITY_LINKS = [
  { id: 'twitter', label: 'Twitter', href: 'https://twitter.com' },
  { id: 'discord', label: 'Discord', href: 'https://discord.com' },
  { id: 'github', label: 'GitHub', href: 'https://github.com' },
];

function SocialSection() {
  return (
    <section className="section section--social" id="social">
      <div className="home-container social-footer">
        <article className="social-footer__intro">
          <h2>Bloomridge Community</h2>
          <p>Reste connecte a la vie du village, aux mises a jour et aux evenements de saison.</p>
        </article>

        <div className="social-footer__columns">
          <section className="social-footer__column" aria-label="Reseaux de la communaute">
            <h3>Communaute</h3>
            <ul>
              {COMMUNITY_LINKS.map((link) => (
                <li key={link.id}>
                  <a href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="social-footer__column" aria-label="Email signup">
            <h3>Newsletter</h3>
            <p>Un recap simple des patch notes et de la roadmap.</p>
            <form action="#" method="post">
              <label htmlFor="social-email">Email</label>
              <div className="social-footer__signup-row">
                <input
                  id="social-email"
                  name="email"
                  type="email"
                  placeholder="farmer@bloomridge.gg"
                />
                <button type="submit" className="btn btn--primary btn--small">
                  Recevoir
                </button>
              </div>
            </form>
          </section>
        </div>

        <div className="social-footer__meta">
          <span>Copyright 2026 Bloomridge Studio</span>
          <div className="social-footer__legal">
            <a href="#home">Terms</a>
            <a href="#home">Privacy</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SocialSection;
