import { TypeTransaction } from "../../domain/models/transaction.model";

export interface FundDto {
  id: string;
  name: string;
}

export interface TransactionDto {
  id: string;
  fund: FundDto;
  type: TypeTransaction;
  amount: number;
  date: Date;
}
