export type Scene = 'BOOT' | 'ROOM' | 'BREATHE' | 'TERMINAL' | 'JOURNAL';

export interface GameState {
  scene: Scene;
  xp: number;
  level: number;
  unlockedItems: string[];
}

export interface ChatMessage {
  role: 'user' | 'system' | 'model';
  text: string;
}
