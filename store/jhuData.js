const defaultState = {}

/**
 * Data collected from the Johns Hopkins University GitHub data dump via the jhu module.
 */
export const state = () => Object.assign({}, defaultState)

/**
 * Any way that the global dump store can be modified.
 */
export const mutations = {
  /**
   * Puts a parsed data dump from the api module into a state object.
   *
   * @param {Object} state the state object to which the data dump should be written
   * @param {Object} data the JHU data dump that should be synchronized with the state
   */
  putParsedDump(state, data) {
    Object.assign(state, data)
  }
}
