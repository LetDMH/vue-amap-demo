import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/mapEntry',
    component: ()=>import('../views/amap.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
