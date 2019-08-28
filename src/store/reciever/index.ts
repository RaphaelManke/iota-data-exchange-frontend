import { Module } from 'vuex';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';
import { RecieverState } from './types';
import { RootState } from '../types';

export const state: RecieverState = {
  items: [],
};

const namespaced: boolean = true;

export const reciever: Module<RecieverState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
