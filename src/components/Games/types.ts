export interface GameProgress {
    completed: boolean;
    score: number;
    stars: number;
    badges: string[];
  }
  
  export interface UserGameData {
    totalStars: number;
    totalBadges: string[];
    gameProgress: {
      [key: string]: GameProgress;
    };
    level: number;
    experience: number;
  }
  
  export interface Badge {
    id: string;
    name: string;
    icon: string;
    description: string;
  }
  
  export interface GameCard {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: 'Safety' | 'Knowledge' | 'Skills' | 'Wellness';
    minAge?: number;
    userType: 'woman' | 'child' | 'both';
  }