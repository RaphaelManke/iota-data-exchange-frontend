import { Module } from 'vuex';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';
import { PublisherState } from './types';
import { RootState } from '../types';

export const state: PublisherState = {
  items: [],
};

const namespaced: boolean = true;

export const publisher: Module<PublisherState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
