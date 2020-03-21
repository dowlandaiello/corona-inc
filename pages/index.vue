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
        <gmap-custom-marker
          v-for="(item, index) in markers"
          :key="index"
          :position="{ lat: item.latitude, lng: item.longitude }"
        >
          <img
            src="~assets/icons/biohazard_bubble.png"
            class="bubble"
            @click="popBubble(index, $event)"
          />
        </gmap-custom-marker>
      </gmap-map>
    </div>
  </div>
</template>

<script>
import GmapCustomMarker from 'vue2-gmap-custom-marker'
import anime from 'animejs/lib/anime.es.js'

export default {
  components: {
    'gmap-custom-marker': GmapCustomMarker
  },
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
    }
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
    popBubble(markerIndex, event) {
      anime({
        targets: event.srcElement,
        opacity: 0,
        duration: 800,
        completed: () => {
          this.$store.commit('bubbles/popBubble', markerIndex)
        }
      })
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

.bubble {
  cursor: pointer;
  width: 2.5%;
}
</style>
