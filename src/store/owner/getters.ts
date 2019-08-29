import { GetterTree } from 'vuex';
import { OwnerState } from './types';
import { RootState } from '../types';
import { DataPublisher, DataReciever, DataOwner } from '@/lib';
import { stringify } from 'querystring';

export const getters: GetterTree<OwnerState, RootState> = {
  getOwner: state => {
    try {
      // console.log(Array.from(state.items.values()));
      return state.items;
    } catch (error) {
      console.error(error);
    }
  },
  getOwnerById: (state, getters) => (
    itemid: string
  ): { id: string; data: DataOwner } | undefined => {
    return state.items.find((item: any) => item.id === itemid);
  },
  getOwnerByAddress: (state, getters) => (
    address: string
  ): { id: string; data: DataOwner } | undefined => {
    return state.items.find(
      (item: any) => item.data.subMan.subscriptionRequestAddress === address
    );
  },
  hasOwner: (state, getters) => (id: string): boolean => {
    const res = getters.getOwnerById(id);
    return res ? true : false;
  },
  getRecieverByPubKeyAddress: (state, getters, rootState, rootGetters) => (
    pubKeyAddress: string
  ): boolean => {
    const peer = rootGetters['reciever/getOwnerByAddress'](pubKeyAddress);

    return peer ? peer.id : undefined;
  },
  getPublisherOfOwner: (state, getters, rootState, rootGetters) => (
    ownerId: string
  ) => {
    const res = getters.getOwnerById(ownerId);
    console.log(res);
    if (res) {
      return res.data.dataConnectors.map(e => e[0]);
    } else return [];
  },
};
