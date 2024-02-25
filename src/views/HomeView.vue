<template>
  <div class="home">
    <div class="d-flex my-5">
      <div v-for="die in redDice" :key="die.id">
        <DieComponent ref="redDiceRef" :die="die" @change="getDieValue" @toggleShow="toggleShow"/>
      </div>
    </div>
    <div class="d-flex my-5">
      <div v-for="die in whiteDice" :key="die.id">
        <DieComponent ref="whiteDiceRef" :die="die" @change="getDieValue" @toggleShow="toggleShow"/>
      </div>
    </div>
    <button type="button" class="btn btn-primary pt-2" @click="rollDice"><h2>Roll</h2></button>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import DieComponent from '@/components/DieComponent.vue';
import { useVibrate } from '@vueuse/core';

const { vibrate } = useVibrate({ pattern: [300, 100, 300] });

const redDiceRef = ref(null);
const whiteDiceRef = ref(null);

const redDice = ref([
  { id: 1, isActive: true, isTogglable: true, isRed: true },
  { id: 2, isActive: true, isTogglable: true, isRed: true },
  { id: 3, isActive: true, isTogglable: true, isRed: true },
]);

const whiteDice = ref([
  { id: 1, isActive: true, isTogglable: true, isRed: false },
  { id: 2, isActive: true, isTogglable: true, isRed: false },
]);

async function rollDice() {
  vibrate();
  redDiceRef.value.forEach((die) => {
    die.rollDie();
  });
  whiteDiceRef.value.forEach((die) => {
    die.rollDie();
  });
}

function getDieValue(value, isRed) {
  console.log(value, isRed);
}

function toggleShow(die) {
  die.isActive = !die.isActive;
  setToggable(die.isRed ? redDice.value : whiteDice.value);
}

function setToggable(dice) {
  const activeDice = dice.filter((die) => die.isActive);
  if (activeDice.length === 1) {
    activeDice[0].isTogglable = false;
  } else {
    dice.forEach((die) => { if (!die.isTogglable) die.isTogglable = true })
  }
}
</script>

<style scoped>
.home {
  width: 400px;
}

/* @media only screen and (min-width: 1400px) {
  .home {
    width: 400px;
  }
} */
</style>
