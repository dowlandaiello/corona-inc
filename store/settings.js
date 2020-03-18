const defaultState = {
  refreshRate: 1000
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
   * @param {state} state
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
