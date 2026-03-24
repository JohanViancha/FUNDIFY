export type NotificationType = 'SMS' | 'EMAIL';
export interface InvestmentData {
  amount: number;
  notificationType: NotificationType;
}
