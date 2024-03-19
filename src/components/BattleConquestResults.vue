<template>
  <div id="battleResultsContainer" v-if="results.offensiveVictory != null">
    <div 
      v-if="results.offensiveVictory"
      class="d-flex justify-content-between px-1 pt-1 pb-1 button-border"
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
    <div id="occupiersList" :class="occupiersListStyle" @click="toggleOccupiersList">
      <div v-for="(obj, index) in computedOccupierArray" :key="index" class="d-flex justify-content-between ps-3 pe-2">
       <h4>{{ obj.label }}</h4>
       <h4>{{ formatOddsValue(obj.chance) }}</h4>  
     </div>
    </div>
    <div id="defensiveVictoryChance" ref="defensiveVictoryRef" v-if="results.defensiveVictory" class="d-flex justify-content-between px-3">
      <h3>Defensive Victory</h3>
      <h3>{{ formatOddsValue(results.defensiveVictory) }}</h3>  
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineProps } from 'vue';
import { formatOddsValue } from '@/oddsHelpers.js';

const props = defineProps({
  results: {
    type: Object,
    default: null
  },
  rawOccupierArray: {
    type: Array,
    default: null
  }
});

const defensiveVictoryRef = ref(null);
const showArmyData = ref(false);
const isOccupiersCondensed = ref(true);
const expanderStyleClass = computed(() => showArmyData.value ? 'opacity-50' : null);
const battalionCount = computed(() => props.rawOccupierArray.length ?? null);

const occupiersListStyle = computed(() => {
  let styleClasses = showArmyData.value ? 'collapse pt-1 show' : 'collapse pt-1';
  return battalionCount.value > 10
    ? `${styleClasses} button-border`
    : `${styleClasses} pe-2`
});

const computedOccupierArray = computed(() => {
  if (!isOccupiersCondensed.value) {
    return props.rawOccupierArray;
  }
    
  let resultArray = [];
  const interval = battalionCount.value > 55
    ? 10
    : Math.floor((battalionCount.value - 2) / 9) + 1;

  for (let i = interval; i < battalionCount.value; i += interval) {
    resultArray.push(props.rawOccupierArray[i]);
  }

  if (resultArray[resultArray.length - 1].label !== props.rawOccupierArray[battalionCount.value - 1].label) {
    resultArray.push(props.rawOccupierArray[battalionCount.value - 1]);
  }
  return resultArray;
});

function toggleShowArmyData() {
  showArmyData.value = !showArmyData.value;
  if (showArmyData.value) {
    setTimeout(scrollToDefensiveVictory, 10);
  }
}

function toggleOccupiersList() {
  if (battalionCount.value > 10)
    isOccupiersCondensed.value = !isOccupiersCondensed.value;
}

function scrollToDefensiveVictory() {
  console.log('hi');
  defensiveVictoryRef.value.scrollIntoView({ behavior: "smooth" });
}

watch(
  () => props.rawOccupierArray,
  () => {
    console.log('toggle');
    isOccupiersCondensed.value = true;
    setTimeout(scrollToDefensiveVictory, 10);
  }
);
</script>

<style scoped>
.button-border {
  border: 2px solid rgba(83, 83, 83, 0.213);
  border-radius: 4px;
  background-color: rgba(128, 128, 128, 0.489);
  margin-left: 10px;
  margin-right: 10px;
}

.button-border:hover {
  opacity: 75%;
  cursor: pointer;
}

h3 {
  margin-bottom: 0px;
}
</style>