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
        <div class="control has-icons-left">
          <span class="icon is-left level-item">
            <b-icon icon="dna" size="is-small" />
            <p v-bind:style="{ marginLeft: '3rem' }">DNA</p>
          </span>
          <b-progress
            :value="40"
            size="is-large"
            type="is-primary"
            class="is-stat is-large is-marginless is-hidden-mobile"
          />
        </div>
        <b-button
          v-bind:style="{ color: '#9e1a39', fontWeight: '600' }"
          size="is-large"
          expanded
          >Disease</b-button
        >
      </div>
      <div class="column is-half" v-bind:style="{ marginTop: 'auto' }">
        <div class="columns is-gapless is-centered stat-section">
          <div class="column is-two-sixths">
            <b-icon icon="biohazard" size="is-small" />
            Infected
            <p v-bind:style="{ color: '#b30033' }">{{ nInfected }}</p>
          </div>
          <div class="column is-two-sixths is-vcentered primary-stat-section">
            <b-button size="is-large" class="primary-stat-section" expanded>
              World
              <b-progress
                :value="20"
                size="is-small"
                type="is-primary"
                v-bind:style="{ height: '0.25rem' }"
                class="is-stat is-small"
              />
            </b-button>
          </div>
          <div class="column is-two-sixths">
            <b-icon icon="skull" size="is-small" />
            Dead
            <p v-bind:style="{ color: '#b30033' }">{{ nDead }}</p>
          </div>
        </div>
      </div>
      <div class="column is-one-quarter">
        <div class="control has-icons-left has-icons-right">
          <span class="icon is-left level-item">
            <b-icon icon="flask" type="is-white" size="is-small" />
            <p v-bind:style="{ marginLeft: '3rem', color: 'white' }">Cure</p>
          </span>

          <b-progress
            :value="40"
            size="is-large"
            type="is-info"
            class="is-stat is-large is-marginless is-hidden-mobile"
          />

          <span class="icon is-right">
            <p v-bind:style="{ color: 'black' }">7%</p>
          </span>
        </div>
        <b-button
          v-bind:style="{ color: '#50c1d4', fontWeight: '600' }"
          size="is-large"
          expanded
          >World</b-button
        >
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
export default {
  data() {
    return {
      items: [
        {
          title: "Home",
          icon: "home",
          to: { name: "index" }
        },
        {
          title: "Inspire",
          icon: "lightbulb",
          to: { name: "inspire" }
        }
      ],
      nInfected: 0,
      nDead: 0
    };
  }
};
</script>
