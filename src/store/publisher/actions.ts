import { ActionTree } from 'vuex';
import axios from 'axios';
import { PublisherState } from './types';
import { RootState } from '../types';
import Axios from 'axios';

export const actions: ActionTree<PublisherState, RootState> = {
  async addPublisher(
    { commit },
    payload: {
      seed: string;
      id: string;
      masterSecret: string;
      peer: string;
      dataType: string;
      fitbitUserId: string;
      fitbitAccessToken: string;
    }
  ): Promise<any> {
    const resp = await Axios.post('/publisher/add', payload);
    if (resp.status === 200) {
      commit('storePublisher', [{ data: resp.data, id: payload.id }]);
    }
  },
  async fetchPublisher({ commit }): Promise<any> {
    const resp = await Axios.get('/publisher/all');
    if (resp.status === 200) {
      const data: any = resp.data.map((e: any) => {
        return { id: e.id, data: e.data };
      });
      commit('loadedPublisher', data);
    }
  },
  async startPublish({ commit }, id: string) {
    const resp = await Axios.post('/publisher/start', { id: id });
    console.log(resp.data);
    commit('updatePublisher', resp.data);
  },
  async stopPublish({ commit }, id: string) {
    const resp = await Axios.post('/publisher/stop', { id: id });
    commit('updatePublisher', resp.data);
  },
};
