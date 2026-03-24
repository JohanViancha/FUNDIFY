export interface AppError {
  title: string;
  message: string;
}

export class AppError extends Error implements AppError {
  title: string;

  constructor(title: string, message: string) {
    super(message);
    this.title = title;
    this.name = 'AppError';
  }
}
