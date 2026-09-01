export type StateParticipation = {
  state: string;
  percentage: number;
};

export type Demographics = {
  ageGroup: string;
  value: number;
};

export type TrendData = {
  year: string;
  population: number;
};

export type PhaseProgress = {
  phase: string;
  completion: number;
};

export const stateParticipationData: StateParticipation[] = [
  { state: "UP", percentage: 45 },
  { state: "MH", percentage: 55 },
  { state: "BR", percentage: 40 },
  { state: "WB", percentage: 60 },
  { state: "MP", percentage: 50 },
  { state: "TN", percentage: 70 },
  { state: "RJ", percentage: 48 },
];

export const demographicsData: Demographics[] = [
  { ageGroup: "0-14", value: 350 },
  { ageGroup: "15-24", value: 250 },
  { ageGroup: "25-54", value: 550 },
  { ageGroup: "55-64", value: 150 },
  { ageGroup: "65+", value: 100 },
];

export const trendData: TrendData[] = [
  { year: "1981", population: 683 },
  { year: "1991", population: 846 },
  { year: "2001", population: 1028 },
  { year: "2011", population: 1210 },
  { year: "2027", population: 1450 }, // projected
];

export const phaseProgressData: PhaseProgress[] = [
  { phase: "Training", completion: 100 },
  { phase: "Houselisting", completion: 85 },
  { phase: "Enumeration", completion: 20 },
  { phase: "Data Sync", completion: 10 },
];
