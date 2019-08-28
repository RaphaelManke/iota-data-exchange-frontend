import { DataOwner } from '@/lib';

export interface OwnerState {
  items: { id: string; data: DataOwner }[];
}
