<template>
  <div>
    <h2 class="m-0">{{ props.message }}</h2>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  message: {
    type: String,
    default: null
  },
});

</script>