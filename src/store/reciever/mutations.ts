import { MutationTree } from 'vuex';
import { RecieverState } from './types';
import { DataPublisher, DataReciever } from '@/lib';

export const mutations: MutationTree<RecieverState> = {
  storeReciever(state, payload: { data: DataReciever; id: string }[]) {
    const extracedObjects = payload.map(e => {
      return { id: e.id, data: e.data };
    });
    state.items = [...state.items, ...extracedObjects];
    console.log(state.items);
  },

  loadedReciever(state, payload: any) {
    state.items = payload;
  },
  updateReciever(state, payload: any) {
    state.items = state.items.filter(e => e.id !== payload.id);
    state.items = [...state.items, payload];
    console.log(payload);
  },
};
