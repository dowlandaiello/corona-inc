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
          :position="item.position"
          @click="center = item.position"
        />
      </gmap-map>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      center: { lat: 20, lng: 0 },
      zoom: 3,
      markers: [],
      countryData: {},
      lastInfectionsCount: 0,
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
      return this.$store.state.jhuData.filter()
    }
  },

  created() {
    // Wait for an instance of the google maps geocoding API to be available before we start looking for
    // geocoder-specific data
    this.$gmapApiPromiseLazy().then(() => {
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
