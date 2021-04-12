import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import AMap from 'vue-amap';

Vue.config.productionTip = false;

Vue.use(AMap);
AMap.initAMapApiLoader({
  // 高德的key
  key: 'df88c672b2085b0443151bb9444ac45a',
  // 插件集合
  plugin: [
    'AMap.Autocomplete',
    'AMap.PlaceSearch',
    'AMap.Geolocation',
    'AMap.Geocoder'
  ]
})

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
