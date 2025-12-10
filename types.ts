export enum UpgradeType {
  HABITAT = 'HABITAT',
  TRANSPORT = 'TRANSPORT',
  RESEARCH = 'RESEARCH'
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  costMultiplier: number; // Cost scales by this factor per level
  effectValue: number; // Base effect amount
  effectType: 'add' | 'multiply';
  target: 'housing' | 'shipping' | 'value' | 'hatchRate';
  type: UpgradeType;
  tier: number;
  maxLevel?: number;
}

export interface PurchasedUpgrade {
  id: string;
  level: number;
}

export interface CowDefinition {
  id: string;
  name: string;
  description: string;
  valueMultiplier: number;
  color: string; // Keep for fallback or text colors
  spotColor: string;
  image: string; // Path to sprite
  unlockCost: number; // Money required to upgrade TO this cow
}

export interface GameState {
  money: number;
  cows: number;
  currentCowIndex: number; // Index in COW_TYPES array
  lifetimeEarnings: number;
  startTime: number;
  purchasedUpgrades: Record<string, number>; // id -> level
}

export interface DerivedStats {
  incomePerSecond: number;
  steakValue: number;
  housingCapacity: number;
  shippingCapacity: number;
  cowProductionRate: number; // Steaks per cow per second
  hatchRate: number; // Auto hatch per second (if any)
}