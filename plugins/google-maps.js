import Vue from 'vue';

import * as VueGoogleMaps from '@/node_modules/vue2-google-maps';

Vue.use(VueGoogleMaps, {
  load: {
    key:
      process.env.NODE_ENV !== 'development'
        ? process.env.VUE_APP_GOOGLE_MAPS_API_KEY
        : 'AIzaSyBzlLYISGjL_ovJwAehh6ydhB56fCCpPQw',
    v: '3.26'
  }
});
