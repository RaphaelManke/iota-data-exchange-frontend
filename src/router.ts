import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Publisher from './views/Publisher.vue';
import Owner from './views/Owner.vue';
import OwnerDetails from './views/OwnerDetails.vue';
import Reciever from './views/Reciever.vue';
import RecieverDetails from './views/RecieverDetails.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/publisher',
      name: 'publisher',
      component: Publisher,
    },
    {
      path: '/owner',
      name: 'owner',
      component: Owner,
    },
    {
      path: '/owner/:ownerId/details',
      name: 'ownerDetails',
      component: OwnerDetails,
      props: true,
    },

    {
      path: '/reciever',
      name: 'reciever',
      component: Reciever,
    },
    {
      path: '/reciever/:recieverId/details',
      name: 'recieverDetails',
      component: RecieverDetails,
      props: true,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
  ],
});
