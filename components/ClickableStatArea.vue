<template>
  <div>
    <div class="control has-icons-left has-icons-right">
      <span class="icon is-left level-item">
        <b-icon :icon="statBarIcon" type="is-white" size="is-small" />
        <p class="stat-bar-icon-label">{{ statBarDescription }}</p>
      </span>
      <b-progress
        :value="statBarValue"
        :max="maxStatBarValue"
        size="is-large"
        :type="type"
        class="is-stat is-large is-marginless is-hidden-mobile"
      />
      <span class="icon is-right">
        <p :style="{ color: 'white' }">{{ statBarValue }}</p>
      </span>
    </div>
    <nuxt-link :to="to">
      <b-button
        class="stat-button"
        :style="statButtonStyle"
        size="is-large"
        expanded
      >
        {{ title }}
      </b-button>
    </nuxt-link>
  </div>
</template>

<style scoped>
.stat-bar-icon-label {
  margin-left: 3rem;
}

.stat-button-style {
  font-weight: 600;
}

p {
  color: white;
}
</style>

<script>
export default {
  name: 'ClickableStatArea',
  props: {
    title: {
      type: String,
      default: 'Button'
    },
    statBarDescription: {
      type: String,
      default: 'Some statistic'
    },
    statBarIcon: {
      type: String,
      default: ''
    },
    statBarValue: {
      type: Number,
      default: 0
    },
    maxStatBarValue: {
      type: Number,
      default: 100
    },
    to: {
      type: String,
      default: 'index'
    },
    type: {
      type: String,
      default: 'info'
    }
  },
  computed: {
    statButtonStyle() {
      return `
          color: ${this.type === 'is-primary' ? '#9e1a39' : '#50c1d4'};
          font-weight: 600;
      `
    }
  }
}
</script>
