import { ActionTree } from 'vuex';
import axios from 'axios';
import { PublisherState } from './types';
import { RootState } from '../types';
import Axios from 'axios';

export const actions: ActionTree<PublisherState, RootState> = {
  async addPublisher(
    { commit },
    { masterSecret, seed, id }: any
  ): Promise<any> {
    const resp = await Axios.post('/addDataPublisher', {
      masterSecret,
      seed,
      id,
    });
    if (resp.status === 200) {
      commit('storePublisher', { data: resp.data, id: id });
    }
  },
  async fetchPublisher({ commit }): Promise<any> {
    const resp = await Axios.get('/publisher/all');
    if (resp.status === 200) {
      commit('loadedPublisher', resp.data);
    }
  },
};
