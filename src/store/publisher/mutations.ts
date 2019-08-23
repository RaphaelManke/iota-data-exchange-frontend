import { MutationTree } from 'vuex';
import { PublisherState } from './types';
import { DataPublisher } from '@/lib';

export const mutations: MutationTree<PublisherState> = {
  storePublisher(state, payload: { data: DataPublisher; id: string }) {
    state.items = [...state.items, { id: payload.id, data: payload.data }];
  },
  loadedPublisher(state, payload: any) {
    state.items = payload;
  },
};
