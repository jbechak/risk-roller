<template>
  <div v-for="(instance, index) in props.odds" :key="index">
    <div class="d-flex justify-content-between px-3">
      <h3>{{ instance.label }}</h3>
      <h3>{{ `${(instance.chance * 100).toFixed(2)}%` }}</h3>      
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  odds: {
    type: Array,
    default: null
  },
});
</script>