function HomeFooter() {
  return (
    <footer className="home-footer">
      <div className="home-container footer-layout">
        <div className="footer-brand">
          <img src="/landing/logo-bloomridge.svg" alt="" width={30} height={30} />
          <span>Bloomridge</span>
        </div>
        <nav aria-label="Footer links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#social">Community</a>
          <a href="/play">Play</a>
        </nav>
        <div className="footer-meta">
          <a href="#home">Terms</a>
          <a href="#home">Privacy</a>
          <span>Copyright 2026 Bloomridge Studio</span>
        </div>
      </div>
    </footer>
  );
}

export default HomeFooter;
