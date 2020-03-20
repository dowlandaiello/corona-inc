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
          v-for="(item, index) in recentlyInfectedCountries"
          :key="index"
          :marker="{ lat: item.latitude, lng: item.longitude }"
        >
        </gmap-custom-marker>
      </gmap-map>
    </div>
  </div>
</template>

<script>
import GmapCustomMarker from 'vue2-gmap-custom-marker'

export default {
  components: {
    'gmap-custom-marker': GmapCustomMarker
  },
  data() {
    return {
      center: { lat: 20, lng: 0 },
      zoom: 3,
      geocoder: {}
    }
  },
  computed: {
    maxZoom() {
      return this.$store.state.settings.maxZoom
    },
    mapTypeId() {
      return this.$store.state.settings.mapType
    },
    recentlyInfectedCountries() {
      return Object.values(this.$store.state.jhuData.dump).filter(
        infectionData =>
          infectionData.numConfirmed > 0 &&
          infectionData.numConfirmed <
            this.$store.state.settings.minimumInfectionsToDismiss
      )
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
  }
}
</script>

<style lang="scss" scoped>
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
