<template>
  <div :class="dieColor">
    <h1 class="text-center">X
    </h1>

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

h1 {
  position: relative;
  bottom: 40px;
  right: 10px;
  font-size: 120px;
  font-family: 'Comic Sans MS';
  width: 90px;

  -webkit-transform:scale(1.3,1); /* Safari and Chrome */
  -moz-transform:scale(1.3,1); /* Firefox */
  -ms-transform:scale(1.3,1); /* IE 9 */
  -o-transform:scale(1.3,1); /* Opera */
  transform:scale(1.3,1); /* W3C */

}

.redDieClass {
  background: red;
}

.whiteDieClass {
  background: white;
  border: 2px solid black;
}
</style>