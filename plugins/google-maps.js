import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

const developmentKey = 'AIzaSyBzlLYISGjL_ovJwAehh6ydhB56fCCpPQw'

const getKey = () =>
  process.env.VUE_APP_GOOGLE_MAPS_API_KEY !== undefined
    ? process.env.VUE_APP_GOOGLE_MAPS_API_KEY
    : developmentKey

Vue.use(VueGoogleMaps, {
  load: {
    key: getKey(),
    v: '3.26',
    libraries: [
      `https://maps.googleapis.com/maps/api/js?key=${getKey()}&libraries=geometry`
    ]
  }
})
