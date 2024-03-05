<template>
  <p class="mx-3 text-start">
    Enter the amount of offensive armies, including one army to stay behind. 
    Enter the amount of defensive armies in an adjacent territory. 
  </p>
  <div class="d-flex justify-content-evenly mb-3 px-3">
    <div>
      <label for="offensiveArmies" class="form-label text-start">
        Offensive Armies
      </label>
      <input
        id="offensiveArmies"
        type="number"
        class="form-control form-control-sm w-50"
        min="2"
        max="50"
        v-model="redArmies"
      />
    </div>
    <div>
      <label for="defensiveArmies" class="form-label text-start">
        Defensive Armies
      </label>
      <input
        id="defensiveArmies"
        type="number"
        class="form-control form-control-sm w-50"
        min="1"
        max="50"
        v-model="whiteArmies"
      />
    </div>
    <button type="button" class="btn btn-primary mt-1 pt-3" @click="calculateOdds">
      <h2>Calculate</h2>
    </button>
  </div>

  <div id="battleResultsContainer" v-if="results.redVictory != null">
    <div 
      v-if="offensiveVictoryChance" 
      id="offensive-victory"
      class="d-flex justify-content-between px-1 pt-1 pb-1"
      :class="expanderStyleClass"
      data-bs-toggle="collapse" 
      data-bs-target="#occupiersList" 
      aria-expanded="false" 
      aria-controls="occupiersList"
      @click="toggleShowArmyData"
    >
      <h3>Offensive Victory</h3>
      <h3>{{ offensiveVictoryChance }}</h3>  
    </div>
    <div :class="armyDataStyle" id="occupiersList">
      <div v-for="(chance, key, index) in results.redOccupiers" :key="index" class="d-flex justify-content-between ps-4 pe-3">
       
        <h4>{{ formatOccupiersKey(key) }}</h4>
        <h4>{{ formatChance(chance) }}</h4>  
      </div>
    </div>
    <div id="defensiveVictoryChance" ref="defensiveVictoryRef" v-if="defensiveVictoryChance" class="d-flex justify-content-between px-3">
      <h3>Defensive Victory</h3>
      <h3>{{ defensiveVictoryChance }}</h3>  
    </div>
  </div>

</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { calculateVictoryOdds } from '@/oddsHelpers.js'
// import DieComponent from '@/components/DieComponent.vue';

const defensiveVictoryRef = ref(null);
const redArmies = ref(5);
const whiteArmies = ref(3);
const results = reactive({
  redVictory: null,
  whiteVictory: null,
  redOccupiers: []
});
const showArmyData = ref(false);
const armyDataStyle = computed(() => showArmyData.value ? 'collapse show' : 'collapse');
const expanderStyleClass = computed(() => showArmyData.value ? 'opacity-50' : null);

function toggleShowArmyData() {
  showArmyData.value = !showArmyData.value;
  if (showArmyData.value) {
    //defensiveVictoryRef.value.scrollIntoView({ behavior: "smooth" });
    // window.scrollTo(0, document.body.scrollHeight);
    // const element = document.getElementById("battleResultsContainer");
    // element.scrollIntoView({block: 'end'});
    // window.scrollTo({
    //     top: document.body.scrollHeight,
    //     behavior: 'smooth'
    //   })
  }
}

function formatOccupiersKey(rawKey) {
  let num = rawKey.split('a')[0];
  return `${num} offensive occupiers`;
}

function formatChance(rawChance) {
  return `${(rawChance * 100).toFixed(2)}%`;
}

const offensiveVictoryChance = computed(() =>
  results.redVictory ? `${(results.redVictory * 100).toFixed(2)}%` : null
);

const defensiveVictoryChance = computed(() =>
  results.whiteVictory ? `${(results.whiteVictory * 100).toFixed(2)}%` : null
);

async function calculateOdds() {
  // results.redVictory = null;
  // results.whiteVictory = null;
  
  // isLoading.value = true;
  // console.log('calculate');
  const odds = await calculateVictoryOdds(redArmies.value, whiteArmies.value);
  Object.assign(results, odds);
  console.log('results', results);
  //isLoading.value = false;
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