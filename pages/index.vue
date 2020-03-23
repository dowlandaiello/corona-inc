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
          maxZoom: maxZoom,
          minZoom: 2
        }"
      >
        <gmap-marker
          v-for="(item, index) in markers"
          :id="`markers${index}`"
          :key="index"
          :ref="`markers${index}`"
          :position="
            google && new google.maps.LatLng(item.latitude, item.longitude)
          "
          :icon="markerOptions(item.type)"
          :clickable="true"
          @click="popBubble(index, $event)"
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
      return this.$store.state.settings.session.maxZoom
    },
    mapTypeId() {
      return this.$store.state.settings.persistent.mapType
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
      setTimeout(
        () => this.$store.commit('bubbles/popBubble', markerIndex),
        200
      )

      anime({
        targets: this.$refs[`markers${markerIndex}`],
        easing: 'easeOutCirc',
        opacity: 0,
        duration: 200
      })
    },
    markerOptions(markerType) {
      let iconURI = ''

      switch (markerType) {
        case 'biohazard':
          iconURI = require('../assets/icons/biohazard_bubble.png')

          break
        case 'dna':
          iconURI = require('../assets/icons/dna_bubble.png')

          break
      }

      return {
        url: iconURI,
        size: { width: 40, height: 40, f: 'px', b: 'px' },
        scaledSize: { width: 40, height: 40, f: 'px', b: 'px' },
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
