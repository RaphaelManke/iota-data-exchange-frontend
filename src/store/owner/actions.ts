import { ActionTree } from 'vuex';
import axios from 'axios';
import { OwnerState } from './types';
import { RootState } from '../types';
import Axios from 'axios';

export const actions: ActionTree<OwnerState, RootState> = {
  async addOwner({ commit }, { seed, id, masterSecret }: any): Promise<any> {
    const resp = await Axios.post('/owner/add', {
      seed,
      id,
      masterSecret,
    });
    if (resp.status === 200) {
      commit('storeOwner', [{ data: resp.data, id: id }]);
    }
  },
  async fetchOwner({ commit }): Promise<any> {
    const resp = await Axios.get('/owner/all');
    if (resp.status === 200) {
      const data: any = resp.data.map((e: any) => {
        return { id: e.id, data: e.data };
      });
      commit('loadedOwner', data);
    }
  },
  async getOwner({ commit }, id: string): Promise<any> {
    const resp = await Axios.get('/owner/get', { params: { id: id } });
    if (resp.status === 200) {
      const data: any = resp.data;
      commit('updateOwner', data);
    }
  },
  async checkRequestAddress({ commit }, id: string): Promise<any> {
    const resp = await Axios.post('/owner/checkRequestAddress', {
      id: id,
    });
    if (resp.status === 200) {
      const data: any = resp.data;
      commit('updateOwner', data);
    }
  },
};
