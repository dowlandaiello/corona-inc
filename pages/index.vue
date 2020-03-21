<template>
  <div>
    <div class="map-container">
      <gmap-map
        :center="center"
        :map-type-id="mapTypeId"
        :zoom="zoom"
        :options="{
          mapTypeControl: false,
          scaleControl: false,
          zoomControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          maxZoom: maxZoom
        }"
      >
        <gmap-marker
          v-for="(item, index) in markers"
          :key="index"
          :ref="`markers${index}`"
          :position="
            google && new google.maps.LatLng(item.latitude, item.longitude)
          "
          :icon="markerOptions(item.type)"
          :clickable="true"
          @click="popBubble(index)"
        />
      </gmap-map>
    </div>
  </div>
</template>

<script>
import anime from 'animejs/lib/anime.es.js'
import { gmapApi } from 'vue2-google-maps'

export default {
  data() {
    return {
      center: { lat: 20, lng: 0 },
      zoom: 3,
      geocoder: {},
      nBubblesPopped: 0
    }
  },
  computed: {
    maxZoom() {
      return this.$store.state.settings.maxZoom
    },
    mapTypeId() {
      return this.$store.state.settings.mapType
    },
    markers() {
      return this.$store.state.bubbles.markers
    },
    google: gmapApi
  },
  created() {
    // Wait for an instance of the google maps geocoding API to be available before we start looking for
    // geocoder-specific data
    return this.$gmapApiPromiseLazy().then(() => {
      // Make a new instance of the geocoder helper type that google maps provides us with.
      // This will be used to determine the bounds of individual countries, and draw
      // certain effects (e.g. chickenpox-looking infection density, etc...)
      //
      // eslint-disable-next-line no-undef
      this.geocoder = new google.maps.Geocoder()
    })
  },
  methods: {
    popBubble(markerIndex) {
      anime({
        targets: this.$refs[`markers${markerIndex}`],
        opacity: 0,
        duration: 800,
        completed: () => {
          this.$store.commit('bubbles/popBubble', markerIndex)
        }
      })
    },
    markerOptions(markerType) {
      let iconURI = ''

      switch (markerType) {
        case 'biohazard':
          iconURI = require('../assets/icons/biohazard_bubble.png')

          break
      }

      return {
        url: iconURI,
        size: { width: 30, height: 30, f: 'px', b: 'px' },
        scaledSize: { width: 30, height: 30, f: 'px', b: 'px' },
        opacity: 1
      }
    }
  }
}
</script>

<style lang="css" scoped>
.map-container {
  height: 100%;
  overflow: hidden;
}

.vue-map-container {
  height: 105vh;
  width: 100%;
  overflow-y: hidden;
}
</style>
