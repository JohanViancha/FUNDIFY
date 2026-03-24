import { TransactionType } from "../../domain/models/transaction.model";

export interface TransactionDto {
  id: string;
  fundName: string;
  type: TransactionType;
  amount: number;
  date: Date;
}
