export interface Session {
  sid: string;
  expires: Date;
  data: string;
  createdAt: Date;
  updatedAt?: Date;
}
