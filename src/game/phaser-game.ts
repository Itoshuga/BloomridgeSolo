import Phaser from 'phaser';
import { buildGameConfig } from './config';

export function createPhaserGame(parent: string | HTMLElement): Phaser.Game {
  const config = buildGameConfig(parent);
  return new Phaser.Game(config);
}

export function destroyPhaserGame(game: Phaser.Game | null | undefined) {
  if (!game) return;
  game.destroy(true);
}