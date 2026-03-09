import { useEffect, useRef, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import {
  AuthModal,
  HeroSection,
  HomeFooter,
  IntroFeaturesSection,
  PixelSceneSection,
  SocialSection,
} from '../../components/home';
import { auth } from '../../lib/firebase';
import { getPlayerProfile } from '../../services/player-auth';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const pageRef = useRef<HTMLElement | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);

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

  useEffect(() => {
    let isActive = true;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!isActive) return;

      if (!firebaseUser) {
        setCurrentUserId(null);
        setCurrentUsername(null);
        return;
      }

      setCurrentUserId(firebaseUser.uid);
      const fallbackUsername =
        firebaseUser.displayName?.trim() || firebaseUser.email?.split('@')[0] || 'Joueur';
      setCurrentUsername(fallbackUsername);

      void (async () => {
        try {
          const profile = await getPlayerProfile(firebaseUser.uid);
          if (!isActive) return;
          if (profile?.username) {
            setCurrentUsername(profile.username);
          }
        } catch {
          // fallback username already set from auth data
        }
      })();
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, []);

  const isAuthenticated = Boolean(currentUserId);

  const handleHeroPlayClick = () => {
    if (isAuthenticated) {
      navigate('/play');
      return;
    }
    setIsAuthModalOpen(true);
  };

  const handleHeaderCtaClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
      return;
    }
    setIsAuthModalOpen(true);
  };

  return (
    <main className="home-page" ref={pageRef}>
      <HeroSection
        headerCtaLabel={isAuthenticated ? currentUsername ?? 'Mon profil' : 'Jouer'}
        onHeaderCtaClick={handleHeaderCtaClick}
        onHeroPlayClick={handleHeroPlayClick}
        heroPlayLabel={isAuthenticated ? 'Continuer' : 'Nouvelle Partie'}
      />
      <IntroFeaturesSection />
      <PixelSceneSection />
      <SocialSection />
      <HomeFooter />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </main>
  );
}

export default HomePage;
