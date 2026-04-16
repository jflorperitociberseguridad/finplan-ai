export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  description: string;
}

export interface Budget {
  category: string;
  limit: number;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}
