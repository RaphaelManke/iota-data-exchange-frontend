import { GetterTree } from 'vuex';
import { PublisherState } from './types';
import { RootState } from '../types';
import { DataPublisher } from '@/lib';
import { stringify } from 'querystring';

export const getters: GetterTree<PublisherState, RootState> = {
  getPublisher: state => {
    try {
      // console.log(Array.from(state.items.values()));
      return state.items;
    } catch (error) {
      console.error(error);
    }
  },
  getPublisherById: (state, getters) => (
    itemid: string
  ): { id: string; data: DataPublisher } | undefined => {
    return state.items.find((item: any) => item.id === itemid);
  },
  hasPublisher: (state, getters) => (id: string): boolean => {
    const res = getters.getPublisherById(id);
    return res ? true : false;
  },
  isPublishing: (state, getters) => (id: string): boolean => {
    const res = getters.getPublisherById(id);
    return res !== undefined ? res.data.state : false;
  },
};
