<template>
    <p class="mx-3 text-start">
    Enter the amount of armies in an offensive armies, including one army to stay behind. 
    Enter the amount of defensive armies in an adjacent territory. 
  </p>
  <div class="d-flex justify-content-evenly mb-3">
    <div>
      <label for="offensiveArmies" class="form-label">
        Offensive Armies
      </label>
      <input
        id="offensiveArmies"
        type="number"
        class="form-control form-control-sm"
        min="2"
        max="50"
        v-model="redArmies"
      />
    </div>
    <div>
      <label for="defensiveArmies" class="form-label">
        Defensive Armies
      </label>
      <input
        id="defensiveArmies"
        type="number"
        class="form-control form-control-sm"
        min="1"
        max="50"
        v-model="whiteArmies"
      />
    </div>
    <button type="button" class="btn btn-primary mt-1 pt-3" @click="calculateOdds">
      <h2>Calculate</h2>
    </button>
  </div>
  <div v-if="offensiveVictoryChance" class="d-flex justify-content-between px-3">
    <h3>Offensive Victory</h3>
    <h3>{{ offensiveVictoryChance }}</h3>  
  </div>
  <div v-if="defensiveVictoryChance" class="d-flex justify-content-between px-3">
    <h3>Defensive Victory</h3>
    <h3>{{ defensiveVictoryChance }}</h3>  
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { calculateVictoryOdds } from '@/oddsHelpers.js'

const redArmies = ref(4);
const whiteArmies = ref(2);
const results = reactive({
  redVictory: null,
  whiteVictory: null
});

const offensiveVictoryChance = computed(() =>
  results.redVictory ? `${(results.redVictory * 100).toFixed(2)}%` : null
);

const defensiveVictoryChance = computed(() =>
  results.whiteVictory ? `${(results.whiteVictory * 100).toFixed(2)}%` : null
);

function calculateOdds() {
  console.log('calculate');
  const odds = calculateVictoryOdds(redArmies.value, whiteArmies.value);
  Object.assign(results, odds);
}

</script>

<style scoped>

</style>