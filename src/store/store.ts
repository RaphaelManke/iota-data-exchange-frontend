import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from './types';
import { publisher } from './publisher/index';
import { reciever } from './reciever/index';
import { owner } from './owner/index';
import VuexPersistence from 'vuex-persist';
const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});
Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  state: {
    version: '1.0.0', // a simple property
  },
  modules: {
    publisher,
    reciever,
    owner,
  },
  // plugins: [vuexLocal.plugin],
};

export default new Vuex.Store<RootState>(store);
