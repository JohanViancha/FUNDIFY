type CategoryFund = "FIC" | "FPV"

export interface Fund {
  id: string;
  name: string;
  category: CategoryFund;
  minimumAmount: number;
}
