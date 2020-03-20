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
              {{ nInfected ? nInfected.toLocaleString() : 0 }}
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
              {{ nDead ? nDead.toLocaleString() : 0 }}
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
  getDataForToday,
  getNumberConfirmed,
  getNumberDead,
  getNumberActive
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
      return getNumberActive(this.$store.state.jhuData)
    },
    nDead() {
      return getNumberDead(this.$store.state.jhuData)
    },
    percentInfected() {
      return (
        100 * (getNumberActive(this.$store.state.jhuData) / globalPopulation)
      )
    },
    percentDNA() {
      return (
        Math.round(Math.log10(getNumberConfirmed(this.$store.state.jhuData))) +
        Math.round(Math.log10(getNumberDead(this.$store.state.jhuData)))
      )
    }
  },
  created() {
    // Ganamos la informacion que la cliente necesita--cuantos personas hay muriendo?
    this.fetchGlobalStatistics().then(() =>
      // Refresh every 10 seconds
      setInterval(
        () => this.fetchGlobalStatistics(),
        this.$store.state.settings.refreshRate
      )
    )
  },

  methods: {
    fetchGlobalStatistics() {
      // Get data for today from JHU
      return getDataForToday().then(data => {
        //console.log(data)
        this.$store.commit('jhuData/putParsedDump', data)
        this.loading = false
      })
    }
  }
}
</script>
