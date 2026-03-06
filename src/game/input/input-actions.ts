import Phaser from 'phaser';

type InputActionDefinition = {
  label: string;
  defaultKey: number;
};

// Add new actions here. Defaults, persistence and rebinding are generated automatically.
export const INPUT_ACTIONS = {
  moveUp: {
    label: 'Deplacement haut',
    defaultKey: Phaser.Input.Keyboard.KeyCodes.Z,
  },
  moveDown: {
    label: 'Deplacement bas',
    defaultKey: Phaser.Input.Keyboard.KeyCodes.S,
  },
  moveLeft: {
    label: 'Deplacement gauche',
    defaultKey: Phaser.Input.Keyboard.KeyCodes.Q,
  },
  moveRight: {
    label: 'Deplacement droite',
    defaultKey: Phaser.Input.Keyboard.KeyCodes.D,
  },
  run: {
    label: 'Course',
    defaultKey: Phaser.Input.Keyboard.KeyCodes.SHIFT,
  },
} as const satisfies Record<string, InputActionDefinition>;

export type InputAction = keyof typeof INPUT_ACTIONS;
export type InputActionBindings = Record<InputAction, number>;

const DEFAULT_INPUT_ACTION_STORAGE_KEY = 'bloomridge.input-actions.v1';
const INPUT_ACTION_NAMES = Object.keys(INPUT_ACTIONS) as InputAction[];
const KEY_NAME_BY_CODE = buildKeyNameMap();
const KEY_CODES = Phaser.Input.Keyboard.KeyCodes as unknown as Record<string, number>;

type InputActionBindingsUpdatedEventDetail = {
  storageKey: string;
  bindings: Partial<InputActionBindings>;
};

export const INPUT_ACTION_BINDINGS_UPDATED_EVENT = 'bloomridge:input-actions-updated';

function buildKeyNameMap(): Record<number, string> {
  const keyNames: Record<number, string> = {};

  for (const [name, code] of Object.entries(Phaser.Input.Keyboard.KeyCodes)) {
    if (typeof code !== 'number') continue;
    if (keyNames[code] === undefined) {
      keyNames[code] = name;
    }
  }

  return keyNames;
}

export function createDefaultInputBindings(): InputActionBindings {
  const defaults = {} as InputActionBindings;

  for (const action of INPUT_ACTION_NAMES) {
    defaults[action] = INPUT_ACTIONS[action].defaultKey;
  }

  return defaults;
}

export const DEFAULT_INPUT_ACTION_BINDINGS = createDefaultInputBindings();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isValidKeyCode(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function findActionByKeyCode(
  bindings: Partial<InputActionBindings>,
  keyCode: number,
  excludedAction?: InputAction,
): InputAction | null {
  for (const action of INPUT_ACTION_NAMES) {
    if (action === excludedAction) {
      continue;
    }

    if (bindings[action] === keyCode) {
      return action;
    }
  }

  return null;
}

function normalizeInputActionBindings(rawBindings: unknown): Partial<InputActionBindings> {
  if (!isRecord(rawBindings)) {
    return {};
  }

  const bindings: Partial<InputActionBindings> = {};

  for (const action of INPUT_ACTION_NAMES) {
    const keyCode = rawBindings[action];
    if (isValidKeyCode(keyCode)) {
      bindings[action] = keyCode;
    }
  }

  return bindings;
}

export function buildInputActionBindings(
  overrides: Partial<InputActionBindings> = {},
): InputActionBindings {
  const bindings = createDefaultInputBindings();

  for (const action of INPUT_ACTION_NAMES) {
    const keyCode = overrides[action];
    if (!isValidKeyCode(keyCode)) {
      continue;
    }

    const conflict = findActionByKeyCode(bindings, keyCode, action);
    if (conflict) {
      continue;
    }

    bindings[action] = keyCode;
  }

  return bindings;
}

export function loadInputActionBindings(
  storageKey = DEFAULT_INPUT_ACTION_STORAGE_KEY,
): Partial<InputActionBindings> {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const rawBindings = window.localStorage.getItem(storageKey);
    if (!rawBindings) {
      return {};
    }

    const parsedBindings: unknown = JSON.parse(rawBindings);
    return normalizeInputActionBindings(parsedBindings);
  } catch {
    return {};
  }
}

export function saveInputActionBindings(
  bindings: InputActionBindings,
  storageKey = DEFAULT_INPUT_ACTION_STORAGE_KEY,
): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(bindings));
  } catch {
    // Ignore storage quota / privacy mode errors.
  }
}

export function broadcastInputActionBindingsUpdated(
  bindings: Partial<InputActionBindings>,
  storageKey = DEFAULT_INPUT_ACTION_STORAGE_KEY,
): void {
  if (typeof window === 'undefined') {
    return;
  }

  const eventDetail: InputActionBindingsUpdatedEventDetail = {
    storageKey,
    bindings,
  };

  window.dispatchEvent(
    new CustomEvent<InputActionBindingsUpdatedEventDetail>(INPUT_ACTION_BINDINGS_UPDATED_EVENT, {
      detail: eventDetail,
    }),
  );
}

export function saveAndBroadcastInputActionBindings(
  bindings: InputActionBindings,
  storageKey = DEFAULT_INPUT_ACTION_STORAGE_KEY,
): void {
  saveInputActionBindings(bindings, storageKey);
  broadcastInputActionBindingsUpdated(bindings, storageKey);
}

export function clearInputActionBindings(storageKey = DEFAULT_INPUT_ACTION_STORAGE_KEY): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(storageKey);
  } catch {
    // Ignore storage errors.
  }
}

export function getInputActionLabel(action: InputAction): string {
  return INPUT_ACTIONS[action].label;
}

export function keyCodeToString(keyCode: number): string {
  return KEY_NAME_BY_CODE[keyCode] ?? `KeyCode(${keyCode})`;
}

const CODE_TO_KEY_CODE_MAP: Record<string, number> = {
  ShiftLeft: Phaser.Input.Keyboard.KeyCodes.SHIFT,
  ShiftRight: Phaser.Input.Keyboard.KeyCodes.SHIFT,
  ControlLeft: Phaser.Input.Keyboard.KeyCodes.CTRL,
  ControlRight: Phaser.Input.Keyboard.KeyCodes.CTRL,
  AltLeft: Phaser.Input.Keyboard.KeyCodes.ALT,
  AltRight: Phaser.Input.Keyboard.KeyCodes.ALT,
  Space: Phaser.Input.Keyboard.KeyCodes.SPACE,
  Enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
  Escape: Phaser.Input.Keyboard.KeyCodes.ESC,
  ArrowUp: Phaser.Input.Keyboard.KeyCodes.UP,
  ArrowDown: Phaser.Input.Keyboard.KeyCodes.DOWN,
  ArrowLeft: Phaser.Input.Keyboard.KeyCodes.LEFT,
  ArrowRight: Phaser.Input.Keyboard.KeyCodes.RIGHT,
  Tab: Phaser.Input.Keyboard.KeyCodes.TAB,
  Backspace: Phaser.Input.Keyboard.KeyCodes.BACKSPACE,
  Delete: Phaser.Input.Keyboard.KeyCodes.DELETE,
};

const DIGIT_TO_KEY_NAME: Record<string, string> = {
  '0': 'ZERO',
  '1': 'ONE',
  '2': 'TWO',
  '3': 'THREE',
  '4': 'FOUR',
  '5': 'FIVE',
  '6': 'SIX',
  '7': 'SEVEN',
  '8': 'EIGHT',
  '9': 'NINE',
};

export function keyboardEventToKeyCode(event: KeyboardEvent): number | null {
  if (typeof event.keyCode === 'number' && event.keyCode > 0) {
    return event.keyCode;
  }

  const mappedByCode = CODE_TO_KEY_CODE_MAP[event.code];
  if (typeof mappedByCode === 'number') {
    return mappedByCode;
  }

  if (event.code.startsWith('Key')) {
    const keyName = event.code.slice(3).toUpperCase();
    const keyCode = KEY_CODES[keyName];
    if (typeof keyCode === 'number') {
      return keyCode;
    }
  }

  if (event.code.startsWith('Digit')) {
    const digit = event.code.slice(5);
    const keyName = DIGIT_TO_KEY_NAME[digit];
    if (keyName) {
      const keyCode = KEY_CODES[keyName];
      if (typeof keyCode === 'number') {
        return keyCode;
      }
    }
  }

  return null;
}

type InputActionMapOptions = {
  storageKey?: string;
  persist?: boolean;
  bindings?: Partial<InputActionBindings>;
};

type SetBindingOptions = {
  persist?: boolean;
};

export class InputActionMap {
  private readonly keyboard: Phaser.Input.Keyboard.KeyboardPlugin;
  private readonly storageKey: string;
  private readonly persistBindings: boolean;
  private readonly keysByAction = new Map<InputAction, Phaser.Input.Keyboard.Key>();
  private bindings: InputActionBindings;
  private readonly handleExternalBindingsUpdate = (event: Event) => {
    const customEvent = event as CustomEvent<InputActionBindingsUpdatedEventDetail>;
    const detail = customEvent.detail;

    if (!detail || detail.storageKey !== this.storageKey) {
      return;
    }

    const normalizedBindings = normalizeInputActionBindings(detail.bindings);
    this.setBindings(normalizedBindings, { persist: false });
  };

  constructor(scene: Phaser.Scene, options: InputActionMapOptions = {}) {
    const keyboard = scene.input.keyboard;
    if (!keyboard) {
      throw new Error('Keyboard input is not available in this scene.');
    }

    this.keyboard = keyboard;
    this.storageKey = options.storageKey ?? DEFAULT_INPUT_ACTION_STORAGE_KEY;
    this.persistBindings = options.persist ?? true;

    const persistedBindings = this.persistBindings ? loadInputActionBindings(this.storageKey) : {};
    this.bindings = buildInputActionBindings({
      ...persistedBindings,
      ...options.bindings,
    });

    this.registerKeys();

    if (this.persistBindings) {
      saveInputActionBindings(this.bindings, this.storageKey);
    }

    if (typeof window !== 'undefined') {
      window.addEventListener(INPUT_ACTION_BINDINGS_UPDATED_EVENT, this.handleExternalBindingsUpdate);
    }
  }

  destroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener(INPUT_ACTION_BINDINGS_UPDATED_EVENT, this.handleExternalBindingsUpdate);
    }

    for (const key of this.keysByAction.values()) {
      this.keyboard.removeKey(key, true);
    }

    this.keysByAction.clear();
  }

  isDown(action: InputAction): boolean {
    return this.keysByAction.get(action)?.isDown ?? false;
  }

  getBinding(action: InputAction): number {
    return this.bindings[action];
  }

  getBindings(): InputActionBindings {
    return { ...this.bindings };
  }

  setBinding(action: InputAction, keyCode: number, options: SetBindingOptions = {}): boolean {
    const conflict = findActionByKeyCode(this.bindings, keyCode, action);
    if (conflict) {
      return false;
    }

    const existingKey = this.keysByAction.get(action);

    if (existingKey) {
      this.keyboard.removeKey(existingKey, true);
    }

    this.bindings[action] = keyCode;
    this.keysByAction.set(action, this.keyboard.addKey(keyCode));

    if ((options.persist ?? true) && this.persistBindings) {
      saveInputActionBindings(this.bindings, this.storageKey);
    }

    return true;
  }

  setBindings(bindings: Partial<InputActionBindings>, options: SetBindingOptions = {}) {
    for (const action of INPUT_ACTION_NAMES) {
      const keyCode = bindings[action];
      if (!isValidKeyCode(keyCode)) {
        continue;
      }

      this.setBinding(action, keyCode, { persist: false });
    }

    if ((options.persist ?? true) && this.persistBindings) {
      saveInputActionBindings(this.bindings, this.storageKey);
    }
  }

  resetToDefaults(options: SetBindingOptions = {}) {
    this.setBindings(DEFAULT_INPUT_ACTION_BINDINGS, options);
  }

  private registerKeys() {
    for (const action of INPUT_ACTION_NAMES) {
      this.keysByAction.set(action, this.keyboard.addKey(this.bindings[action]));
    }
  }
}
