import { useEffect, useRef } from 'react';
import {
  HeroSection,
  HomeFooter,
  IntroFeaturesSection,
  PixelSceneSection,
  SocialSection,
} from '../../components/home';
import './HomePage.css';

function HomePage() {
  const pageRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let rafId: number | null = null;

    const syncParallax = () => {
      if (!pageRef.current) return;
      const progress = Math.min(window.scrollY / 900, 1);
      pageRef.current.style.setProperty('--scroll-progress', progress.toFixed(3));
      rafId = null;
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(syncParallax);
    };

    syncParallax();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <main className="home-page" ref={pageRef}>
      <HeroSection />
      <IntroFeaturesSection />
      <PixelSceneSection />
      <SocialSection />
      <HomeFooter />
    </main>
  );
}

export default HomePage;
