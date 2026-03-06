import Phaser from 'phaser';
import { InputActionMap } from '../input/input-actions';
import {
  PAUSE_MENU_STATE_CHANGED_EVENT,
  readPauseMenuStateFromEvent,
} from '../ui/pause-menu-events';

export class FarmScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private inputActions!: InputActionMap;
  private isPausedFromMenu = false;

  private readonly worldWidth = 2400;
  private readonly worldHeight = 1800;
  private readonly walkSpeed = 220;
  private readonly runMultiplier = 1.6;
  private readonly handlePauseMenuStateChanged = (event: Event) => {
    const paused = readPauseMenuStateFromEvent(event);
    if (paused === null || paused === this.isPausedFromMenu) {
      return;
    }

    this.isPausedFromMenu = paused;

    if (paused) {
      this.player.setVelocity(0, 0);
      this.physics.world.pause();
      return;
    }

    this.physics.world.resume();
  };

  constructor() {
    super('FarmScene');
  }

  create() {
    this.createWorld();
    this.createPlayer();
    this.createCamera();
    this.createInputs();

    this.scale.on('resize', this.handleResize, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.onSceneShutdown, this);

    if (typeof window !== 'undefined') {
      window.addEventListener(PAUSE_MENU_STATE_CHANGED_EVENT, this.handlePauseMenuStateChanged);
    }
  }

  update() {
    this.handleMovement();
  }

  private onSceneShutdown() {
    this.scale.off('resize', this.handleResize, this);
    this.inputActions?.destroy();
    this.physics.world.resume();

    if (typeof window !== 'undefined') {
      window.removeEventListener(PAUSE_MENU_STATE_CHANGED_EVENT, this.handlePauseMenuStateChanged);
    }
  }

  private createWorld() {
    this.cameras.main.setBackgroundColor('#87c06c');
    this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);

    const graphics = this.add.graphics();

    graphics.fillStyle(0x87c06c, 1);
    graphics.fillRect(0, 0, this.worldWidth, this.worldHeight);

    graphics.fillStyle(0x6b4f2a, 1);
    graphics.fillRect(250, 250, 700, 420);

    graphics.fillStyle(0x4f7f3b, 1);
    graphics.fillRect(1150, 220, 320, 240);
    graphics.fillRect(1600, 500, 360, 300);
    graphics.fillRect(1800, 1100, 260, 260);

    graphics.fillStyle(0xc8a26a, 1);
    graphics.fillRect(300, 820, 920, 90);

    graphics.fillStyle(0xb86f50, 1);
    graphics.fillRect(1500, 1200, 260, 180);

    graphics.lineStyle(6, 0x2e4d25, 1);
    graphics.strokeRect(250, 250, 700, 420);
    graphics.strokeRect(1150, 220, 320, 240);
    graphics.strokeRect(1600, 500, 360, 300);
    graphics.strokeRect(1800, 1100, 260, 260);
  }

  private createPlayer() {
    this.player = this.physics.add.sprite(500, 500, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setScale(2);
    this.player.setDepth(10);
  }

  private createCamera() {
    const camera = this.cameras.main;

    camera.setBounds(0, 0, this.worldWidth, this.worldHeight);
    camera.startFollow(this.player, true, 0.15, 0.15);
    camera.roundPixels = true;
    camera.setZoom(2);
  }

  private createInputs() {
    this.inputActions = new InputActionMap(this);
  }

  private handleMovement() {
    if (this.isPausedFromMenu) {
      this.player.setVelocity(0, 0);
      return;
    }

    let velocityX = 0;
    let velocityY = 0;

    const leftPressed = this.inputActions.isDown('moveLeft');
    const rightPressed = this.inputActions.isDown('moveRight');
    const upPressed = this.inputActions.isDown('moveUp');
    const downPressed = this.inputActions.isDown('moveDown');

    if (leftPressed) velocityX -= 1;
    if (rightPressed) velocityX += 1;
    if (upPressed) velocityY -= 1;
    if (downPressed) velocityY += 1;

    const direction = new Phaser.Math.Vector2(velocityX, velocityY);
    const isRunning = this.inputActions.isDown('run');
    const speed = this.walkSpeed * (isRunning ? this.runMultiplier : 1);

    if (direction.lengthSq() > 0) {
      direction.normalize().scale(speed);
    }

    this.player.setVelocity(direction.x, direction.y);

    if (direction.x < 0) {
      this.player.setFlipX(true);
    } else if (direction.x > 0) {
      this.player.setFlipX(false);
    }
  }

  private handleResize(gameSize: Phaser.Structs.Size) {
    const camera = this.cameras.main;
    camera.setSize(gameSize.width, gameSize.height);
  }
}
