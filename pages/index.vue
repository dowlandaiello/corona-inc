<template>
  <div>
    <gmap-map
      :center="center"
      :map-type-id="mapTypeId"
      :zoom="5"
      :options="{
        mapTypeControl: false,
        mapTypeId: 'hybrid',
        scaleControl: false,
        zoomControl: false,
        streetViewControl: false,
        fullscreenControl: false
      }"
    >
      <gmap-marker
        v-for="(item, index) in markers"
        :key="index"
        :position="item.position"
        @click="center = item.position"
      />
    </gmap-map>
  </div>
</template>

<script>
export default {
  data() {
    return {
      center: { lat: -3.350235, lng: 111.995865 },
      mapTypeId: 'terrain',
      markers: [
        { position: { lat: -0.48585, lng: 117.1466 } },
        { position: { lat: -6.9127778, lng: 107.6205556 } }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.vue-map-container {
  height: 105vh;
  max-width: 100vw;
  width: 100%;
}
</style>
