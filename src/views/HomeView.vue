<template>
  <div class="home" id="home">
    
    <div class="d-flex mt-3 mb-5">
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
   
    <div class="d-flex mt-4 justify-content-center">
      <h2 v-if="resultMessage" class="result-message">{{ resultMessage }}</h2>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import DieComponent from '@/components/DieComponent.vue';
import { useVibrate } from '@vueuse/core';

const { vibrate } = useVibrate({ pattern: [300, 100, 300] });

const redDiceRef = ref(null);
const whiteDiceRef = ref(null);
const resultEditted = ref(false);
const diceRolled = ref(0);

const redDice = ref([
  { id: 1, isActive: true, isTogglable: true, isRed: true, isWinner: false, isLoser: false   },
  { id: 2, isActive: true, isTogglable: true, isRed: true, isWinner: false, isLoser: false   },
  { id: 3, isActive: true, isTogglable: true, isRed: true, isWinner: false, isLoser: false   },
]);

const whiteDice = ref([
  { id: 1, isActive: true, isTogglable: true, isRed: false, isWinner: false, isLoser: false   },
  { id: 2, isActive: true, isTogglable: true, isRed: false, isWinner: false, isLoser: false   },
]);

const activeRedDice = computed(() => redDice.value.filter((die) => die.isActive));
const activeWhiteDice = computed(() => whiteDice.value.filter((die) => die.isActive));

const resultMessage = computed(() => {
  const redWinnerCount = redDice.value.filter((die) => die.isWinner).length;
  const whiteWinnerCount = whiteDice.value.filter((die) => die.isWinner).length;

  if (redWinnerCount === 0 && whiteWinnerCount === 0) 
    return null;

  const redMinusWhite = redWinnerCount - whiteWinnerCount;
  switch(redMinusWhite) {
    case 2:
      return 'Red Sweep!';
    case 1:
      return 'Red Win';
    case -2:
      return 'White Sweep!';
    case -1:
      return 'White Win';
    default:
      return 'Tie';
  }
});

function getHighestValues(diceArray, isTwoMatches) {
  let highestValue;
  let secondHighestValue;

  diceArray.forEach((die) => {
    if (!highestValue || die.value > highestValue) {
      if (isTwoMatches && (!secondHighestValue || highestValue > secondHighestValue)) {
        secondHighestValue = highestValue;
      }
      highestValue = die.value;
    } 
    else if (isTwoMatches && (!secondHighestValue || die.value > secondHighestValue)) {
      secondHighestValue = die.value;
    }
  });

  return isTwoMatches ? [highestValue, secondHighestValue] : [highestValue];
}

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
  diceRolled.value = 0;
  redDice.value.forEach((die) => { die.value = null; die.isWinner = false; die.isLoser = false; }); 
  whiteDice.value.forEach((die) => { die.value = null; die.isWinner = false; die.isLoser = false; });
}

function getDieValue(die, value) {
  diceRolled.value++;
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

function processResults() {
  // const activeRedDice = redDice.value.filter((die) => die.isActive);
  // const activeWhiteDice = whiteDice.value.filter((die) => die.isActive);
  if (activeWhiteDice.value.findIndex((die) => die.value) === -1) {
    return null;
  }

  const isTwoMatches = activeRedDice.value.length > 1 && activeWhiteDice.value.length > 1;
  const highestRedValues = getHighestValues(activeRedDice.value, isTwoMatches);
  const highestWhiteValues = getHighestValues(activeWhiteDice.value, isTwoMatches);

  for (let i = 0; i < highestRedValues.length; i++) {
    if (highestRedValues[i] > highestWhiteValues[i]) {
      assignWinnerAndLoser(activeRedDice.value, activeWhiteDice.value, highestRedValues[i], highestWhiteValues[i]);
    } else {
      assignWinnerAndLoser(activeWhiteDice.value, activeRedDice.value, highestWhiteValues[i], highestRedValues[i]);
    }
  }
}

function assignWinnerAndLoser(winnerArr, loserArr, winningValue, losingValue) {
  winnerArr.find((die) => die.value === winningValue && !die.isWinner && !die.isLoser).isWinner = true;
  loserArr.find((die) => die.value === losingValue && !die.isWinner && !die.isLoser).isLoser = true;
}

// const odds = computed(() => {
//   activeRedDice.value.forEach((die) => 

// });

watch(
  () => diceRolled.value,
  (value) => {
    if (value === activeRedDice.value.length + activeWhiteDice.value.length) {
      processResults();
    }
  }
);

</script>

<style scoped>
.home {
  width: 420px;
  height: 650px;
  position: absolute;
  z-index: 1;
  background-image: url('@/assets/highly-blurred-map-2.png');
}

#background-image {
  position: fixed;
  /* width: 160vw; */
  z-index: 0;
}

/* .winner-border {
  border: 5px solid yellow;
  border-radius: 10px;
} */

.result-message {
  border: 2px solid rgb(86, 86, 86);
  background: rgb(228, 228, 228);
  height: 40px;
  width: 250px;
  border-radius: 20%;
}

hr {
  border: 5px solid black;
}

/* @media only screen and (min-width: 1400px) {
  .home {
    width: 400px;
  }
} */
</style>
