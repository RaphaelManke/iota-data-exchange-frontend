import { MutationTree } from 'vuex';
import { OwnerState } from './types';
import { DataOwner } from '@/lib';

export const mutations: MutationTree<OwnerState> = {
  storeOwner(state, payload: { data: DataOwner; id: string }[]) {
    const extracedObjects = payload.map(e => {
      return { id: e.id, data: e.data };
    });
    state.items = [...state.items, ...extracedObjects];
    console.log(state.items);
  },

  loadedOwner(state, payload: any) {
    state.items = payload;
  },
  updateOwner(state, payload: any) {
    state.items = state.items.filter(e => e.id !== payload.id);
    state.items = [...state.items, payload];
    console.log(payload);
  },
};
