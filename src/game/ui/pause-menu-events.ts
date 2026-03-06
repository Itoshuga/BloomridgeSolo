export const PAUSE_MENU_STATE_CHANGED_EVENT = 'bloomridge:pause-menu-state-changed';

type PauseMenuStateEventDetail = {
  paused: boolean;
};

export function broadcastPauseMenuState(paused: boolean): void {
  if (typeof window === 'undefined') {
    return;
  }

  const detail: PauseMenuStateEventDetail = { paused };

  window.dispatchEvent(
    new CustomEvent<PauseMenuStateEventDetail>(PAUSE_MENU_STATE_CHANGED_EVENT, {
      detail,
    }),
  );
}

export function readPauseMenuStateFromEvent(event: Event): boolean | null {
  const customEvent = event as CustomEvent<PauseMenuStateEventDetail>;
  const paused = customEvent.detail?.paused;

  if (typeof paused !== 'boolean') {
    return null;
  }

  return paused;
}
