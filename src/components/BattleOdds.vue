<template>
  <p class="mx-3 text-start">
    Enter the amount of offensive battalions, including one army to stay behind. 
    Enter the amount of defensive battalions in the territory you wish to occupy. 
  </p>
  <div class="d-flex justify-content-evenly pb-3 px-3">
    <div>
      <label for="offensiveBattalions" class="form-label text-start">
        Offensive Battalions
      </label>
      <input
        id="offensiveBattalions"
        type="number"
        class="form-control form-control-sm w-50"
        min="2"
        max="200"
        v-model="offensiveBattalions"
      />
    </div>
    <div>
      <label for="defensiveBattalions" class="form-label text-start">
        Defensive Battalions
      </label>
      <input
        id="defensiveBattalions"
        type="number"
        class="form-control form-control-sm w-50"
        min="1"
        max="200"
        v-model="defensiveBattalions"
      />
    </div>
    <button type="button" class="btn btn-primary mt-1 pt-3" @click="calculateOdds">
      <h2>Calculate</h2>
    </button>
  </div>

  <div id="battleResultsContainer" v-if="results.offensiveVictory != null">
    <div 
      v-if="results.offensiveVictory" 
      id="offensive-victory"
      class="d-flex justify-content-between px-1 pt-1 pb-1"
      :class="expanderStyleClass"
      data-bs-toggle="collapse" 
      data-bs-target="#occupiersList" 
      aria-expanded="false" 
      aria-controls="occupiersList"
      @click.prevent="toggleShowArmyData"
    >
      <h3>Offensive Victory</h3>
      <h3>{{ formatOddsValue(results.offensiveVictory) }}</h3>  
    </div>
    <div :class="armyDataStyle" id="occupiersList">
      <div v-for="(chance, key, index) in results.offensiveOccupiers" :key="index" class="d-flex justify-content-between ps-4 pe-3">
       
        <h4>{{ formatOccupiersKey(key) }}</h4>
        <h4>{{ formatOddsValue(chance) }}</h4>  
      </div>
    </div>
    <div id="defensiveVictoryChance" ref="defensiveVictoryRef" v-if="results.defensiveVictory" class="d-flex justify-content-between px-3">
      <h3>Defensive Victory</h3>
      <h3>{{ formatOddsValue(results.defensiveVictory) }}</h3>  
    </div>
  </div>

</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { calculateBattleOdds, formatOddsValue } from '@/oddsHelpers.js'

const defensiveVictoryRef = ref(null);
const offensiveBattalions = ref(5);
const defensiveBattalions = ref(3);
const results = reactive({
  offensiveVictory: null,
  defensiveVictory: null,
  offensiveOccupiers: []
});
const showArmyData = ref(false);
const armyDataStyle = computed(() => showArmyData.value ? 'collapse show' : 'collapse');
const expanderStyleClass = computed(() => showArmyData.value ? 'opacity-50' : null);

function toggleShowArmyData() {
  showArmyData.value = !showArmyData.value;
  if (showArmyData.value) {
    setTimeout(scrollToDefensiveVictory, 10);
  }
}

function scrollToDefensiveVictory() {
  defensiveVictoryRef.value.scrollIntoView({ behavior: "smooth" });
}

function formatOccupiersKey(rawKey) {
  let num = rawKey.split('b')[0];
  return `${num} offensive occupiers`;
}

async function calculateOdds() {
  Object.assign(results, (await calculateBattleOdds(offensiveBattalions.value, defensiveBattalions.value)));
  setTimeout(scrollToDefensiveVictory, 10);
}
</script>

<style scoped>
#offensive-victory {
  border: 2px solid rgba(83, 83, 83, 0.213);
  border-radius: 4px;
  background-color: rgba(128, 128, 128, 0.489);
  margin-left: 10px;
  margin-right: 10px;
}

#offensive-victory:hover {
  opacity: 75%;
  cursor: pointer;
}

h3 {
  margin-bottom: 0px;
}
</style>