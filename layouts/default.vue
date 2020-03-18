<template>
  <div class="root">
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

export default {
  components: {
    ClickableStatArea
  },
  data() {
    return {
      nInfected: 0,
      nDead: 0,
      percentInfected: 0,
      percentDNA: 0
    }
  },

  created() {
    // Ganamos la informacion que la cliente necesita--cuantos personas hay muriendo?
    this.fetchGlobalStatistics()

    // Refresh every 10 seconds
    setInterval(
      () => this.fetchGlobalStatistics(),
      this.$store.state.settings.refreshRate
    )
  },

  methods: {
    fetchGlobalStatistics() {
      // Vamos a ganar la informacion del mundo
      fetch('https://coronavirus-19-api.herokuapp.com/all')
        .then(data => data.json())
        .then(parsed => {
          this.nInfected = parsed.cases - (parsed.recovered + parsed.deaths)
          this.nDead = parsed.deaths
          this.percentInfected = 100 * (this.nInfected / 7771535787)
          this.percentDNA =
            Math.round(Math.log10(this.nInfected)) +
            Math.round(Math.log10(this.nDead))
        })
        .catch(err => {
          // Encontramos un excepcion
          this.loading = false

          console.error(err)
        })
    }
  }
}
</script>
