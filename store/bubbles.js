const defaultState = {
  markers: [],
  deregisteredMarkers: {},
  countryIndicies: {}
}

/**
 * Markers placed on the main map.
 */
export const state = () => Object.assign({}, defaultState)

/**
 * Any way that the global map might change.
 */
export const mutations = {
  /**
   * Adds a marker to the map.
   *
   * @param {String} type
   * @param {Object} bubble
   */
  addMarker(state, bubble) {
    state.countryIndicies[bubble.identifier] = state.markers.length
    state.markers.push(bubble)
  },

  /**
   * Removes a marker from the map.
   *
   * @param {Number} index
   */
  popBubble(state, index) {
    state.deregisteredMarkers[state.markers[index].identifier] = true
    state.markers.splice(index, 1)
  }
}
