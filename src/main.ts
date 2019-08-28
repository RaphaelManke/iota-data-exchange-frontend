import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/store';
import Axios from 'axios';
import BootstrapVue from 'bootstrap-vue';
// @ts-ignore
import datePicker from 'vue-bootstrap-datetimepicker';
import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
Vue.config.productionTip = false;
Axios.defaults.baseURL = 'http://localhost:9999';
Vue.use(BootstrapVue);
Vue.use(datePicker);
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
