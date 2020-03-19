<template>
  <div>
    <b-loading :is-full-page="true" :active.sync="loading" />
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
      loading: true,
      geocoder: {}
    }
  },

  computed: {
    maxZoom() {
      return this.$store.state.settings.maxZoom
    },

    mapTypeId() {
      return this.$store.state.settings.mapType
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

      // Get statistics for each country cited by the coronavirus API results
      this.lazilyReloadLocalStatistics()

      // Refresh map data every n milliseconds
      setInterval(
        () => this.lazilyReloadLocalStatistics(),
        this.$store.state.settings.refreshRate
      )
    })
  },

  methods: {
    /**
     * Does not force a full reload unless the infections count has changed since we last refreshed.
     */
    lazilyReloadLocalStatistics() {
      fetch('https://coronavirus-19-api.herokuapp.com/all')
        .then(data => data.json())
        .then(parsed => {
          // Cache a count of the infections, so that we can lazily reload data
          if (
            parsed.cases - (parsed.deaths + parsed.recovered) !==
            this.lastInfectionsCount
          ) {
            this.lastInfectionsCount =
              parsed.cases - (parsed.deaths + parsed.recovered)

            // Perform a full refresh
            this.fetchLocalStatistics()
          }
        })
    },

    /**
     * Performs a full refresh of map data.
     */
    async fetchLocalStatistics() {
      fetch('https://coronavirus-19-api.herokuapp.com/countries')
        .then(data => data.json())
        .then(parsed => {
          this.loading = false

          for (const countryEntry of parsed) {
            // If we don't know the bounds of this country yet, figure them out
            if (this.countryData[countryEntry.country] === undefined) {
              this.geocoder.geocode(
                {
                  address: countryEntry.country
                },
                res => console.log(res)
              )
            }
          }
        })
        .catch(err => {
          this.loading = false

          console.error(err)
        })
    }
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
