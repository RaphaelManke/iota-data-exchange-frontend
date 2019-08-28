import { ActionTree } from 'vuex';
import axios from 'axios';
import { RecieverState } from './types';
import { RootState } from '../types';
import Axios from 'axios';

export const actions: ActionTree<RecieverState, RootState> = {
  async addReciever({ commit }, { seed, id }: any): Promise<any> {
    const resp = await Axios.post('/reciever/add', {
      seed,
      id,
    });
    if (resp.status === 200) {
      commit('storeReciever', [{ data: resp.data, id: id }]);
    }
  },
  async fetchReciever({ commit }): Promise<any> {
    const resp = await Axios.get('/reciever/all');
    if (resp.status === 200) {
      const data: any = resp.data.map((e: any) => {
        return { id: e.id, data: e.data };
      });
      commit('loadedReciever', data);
    }
  },
  async getReciever({ commit }, id: string): Promise<any> {
    const resp = await Axios.get('/reciever/get', { params: { id: id } });
    if (resp.status === 200) {
      const data: any = resp.data;
      commit('updateReciever', data);
    }
  },
  async requestAccess(
    { commit },
    request: { recieverId: string; start: string; end: string; peer: string }
  ): Promise<any> {
    const resp = await Axios.post('/reciever/requestAccess', request);
    if (resp.status === 200) {
      const data: any = resp.data;
      console.info(resp.data);
      commit('updateReciever', data);
    }
  },
};
