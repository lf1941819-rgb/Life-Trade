export type AssetCategory = "Gold" | "Stocks" | "Oil" | "Forex";

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  baseCurrency: string;
  pointValue: number;
  active: boolean;
}

export interface Operation {
  id: string;
  userId: string;
  date: string;
  time: string;
  assetId: string;
  type: "Buy" | "Sell";
  points: number;
  lotUsed: number;
  currency: string;
  financialValue: number;
  observation?: string;
  setup?: string;
  imageUrl?: string;
  result: "Profit" | "Loss";
  status: "Closed" | "Open";
  emotionalState?: string;
  createdAt: number;
}

export interface Goal {
  id: string;
  userId: string;
  period: "Daily" | "Weekly" | "Monthly";
  pointsGoal: number;
  valueGoal: number;
  currency: string;
  pointsPerOperation: number;
}

export interface LotProgressionSettings {
  initialLot: number;
  increment: number;
  operationsPerCycle: number;
  totalOperations: number;
  currentLot: number;
}

export interface Invoice {
  id: string;
  userId: string;
  date: string;
  number: string;
  value: number;
  currency: string;
  description: string;
  relatedOperationId?: string;
  status: "Paid" | "Pending" | "Cancelled";
}

export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  date: string;
  time: string;
  type: "Market Opening" | "Review" | "Economic Event" | "Personal";
  observation?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  mainCurrency: string;
  theme: "dark";
}

export interface AIChatMessage {
  id: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}
