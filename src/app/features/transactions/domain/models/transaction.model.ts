export type TypeTransaction = 'SUBSCRIPTION' | 'CANCELLATION';

export interface Transaction {
  id: string;
  fundId: string;
  type: TypeTransaction;
  amount: number;
  date: Date;
}
