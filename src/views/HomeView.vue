<template>
  <div class="home">
    <div class="d-flex my-5">
      <div v-for="die in redDice" :key="die.id">
        <DieComponent ref="redDiceRef" :die="die" @dieRolled="getDieValue" @toggleShow="toggleShow"/>
      </div>
    </div>
    <div class="d-flex my-5">
      <div v-for="die in whiteDice" :key="die.id">
        <DieComponent ref="whiteDiceRef" :die="die" @dieRolled="getDieValue" @toggleShow="toggleShow"/>
      </div>
    </div>
    <button type="button" class="btn btn-primary pt-2" @click="rollDice"><h2>Roll</h2></button>

    <div v-if="rollResult" :class="resultStyleClass">
      <div v-for="(loser, index) in rollResult.redLosers" :key="index">
        <LostDie/>
      </div>
      <div v-for="(loser, index) in rollResult.whiteLosers" :key="index">
        <LostDie :isRed="false"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import DieComponent from '@/components/DieComponent.vue';
import LostDie from '@/components/LostDie.vue';
import { useVibrate } from '@vueuse/core';

const { vibrate } = useVibrate({ pattern: [300, 100, 300] });

const redDiceRef = ref(null);
const whiteDiceRef = ref(null);
// const showRollResult = ref(false);
const resultEditted = ref(false);

const redDice = ref([
  { id: 1, isActive: true, isTogglable: true, isRed: true },
  { id: 2, isActive: true, isTogglable: true, isRed: true },
  { id: 3, isActive: true, isTogglable: true, isRed: true },
]);

const whiteDice = ref([
  { id: 1, isActive: true, isTogglable: true, isRed: false },
  { id: 2, isActive: true, isTogglable: true, isRed: false },
]);

function getHighestValues(diceArray, isTwoLosers) {
  let highestValue;
  let secondHighestValue;

  diceArray.forEach((die) => {
    if (!highestValue || die.value > highestValue) {
      if (isTwoLosers && (!secondHighestValue || highestValue > secondHighestValue)) {
        secondHighestValue = highestValue;
      }
      highestValue = die.value;
    } 
    else if (isTwoLosers && (!secondHighestValue || die.value > secondHighestValue)) {
      secondHighestValue = die.value;
    }
  });

  return isTwoLosers ? [highestValue, secondHighestValue] : [highestValue];
}

const resultStyleClass = computed(() => 
  resultEditted.value ? 'd-flex opacity-25' : 'd-flex'
)

const rollResult = computed(() => {
  const activeRedDice = redDice.value.filter((die) => die.isActive);
  const activeWhiteDice = whiteDice.value.filter((die) => die.isActive);
  if (activeWhiteDice.findIndex((die) => die.value) === -1) {
    return null;
  }

  const isTwoLosers = activeRedDice.length > 1 && activeWhiteDice.length > 1;
  const highestRedValues = getHighestValues(activeRedDice, isTwoLosers);
  const highestWhiteValues = getHighestValues(activeWhiteDice, isTwoLosers);

  let redLosers = 0;
  let whiteLosers = 0;

  for (let i = 0; i < highestRedValues.length; i++) {
    if (highestRedValues[i] > highestWhiteValues[i])
      whiteLosers++;
    else
      redLosers++;
  }

  return { redLosers: redLosers, whiteLosers: whiteLosers };
});

async function rollDice() {
  resetDiceValues();
  vibrate();
  redDiceRef.value.forEach((die) => {
    die.rollDie();
  });
  whiteDiceRef.value.forEach((die) => {
    die.rollDie();
  });
  resultEditted.value = false;
}

function resetDiceValues() {
  redDice.value.forEach((die) => die.value = null);
  whiteDice.value.forEach((die) => die.value = null);
}

function getDieValue(die, value) {
  die.value = value;
}

function toggleShow(die) {
  die.isActive = !die.isActive;
  setToggable(die.isRed ? redDice.value : whiteDice.value);
  resultEditted.value = true;
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
