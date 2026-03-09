import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.load.image('player', '../../../assets/player-placeholder.png');
  }

  create() {
    this.scene.start('FarmScene');
  }
}