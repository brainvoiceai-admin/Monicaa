
export enum AppScreen {
  REPORT = 'REPORT',
  SCAN = 'SCAN',
  ROUTINE = 'ROUTINE',
  STATS = 'STATS',
  CONNECT = 'CONNECT'
}

export interface SkinMetric {
  label: string;
  value: number;
  unit: string;
  trend: string;
  status: string;
}

export interface RoutineStep {
  id: string;
  step: number;
  name: string;
  description: string;
  image: string;
  completed: boolean;
  type: 'AM' | 'PM' | 'BOTH';
  isAiPick?: boolean;
}
