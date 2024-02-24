<template>
  <div class="home">
    <div class="d-flex my-5">
      <DieComponent ref="redDie1" @change="getDieValue"/>
      <DieComponent ref="redDie2" @change="getDieValue"/>
      <DieComponent ref="redDie3" @change="getDieValue"/>
    </div>
    <div class="d-flex my-5">
      <DieComponent ref="whiteDie1" :is-red="false" @change="getDieValue"/>
      <DieComponent ref="whiteDie2" :is-red="false" @change="getDieValue"/>
    </div>
    <button type="button" class="btn btn-primary pt-2" @click="rollDice"><h2>Roll</h2></button>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import DieComponent from '@/components/DieComponent.vue'

const redDie1 = ref(null);
const redDie2 = ref(null);
const redDie3 = ref(null);
const whiteDie1 = ref(null);
const whiteDie2 = ref(null);

const diceArray = ref([
  redDie1, 
  redDie2, 
  redDie3, 
  whiteDie1, 
  whiteDie2, 
]);

async function rollDice() {
  diceArray.value.forEach((die) => die.value.rollDie());
}

function getDieValue(value, isRed) {
  console.log(value, isRed);
}

</script>

<style scoped>
.home {
  width: 400px;
}
</style>
