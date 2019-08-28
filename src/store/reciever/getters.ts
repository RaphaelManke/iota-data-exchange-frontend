import { GetterTree } from 'vuex';
import { RecieverState } from './types';
import { RootState } from '../types';
import { DataPublisher, DataReciever } from '@/lib';
import { stringify } from 'querystring';

export const getters: GetterTree<RecieverState, RootState> = {
  getReciever: state => {
    try {
      // console.log(Array.from(state.items.values()));
      return state.items;
    } catch (error) {
      console.error(error);
    }
  },
  getRecieverById: (state, getters) => (
    itemid: string
  ): { id: string; data: DataReciever } | undefined => {
    return state.items.find((item: any) => item.id === itemid);
  },
  hasReciever: (state, getters) => (id: string): boolean => {
    const res = getters.getRecieverById(id);
    return res ? true : false;
  },
  getPeerByAddress: (state, getters, rootState, rootGetters) => (
    address: string
  ) => {
    const peer = rootGetters['owner/getOwnerByAddress'](address);
    return peer ? peer.id : undefined;
  },
  getOwnerByAddress: (state, getters) => (pubKeyAddress: string) => {
    return state.items.find(el => el.data.pubKeyAddress === pubKeyAddress);
  },
};
