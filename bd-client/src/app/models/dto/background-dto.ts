export interface BackgroundDto {
  id: string;
  name: string;
  tags?: string[];
  url: string;
  createdAt: Date;
  updatedAt?: Date;
}
