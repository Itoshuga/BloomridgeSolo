import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameCanvas from '../../components/game/GameCanvas';
import {
  INPUT_ACTIONS,
  type InputAction,
  buildInputActionBindings,
  createDefaultInputBindings,
  findActionByKeyCode,
  keyCodeToString,
  keyboardEventToKeyCode,
  loadInputActionBindings,
  saveAndBroadcastInputActionBindings,
} from '../../game/input/input-actions';
import { broadcastPauseMenuState } from '../../game/ui/pause-menu-events';
import './PlayPage.css';

const ACTION_ENTRIES = Object.entries(INPUT_ACTIONS) as Array<
  [InputAction, (typeof INPUT_ACTIONS)[InputAction]]
>;

type MenuView = 'main' | 'settings';
type SettingsTab = 'audio' | 'controls' | 'gameplay';

const SETTINGS_TABS: Array<{
  id: SettingsTab;
  label: string;
  description: string;
}> = [
  {
    id: 'audio',
    label: 'Audio',
    description: 'Gestion des volumes et du mixage',
  },
  {
    id: 'controls',
    label: 'Commandes',
    description: 'Raccourcis clavier et rebinding',
  },
  {
    id: 'gameplay',
    label: 'Gameplay',
    description: 'Aides de jeu et confort',
  },
];

function PlayPage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuView, setMenuView] = useState<MenuView>('main');
  const [activeTab, setActiveTab] = useState<SettingsTab>('controls');
  const [capturingAction, setCapturingAction] = useState<InputAction | null>(null);
  const [conflictMessage, setConflictMessage] = useState<string | null>(null);
  const [bindings, setBindings] = useState(() =>
    buildInputActionBindings(loadInputActionBindings()),
  );

  const closeMenu = useCallback(() => {
    setConflictMessage(null);
    setCapturingAction(null);
    setMenuView('main');
    setIsMenuOpen(false);
  }, []);

  const openMenu = useCallback(() => {
    setConflictMessage(null);
    setCapturingAction(null);
    setMenuView('main');
    setIsMenuOpen(true);
  }, []);

  const captureLabel = useMemo(() => {
    if (!capturingAction) return null;
    return INPUT_ACTIONS[capturingAction].label;
  }, [capturingAction]);

  useEffect(() => {
    const handleEscapeMenu = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.repeat) {
        return;
      }

      if (capturingAction) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (!isMenuOpen) {
        openMenu();
        return;
      }

      if (menuView === 'settings') {
        setConflictMessage(null);
        setCapturingAction(null);
        setMenuView('main');
        return;
      }

      closeMenu();
    };

    window.addEventListener('keydown', handleEscapeMenu, true);

    return () => {
      window.removeEventListener('keydown', handleEscapeMenu, true);
    };
  }, [capturingAction, closeMenu, isMenuOpen, menuView, openMenu]);

  useEffect(() => {
    broadcastPauseMenuState(isMenuOpen);
  }, [isMenuOpen]);

  useEffect(() => {
    return () => {
      broadcastPauseMenuState(false);
    };
  }, []);

  useEffect(() => {
    if (!capturingAction || !isMenuOpen || menuView !== 'settings' || activeTab !== 'controls') {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (event.key === 'Escape') {
        setConflictMessage(null);
        setCapturingAction(null);
        return;
      }

      if (event.repeat) {
        return;
      }

      const keyCode = keyboardEventToKeyCode(event);
      if (keyCode === null) {
        return;
      }

      const conflictAction = findActionByKeyCode(bindings, keyCode, capturingAction);
      if (conflictAction) {
        setConflictMessage(
          `La touche ${keyCodeToString(keyCode)} est deja assignee a ${INPUT_ACTIONS[conflictAction].label}.`,
        );
        return;
      }

      const nextBindings = {
        ...bindings,
        [capturingAction]: keyCode,
      };

      setBindings(nextBindings);
      saveAndBroadcastInputActionBindings(nextBindings);
      setConflictMessage(null);
      setCapturingAction(null);
    };

    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [activeTab, bindings, capturingAction, isMenuOpen, menuView]);

  const handleReset = () => {
    const defaultBindings = createDefaultInputBindings();
    setBindings(defaultBindings);
    saveAndBroadcastInputActionBindings(defaultBindings);
    setConflictMessage(null);
    setCapturingAction(null);
  };

  const handleQuitToHome = () => {
    closeMenu();
    navigate('/');
  };

  return (
    <main className="play-page">
      <GameCanvas />

      {isMenuOpen ? (
        <div className="menu-overlay" role="dialog" aria-modal="true" aria-label="Menu pause">
          <section className="ui-panel menu-shell">
            <aside className="menu-shell__aside">
              <p className="menu-shell__eyebrow">Bloomridge</p>
              <h2 className="menu-shell__title">Pause</h2>
              <p className="menu-shell__description">
                Le jeu est en pause. Utilise ce menu pour reprendre, ajuster les parametres ou
                quitter vers l&apos;accueil.
              </p>
              <p className="menu-shell__hint">Raccourci: Echap ouvre et ferme le menu.</p>
            </aside>

            <div className="menu-shell__content">
              {menuView === 'main' ? (
                <>
                  <header className="menu-view__header">
                    <p className="menu-view__kicker">Menu principal</p>
                    <h3>Actions rapides</h3>
                  </header>

                  <div className="menu-actions">
                    <button type="button" className="ui-button ui-button--primary" onClick={closeMenu}>
                      Reprendre
                    </button>
                    <button
                      type="button"
                      className="ui-button"
                      onClick={() => {
                        setConflictMessage(null);
                        setCapturingAction(null);
                        setMenuView('settings');
                      }}
                    >
                      Parametres
                    </button>
                    <button type="button" className="ui-button ui-button--ghost" disabled>
                      Journal (bientot)
                    </button>
                    <button
                      type="button"
                      className="ui-button ui-button--danger"
                      onClick={handleQuitToHome}
                    >
                      Quitter
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <header className="menu-view__header menu-view__header--split">
                    <div>
                      <p className="menu-view__kicker">Parametres</p>
                      <h3>Configuration</h3>
                    </div>
                    <button
                      type="button"
                      className="ui-button ui-button--ghost"
                      onClick={() => {
                        setConflictMessage(null);
                        setCapturingAction(null);
                        setMenuView('main');
                      }}
                    >
                      Retour menu
                    </button>
                  </header>

                  <nav className="ui-tabs" aria-label="Onglets parametres">
                    {SETTINGS_TABS.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        className={`ui-tab ${activeTab === tab.id ? 'ui-tab--active' : ''}`}
                        onClick={() => {
                          setConflictMessage(null);
                          setCapturingAction(null);
                          setActiveTab(tab.id);
                        }}
                      >
                        <span className="ui-tab__label">{tab.label}</span>
                        <span className="ui-tab__description">{tab.description}</span>
                      </button>
                    ))}
                  </nav>

                  <section className="settings-tab-panel">
                    {activeTab === 'audio' ? (
                      <div className="settings-grid">
                        <div className="settings-card">
                          <h4>Volume global</h4>
                          <p>Element UI pret, logique audio a brancher.</p>
                        </div>
                        <div className="settings-card">
                          <h4>Musique</h4>
                          <p>Slot reserve pour le mixage des pistes musicales.</p>
                        </div>
                        <div className="settings-card">
                          <h4>Effets</h4>
                          <p>Slot reserve pour les SFX, ambiance et notifications.</p>
                        </div>
                      </div>
                    ) : null}

                    {activeTab === 'controls' ? (
                      <div className="settings-controls">
                        <p className="settings-panel__hint">
                          Clique sur Modifier puis appuie sur une touche. Echap annule la capture.
                        </p>
                        {conflictMessage ? (
                          <p className="settings-panel__error">{conflictMessage}</p>
                        ) : null}

                        <div className="settings-panel__actions">
                          {ACTION_ENTRIES.map(([action, config]) => {
                            const isCapturing = capturingAction === action;
                            return (
                              <div className="settings-row" key={action}>
                                <span className="settings-row__label">{config.label}</span>
                                <kbd className="settings-row__key">
                                  {isCapturing ? 'Appuie...' : keyCodeToString(bindings[action])}
                                </kbd>
                                <button
                                  type="button"
                                  className="ui-button settings-row__button"
                                  onClick={() => {
                                    setConflictMessage(null);
                                    setCapturingAction(action);
                                  }}
                                >
                                  {isCapturing ? 'En attente' : 'Modifier'}
                                </button>
                              </div>
                            );
                          })}
                        </div>

                        <footer className="settings-panel__footer">
                          <button type="button" className="ui-button ui-button--ghost" onClick={handleReset}>
                            Reinitialiser
                          </button>
                          {captureLabel ? (
                            <span className="settings-panel__capture">
                              Capture en cours: {captureLabel}
                            </span>
                          ) : null}
                        </footer>
                      </div>
                    ) : null}

                    {activeTab === 'gameplay' ? (
                      <div className="settings-grid">
                        <div className="settings-card">
                          <h4>Aides de jeu</h4>
                          <p>Emplacement pour tutoriels, overlays et aides contextuelles.</p>
                        </div>
                        <div className="settings-card">
                          <h4>Camera</h4>
                          <p>Emplacement pour zoom, inertie et confort visuel.</p>
                        </div>
                        <div className="settings-card">
                          <h4>Accessibilite</h4>
                          <p>Emplacement pour options contraste, textes et retours visuels.</p>
                        </div>
                      </div>
                    ) : null}
                  </section>
                </>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}

export default PlayPage;
