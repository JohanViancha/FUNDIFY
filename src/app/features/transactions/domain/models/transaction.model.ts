export type TransactionType = 'SUBSCRIPTION' | 'CANCELLATION';

export interface Transaction {
  id: string;
  fundId: string;
  type: TransactionType;
  amount: number;
  date: Date;
}
