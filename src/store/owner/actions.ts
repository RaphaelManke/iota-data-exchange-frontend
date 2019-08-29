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
  async acceptRequest(
    { commit },
    payload: { ownerId: string; requestId: string }
  ): Promise<any> {
    const resp = await Axios.post('/owner/acceptRequest', {
      id: payload.ownerId,
      requestId: payload.requestId,
    });
    if (resp.status === 200) {
      const data: any = resp.data;
      commit('updateOwner', data);
    }
  },
  async getNextMessage({ commit, getters }, id: string): Promise<any> {
    const owner = getters['getOwnerById'](id);
    const connId = owner.data.dataConnectors[0][0];
    const resp = await Axios.post('/owner/getNextMessage', {
      id: id,
      pubId: connId,
    });
    if (resp.status === 200) {
      const data: any = resp.data;
      console.log(data);
      commit('updateOwner', data);
    }
  },
  async fetchMessages({ commit, getters }, payload: any): Promise<any> {
    const owner = getters['getOwnerById'](payload.ownerId);
    const resp = await Axios.post('/owner/fetchMessages', {
      id: payload.ownerId,
      pubId: payload.pubId,
    });
    if (resp.status === 200) {
      const data: any = resp.data;
      console.log(data);
      commit('updateOwner', data);
    }
  },
};
