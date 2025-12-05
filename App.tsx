import React, { useState, useEffect } from 'react';
import { CRTWrapper } from './components/CRTWrapper';
import { SafeRoom } from './features/SafeRoom';
import { BreathingMinigame } from './features/BreathingMinigame';
import { GroundingTerminal } from './features/GroundingTerminal';
import { RetroButton } from './components/RetroButton';
import { GameState, Scene } from './types';

const INITIAL_STATE: GameState = {
  scene: 'BOOT',
  xp: 0,
  level: 1,
  unlockedItems: [],
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [bootSequence, setBootSequence] = useState(0);

  // Fake Boot Sequence Effect
  useEffect(() => {
    if (gameState.scene === 'BOOT') {
      const timer = setInterval(() => {
        setBootSequence(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => setGameState(prev => ({ ...prev, scene: 'ROOM' })), 1000);
            return 100;
          }
          return prev + 2; // Speed of boot
        });
      }, 50);
      return () => clearInterval(timer);
    }
  }, [gameState.scene]);

  const handleNavigate = (scene: Scene) => {
    setGameState(prev => ({ ...prev, scene }));
  };

  const addXp = (amount: number) => {
    setGameState(prev => {
      const newXp = prev.xp + amount;
      const levelUp = newXp >= 100;
      return {
        ...prev,
        xp: levelUp ? newXp - 100 : newXp,
        level: levelUp ? prev.level + 1 : prev.level,
      };
    });
  };

  const renderContent = () => {
    switch (gameState.scene) {
      case 'BOOT':
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <h1 className="text-6xl text-white animate-pulse">PixelPeace</h1>
            <div className="w-64 h-4 bg-gray-700 border border-white p-1">
              <div 
                className="h-full bg-green-500 transition-all duration-100 ease-linear" 
                style={{ width: `${bootSequence}%` }}
              />
            </div>
            <p className="text-green-400">LOADING SERENITY DRIVERS... {bootSequence}%</p>
          </div>
        );
      case 'ROOM':
        return <SafeRoom gameState={gameState} onNavigate={handleNavigate} />;
      case 'BREATHE':
        return (
          <div className="h-full flex flex-col">
             <div className="flex justify-start p-4">
                <RetroButton onClick={() => handleNavigate('ROOM')} variant="danger" className="text-sm">{'<'} Back</RetroButton>
             </div>
             <BreathingMinigame onComplete={() => {
               addXp(30);
               handleNavigate('ROOM');
             }} />
          </div>
        );
      case 'TERMINAL':
        return (
          <div className="h-full flex flex-col p-4">
            <GroundingTerminal onBack={() => handleNavigate('ROOM')} addXp={addXp} />
          </div>
        );
      default:
        return <div>Error: Scene not found</div>;
    }
  };

  return (
    <CRTWrapper>
      {renderContent()}
    </CRTWrapper>
  );
}
