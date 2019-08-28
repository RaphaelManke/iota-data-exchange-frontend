import { Module } from 'vuex';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';
import { OwnerState } from './types';
import { RootState } from '../types';

export const state: OwnerState = {
  items: [],
};

const namespaced: boolean = true;

export const owner: Module<OwnerState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
