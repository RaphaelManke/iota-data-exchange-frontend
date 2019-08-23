import { DataPublisher } from '@/lib';

export interface PublisherState {
  items: { id: string; data: DataPublisher }[];
}
