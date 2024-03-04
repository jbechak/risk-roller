<template>
  <p class="mx-3 text-start">
      Calculates the odds of a single dice roll. Click on the dice to toggle which ones are active.
  </p>

  <div v-for="(instance, index) in odds" :key="index">
    <div class="d-flex justify-content-between px-3">
      <h3>{{ instance.label }}</h3>
      <h3>{{ `${(instance.chance * 100).toFixed(2)}%` }}</h3>      
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import { calculateOdds } from '@/oddsHelpers.js'

const props = defineProps({
  redDiceCount: {
    type: Number,
    default: 3
  },
  whiteDiceCount: {
    type: Number,
    default: 2
  },
});

const odds = computed(() => calculateOdds(props.redDiceCount, props.whiteDiceCount));
</script>

<style scoped>
</style>