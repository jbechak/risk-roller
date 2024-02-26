<template>
    <div :class="dieColor">
      <img src="@/assets/x-marker.png"/>
    </div>


</template>
<script setup>
import { computed, defineProps } from 'vue';

const props = defineProps({
  isRed: {
    type: Boolean,
    default: true
  },
});

const dieColor = computed(() => props.isRed ? 'redDieClass' : 'whiteDieClass' );

</script>

<style scoped>
div {
  width: 75px;
  height: 75px;
  border-radius: 5px;
  margin-left: 30px;
  margin-top: 30px;
}

img {
  position: relative;
  bottom: 13px;
  right: 13px;
}

.redDieClass {
  background: red;
}

.whiteDieClass {
  background: white;
  border: 2px solid black;
}
</style>