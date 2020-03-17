<template>
  <div>
    <nav
      class="navbar header has-shadow is-primary"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <a class="navbar-item" href="/">
          <img src="~assets/buefy.png" alt="Buefy" height="28" />
        </a>

        <div class="navbar-burger">
          <span />
          <span />
          <span />
        </div>
      </div>
    </nav>

    <section class="main-content columns">
      <aside class="column is-2 section">
        <p class="menu-label is-hidden-touch">
          General
        </p>
        <ul class="menu-list">
          <li v-for="(item, key) of items" :key="key">
            <nuxt-link :to="item.to" exact-active-class="is-active">
              <b-icon :icon="item.icon" /> {{ item.title }}
            </nuxt-link>
          </li>
        </ul>
      </aside>

      <div class="container column is-10">
        <nuxt />
      </div>
    </section>

    <nav class="navbar is-fixed-bottom is-spaced columns">
      <div class="column is-one-quarter">
        <clickable-stat-area
          title="Disease"
          statBarDescription="DNA"
          statBarIcon="dna"
          statBarValue="100"
          maxStatBarValue="100"
          type="is-primary"
        />
      </div>
      <div class="column is-half" :style="{ marginTop: 'auto' }">
        <div class="columns is-gapless is-centered stat-section">
          <div class="column is-two-sixths">
            <b-icon icon="biohazard" size="is-small" />
            Infected
            <p :style="{ color: '#b30033' }">{{ nInfected }}</p>
          </div>
          <div class="column is-two-sixths is-vcentered primary-stat-section">
            <b-button size="is-large" class="primary-stat-section" expanded>
              World
              <b-progress
                :value="20"
                size="is-small"
                type="is-primary"
                :style="{ height: '0.25rem' }"
                class="is-stat is-small"
              />
            </b-button>
          </div>
          <div class="column is-two-sixths">
            <b-icon icon="skull" size="is-small" />
            Dead
            <p :style="{ color: '#b30033' }">{{ nDead }}</p>
          </div>
        </div>
      </div>
      <div class="column is-one-quarter">
        <clickable-stat-area
          title="World"
          statBarDescription="Cure"
          statBarIcon="flask"
          statBarValue="100"
          maxStatBarValue="100"
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
  border-radius: 6px;
  text-align: center;
}
</style>

<script>
import ClickableStatArea from '~/components/ClickableStatArea';

export default {
  data() {
    return {
      items: [
        {
          title: 'Home',
          icon: 'home',
          to: { name: 'index' }
        },
        {
          title: 'Inspire',
          icon: 'lightbulb',
          to: { name: 'inspire' }
        }
      ],
      nInfected: 0,
      nDead: 0
    };
  },

  components: {
    ClickableStatArea
  }
};
</script>
