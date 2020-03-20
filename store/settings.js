const defaultState = {
  refreshRate: 10000,
  maxZoom: 5,
  mapType: 'hybrid'
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
    state[key] = value
  },

  /**
   * Sets the state object to a default version of such an object.
   *
   * @param {state} state
   */
  restoreDefaults(state) {
    Object.assign(state, defaultState)
  }
}
