import Vue from 'vue'

const defaultState = {
  refreshRate: 10000,
  maxZoom: 5,
  mapType: 'hybrid',
  magnitudeIncreaseToDNABubble: 1.75
}

/**
 * User preferences for the corona-virus dashboard.
 */
export const state = () => Object.assign({}, defaultState)

/**
 * Any possible way in which the user preferences could be changed.
 */
export const mutations = {
  /**
   * Sets a key in the user preferences state object.
   *
   * @param {Object} state
   * @param {String} key
   * @param {String} value
   */
  set(state, key, value) {
    Vue.set(state, key, value)
  },

  /**
   * Sets the state object to a default version of such an object.
   *
   * @param {state} state
   */
  restoreDefaults(state) {
    for (const key in defaultState) {
      Vue.set(state, key, defaultState[key])
    }
  }
}
