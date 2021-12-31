export enum NotificationType {
  Success,
  Error,
}

type NotificationOptions = {
  type?: NotificationType;
  message: string;
};

export class Notification {
  readonly created: Date;
  readonly type: NotificationType;
  readonly message: string;

  constructor({ type = NotificationType.Success, message }: NotificationOptions) {
    this.created = new Date();
    this.type = type;
    this.message = message;
  }
}
