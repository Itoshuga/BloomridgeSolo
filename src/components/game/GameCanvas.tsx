import { useEffect, useRef } from 'react';
import { createPhaserGame, destroyPhaserGame } from '../../game/phaser-game';

function GameCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const game = createPhaserGame(containerRef.current);

    return () => {
      destroyPhaserGame(game);
    };
  }, []);

  return <div ref={containerRef} id="game-container" className="game-container" />;
}

export default GameCanvas;