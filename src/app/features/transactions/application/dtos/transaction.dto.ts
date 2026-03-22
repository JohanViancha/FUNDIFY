import { TypeTransaction } from "../../domain/models/transaction.model";

export interface TransactionDto {
  id: string;
  fundName: string;
  type: TypeTransaction;
  amount: number;
  date: Date;
}
