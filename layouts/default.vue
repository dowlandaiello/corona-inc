<template>
  <div class="root">
    <b-loading :is-full-page="true" :active.sync="loading" />
    <nuxt />
    <nav class="navbar is-fixed-bottom is-spaced columns">
      <div class="column is-one-quarter">
        <clickable-stat-area
          title="Disease"
          stat-bar-description="DNA"
          stat-bar-icon="dna"
          :stat-bar-value="percentDNA"
          :max-stat-bar-value="100"
          to="inspire"
          type="is-primary"
        />
      </div>
      <div class="column is-half" :style="{ marginTop: 'auto' }">
        <div class="columns is-gapless is-centered stat-section">
          <div class="column is-two-sixths">
            <b-icon icon="biohazard" size="is-small" />Infected
            <p :style="{ color: '#b30033' }">
              {{ nInfected.toLocaleString() }}
            </p>
          </div>
          <div class="column is-two-sixths is-vcentered primary-stat-section">
            <b-button size="is-large" class="primary-stat-section" expanded>
              World
              <b-progress
                :value="percentInfected"
                size="is-small"
                type="is-primary"
                :style="{ height: '0.25rem' }"
                class="is-stat is-small"
              />
            </b-button>
          </div>
          <div class="column is-two-sixths">
            <b-icon icon="skull" size="is-small" />Dead
            <p :style="{ color: '#b30033' }">
              {{ nDead.toLocaleString() }}
            </p>
          </div>
        </div>
      </div>
      <div class="column is-one-quarter">
        <clickable-stat-area
          title="World"
          stat-bar-description="Cure"
          stat-bar-icon="flask"
          :stat-bar-value="
            Math.round((new Date('March 17, 2020 00:00:00') / new Date()) * 40)
          "
          :max-stat-bar-value="100"
          to="inspire"
          type="is-info"
        />
      </div>
    </nav>
  </div>
</template>

<style>
.primary-stat-section {
  background: rgb(0, 0, 0);
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(23, 23, 23, 1) 86%,
    rgba(156, 156, 156, 1) 100%
  );
  color: #ffffff;
}

.stat-section {
  background: rgb(0, 0, 0);
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(64, 64, 64, 1) 83%,
    rgba(156, 156, 156, 1) 100%
  );
  color: #ffffff;
  text-align: center;
}

.root {
  overflow-y: hidden;
}
</style>

<script>
import ClickableStatArea from '~/components/ClickableStatArea'
import {
  getDataForDay,
  getNumberConfirmed,
  getNumberDead,
  getNumberActive,
  closestDayWithData
} from '~/jhuapi/api'

const globalPopulation = 7771535787

export default {
  components: {
    ClickableStatArea
  },
  data() {
    return {
      loading: true
    }
  },
  computed: {
    nInfected() {
      return getNumberActive(this.$store.state.jhuData.dump, false)
    },
    nDead() {
      return getNumberDead(this.$store.state.jhuData.dump, false)
    },
    percentInfected() {
      return (
        100 *
        (getNumberActive(this.$store.state.jhuData.dump, false) /
          globalPopulation)
      )
    },
    percentDNA() {
      return (
        Math.round(
          Math.log10(getNumberConfirmed(this.$store.state.jhuData.dump, false))
        ) +
        Math.round(
          Math.log10(getNumberDead(this.$store.state.jhuData.dump, false))
        )
      )
    }
  },
  async created() {
    // Ganamos la informacion que la cliente necesita--cuantos personas hay muriendo?
    await this.fetchGlobalStatistics()

    // Refresh every 10 seconds
    setInterval(
      () => this.fetchGlobalStatistics(),
      this.$store.state.settings.refreshRate
    )
  },
  methods: {
    registerApplicableMarker(countryName, place) {
      if (Object.values(place).length <= 1) {
        return
      }

      if (
        this.$store.state.bubbles.deregisteredMarkers[place.identifier] ||
        this.$store.state.bubbles.countryIndicies[place.identifier]
      ) {
        return
      }

      if (
        place.numConfirmed > 0 &&
        getNumberConfirmed(
          this.$store.state.jhuData.dump,
          countryName,
          countryName !== place.identifier ? place.identifier : false,
          true
        ) === 0
      ) {
        this.$store.commit('bubbles/addMarker', {
          type: 'biohazard',
          latitude: parseFloat(place.latitude),
          longitude: parseFloat(place.longitude),
          identifier: place.identifier
        })

        return
      }

      if (
        place.numActive /
          getNumberActive(
            this.$store.state.jhuData.dump,
            countryName,
            countryName !== place.identifier ? place.identifier : false,
            true
          ) >=
          this.$store.state.settings.magnitudeIncreaseToDNABubble ||
        place.numDead /
          getNumberDead(
            this.$store.state.jhuData.dump,
            countryName,
            countryName !== place.identifier ? place.identifier : false,
            true
          ) >=
          this.$store.state.settings.magnitudeIncreaseToDNABubble
      ) {
        this.$store.commit('bubbles/addMarker', {
          type: 'dna',
          latitude: parseFloat(place.latitude),
          longitude: parseFloat(place.longitude),
          identifier: place.identifier
        })
      }
    },
    async fetchGlobalStatistics() {
      // Get the last day with data from JHU
      const today = await closestDayWithData(new Date())

      // Get data for today from JHU
      const data = await getDataForDay(today, { includeHistoricalData: true })

      this.$store.commit('jhuData/putParsedDump', data)

      // Register bubbles for all applicable countries
      for (const place of Object.values(data.today)) {
        this.registerApplicableMarker(place.identifier, place)

        for (const province of Object.values(place).filter(
          obj => typeof obj === 'object'
        )) {
          this.registerApplicableMarker(place.identifier, province)
        }
      }

      this.loading = false
    }
  }
}
</script>
