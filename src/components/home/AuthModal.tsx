import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { getAuthErrorMessage, loginPlayer, registerPlayer } from '../../services/player-auth';

type AuthMode = 'signup' | 'login';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('signup');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const title = useMemo(
    () => (mode === 'signup' ? 'Inscription' : 'Connexion'),
    [mode],
  );

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    setErrorMessage('');
  }, [mode]);

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setErrorMessage('');
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Email et mot de passe sont requis.');
      return;
    }

    if (mode === 'signup' && !username.trim()) {
      setErrorMessage('Le pseudo est requis.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      if (mode === 'signup') {
        await registerPlayer({ username, email, password });
      } else {
        await loginPlayer({ email, password });
      }
      resetForm();
      onClose();
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="auth-modal-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section className="auth-modal pixel-card" role="dialog" aria-modal="true" aria-label={title}>
        <header className="auth-modal__header">
          <h2>{title}</h2>
          <button type="button" className="auth-modal__close" onClick={onClose} aria-label="Fermer">
            x
          </button>
        </header>

        <div className="auth-modal__tabs" role="tablist" aria-label="Choix authentification">
          <button
            type="button"
            className={`auth-modal__tab ${mode === 'signup' ? 'is-active' : ''}`}
            onClick={() => setMode('signup')}
          >
            Inscription
          </button>
          <button
            type="button"
            className={`auth-modal__tab ${mode === 'login' ? 'is-active' : ''}`}
            onClick={() => setMode('login')}
          >
            Connexion
          </button>
        </div>

        <form className="auth-modal__form" onSubmit={onSubmit}>
          {mode === 'signup' ? (
            <label>
              Username
              <input
                type="text"
                name="username"
                autoComplete="nickname"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                disabled={isSubmitting}
                placeholder="Ton pseudo"
              />
            </label>
          ) : null}

          <label>
            Email
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
              placeholder="farmer@bloomridge.gg"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isSubmitting}
              placeholder="********"
            />
          </label>

          {errorMessage ? <p className="auth-modal__error">{errorMessage}</p> : null}

          <button type="submit" className="pixel-button auth-modal__submit" disabled={isSubmitting}>
            {isSubmitting ? 'Patiente...' : mode === 'signup' ? 'Creer un compte' : 'Se connecter'}
          </button>
        </form>
      </section>
    </div>
  );
}

export default AuthModal;
