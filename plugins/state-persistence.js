import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  window.onNuxtReady(() => {
    createPersistedState({
      key: 'coronainc',
      paths: ['bubbles.deregisteredMarkers', 'settings']
    })(store)
  })
}
