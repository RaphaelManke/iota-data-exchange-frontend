import { MutationTree } from 'vuex';
import { PublisherState } from './types';
import { DataPublisher } from '@/lib';

export const mutations: MutationTree<PublisherState> = {
  storePublisher(state, payload: { data: DataPublisher; id: string }[]) {
    const extracedObjects = payload.map(e => {
      return { id: e.id, data: e.data };
    });
    state.items = [...state.items, ...extracedObjects];
  },
  loadedPublisher(state, payload: any) {
    state.items = payload;
  },
  updatePublisher(state, payload: any) {
    state.items = state.items.filter(e => e.id !== payload.id);
    state.items = [...state.items, payload];
  },
};
