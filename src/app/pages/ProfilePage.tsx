import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeroHeader from '../../components/home/HeroHeader';
import { auth } from '../../lib/firebase';
import { getPlayerProfile, type PlayerProfile } from '../../services/player-auth';
import './ProfilePage.css';

const ROLE_LABELS: Record<number, string> = {
  0: 'User',
  1: 'VIP',
  2: 'Moderator',
  3: 'Administrator',
};

function ProfilePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);

  useEffect(() => {
    let isActive = true;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!isActive) return;

      if (!firebaseUser) {
        navigate('/', { replace: true });
        return;
      }

      void (async () => {
        try {
          const playerProfile = await getPlayerProfile(firebaseUser.uid);
          if (!isActive) return;

          if (playerProfile) {
            setProfile(playerProfile);
          } else {
            setProfile({
              uid: firebaseUser.uid,
              username: firebaseUser.displayName?.trim() || 'Joueur',
              email: firebaseUser.email || '',
              mail: firebaseUser.email || '',
              role: 0,
              level: 1,
              experience: 0,
              coins: 0,
              energy: 100,
            });
          }
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      })();
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [navigate]);

  const roleLabel = useMemo(() => {
    if (!profile) return 'User';
    return ROLE_LABELS[profile.role] ?? 'User';
  }, [profile]);

  const progression = useMemo(() => {
    if (!profile) {
      return { currentXp: 0, xpToNext: 100, progressPercent: 0 };
    }
    const xpToNext = Math.max(100, profile.level * 100);
    const currentXp = Math.max(0, profile.experience % xpToNext);
    const progressPercent = Math.min(100, (currentXp / xpToNext) * 100);
    return { currentXp, xpToNext, progressPercent };
  }, [profile]);

  if (isLoading) {
    return (
      <main className="profile-page">
        <section className="profile-shell">
          <div className="profile-header-wrap profile-card">
            <HeroHeader ctaLabel="..." onCtaClick={() => navigate('/play')} />
          </div>
          <section className="profile-card profile-loading-card">
            <p>Chargement du profil joueur...</p>
          </section>
        </section>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="profile-page">
        <section className="profile-shell">
          <div className="profile-header-wrap profile-card">
            <HeroHeader ctaLabel="Jouer" onCtaClick={() => navigate('/play')} />
          </div>
          <section className="profile-card profile-loading-card">
            <p>Profil indisponible.</p>
            <Link to="/" className="profile-link">
              Retour accueil
            </Link>
          </section>
        </section>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <section className="profile-shell">
        <div className="profile-header-wrap profile-card">
          <HeroHeader ctaLabel={profile.username} onCtaClick={() => navigate('/play')} />
        </div>

        <section className="profile-banner profile-card">
          <p className="profile-kicker">Journal de ferme</p>
          <h1>Bienvenue sur ton tableau de bord, {profile.username}</h1>
          <p>
            Suis ta progression, gere ton domaine et repars directement en jeu pour faire evoluer
            ta ferme.
          </p>
        </section>

        <section className="profile-hero profile-card">
          <article className="profile-hero__identity">
            <p className="profile-kicker">Fiche fermier</p>
            <h2>{profile.username}</h2>
            <p>{profile.email}</p>

            <div className="profile-role-badge">
              <span>Role</span>
              <strong>{roleLabel}</strong>
            </div>

            <ul className="profile-status-list">
              <li>{profile.flags?.tutorialCompleted ? 'Tutoriel termine' : 'Tutoriel en cours'}</li>
              <li>{profile.flags?.emailVerified ? 'Email verifie' : 'Email non verifie'}</li>
              <li>{profile.flags?.newsletterOptIn ? 'Newsletter activee' : 'Newsletter desactivee'}</li>
            </ul>
          </article>

          <figure className="profile-hero__art" aria-label="Apercu de la ferme">
            <img
              src="/assets/map_landing.gif"
              alt="Apercu de la carte de ferme"
              width={860}
              height={540}
              loading="eager"
              decoding="async"
            />
            <figcaption>Terrain actuel: {profile.farm?.name ?? 'Starter Farm'}</figcaption>
          </figure>
        </section>

        <section className="profile-panel-grid">
          <article className="profile-card profile-panel">
            <header className="profile-panel__header">
              <p className="profile-kicker">Progression</p>
              <h2>Etat du joueur</h2>
            </header>

            <div className="profile-stat-grid">
              <div className="profile-stat-card">
                <span>Level</span>
                <strong>{profile.level}</strong>
              </div>
              <div className="profile-stat-card">
                <span>Coins</span>
                <strong>{profile.coins}</strong>
              </div>
              <div className="profile-stat-card">
                <span>Energy</span>
                <strong>{profile.energy}</strong>
              </div>
              <div className="profile-stat-card">
                <span>XP</span>
                <strong>
                  {progression.currentXp}/{progression.xpToNext}
                </strong>
              </div>
            </div>

            <div className="profile-progress">
              <div
                className="profile-progress__fill"
                style={{ width: `${progression.progressPercent.toFixed(1)}%` }}
              />
            </div>
            <p className="profile-progress__copy">
              {Math.round(progression.progressPercent)}% vers le prochain niveau
            </p>
          </article>

          <article className="profile-card profile-panel">
            <header className="profile-panel__header">
              <p className="profile-kicker">Domaine</p>
              <h2>Ferme et inventaire</h2>
            </header>

            <dl className="profile-detail-list">
              <div>
                <dt>Nom de la ferme</dt>
                <dd>{profile.farm?.name ?? 'Starter Farm'}</dd>
              </div>
              <div>
                <dt>Tier de ferme</dt>
                <dd>{profile.farm?.tier ?? 1}</dd>
              </div>
              <div>
                <dt>Parcelles debloquees</dt>
                <dd>{profile.farm?.tilesUnlocked ?? 12}</dd>
              </div>
              <div>
                <dt>Role numerique</dt>
                <dd>{profile.role}</dd>
              </div>
            </dl>
          </article>
        </section>

        <section className="profile-card profile-account-panel">
          <header className="profile-panel__header">
            <p className="profile-kicker">Compte</p>
            <h2>Informations techniques</h2>
          </header>
          <dl className="profile-detail-list profile-detail-list--account">
            <div>
              <dt>UID</dt>
              <dd>{profile.uid}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{profile.email}</dd>
            </div>
            <div>
              <dt>Mail alias</dt>
              <dd>{profile.mail}</dd>
            </div>
          </dl>
        </section>

        <footer className="profile-footer">
          <Link to="/play" className="profile-link profile-link--primary">
            Continuer la partie
          </Link>
          <Link to="/" className="profile-link">
            Retour accueil
          </Link>
        </footer>
      </section>
    </main>
  );
}

export default ProfilePage;
