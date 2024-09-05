<template>
  <p class="mx-3 text-start">
    Enter a string of enemy territories to plan your conquest. 
    Click 'Calculate' to view your odds of success. 
  </p>
  <div class="pb-3 px-3">
    <div class="d-flex flex-column mb-3 pb-3 bottom-border">
      <label for="offensiveBattalions" class="form-label pe-2 mb-0">
        <h3 class="text-start" >Offensive Battalions</h3>
      </label>
      <input
        id="offensiveBattalions"
        type="number"
        class="form-control form-control-sm w-15 input-field"
        min="2"
        max="100"
        v-model="offensiveBattalions"
      />
    </div>

    <h3 class="text-start">Enemy Territories</h3>
    <div d-flex>
      <label class="w-8"></label>
      <label class="w-45 text-start">Territory Name</label>
      <label class="w-21 text-start">Defensive Battalions</label>
      <label class="w-21 text-start">Desired # of Occupiers</label>
      <label class="w-5"></label>
    </div>
    <Sortable
      :list="rawTerritoryList"
      itemKey="id"
      :options="{sort: true, handle: '.sort-icon'}"
      @end="updateList"
    >
      <template #item="{element}">
        <div v-if="!element.isDeleted" class="draggable d-flex" :key="element.id">
          <font-awesome-icon 
            class="pt-1 pe-1 w-8 sort-icon"
            size="xl" 
            icon="sort"
          />
          <input
            :id="element.id"
            type="text"
            v-model="element.name"
            maxLength="50"
            class="w-45"
            :class="styleClasses.INPUT_FIELD"
            @focus="onFocus"
            :placeholder="element.placeholder"
          />
          <input
            type="number"
            min="1"
            v-model="element.defensiveBattalions"
            class="w-21 ms-1"
            :class="styleClasses.INPUT_FIELD"
          />
          <input
            type="number"
            min="1"
            v-model="element.desiredOccupiers"
            class="w-21 ms-1"
            :class="styleClasses.INPUT_FIELD"
            :disabled="isLastTerritory(element.id)"
          />
          <font-awesome-icon
            :class="styleClasses.END_ICON"
            size="2xl" 
            icon="xmark" 
            @click="removeTerritory(element)"
          />
        </div>
      </template>
    </Sortable>

    <div class="d-flex">
      <font-awesome-icon 
        class="pt-1 pe-1 w-8 opacity-0"
        size="xl" 
        icon="sort"
      />
      <input
        type="text"
        v-model="newTerritory.name"
        maxLength="50"
        class="w-45 opacity-25"
        :class="styleClasses.INPUT_FIELD"
        @keyup.enter="addNewTerritory"
        @focus="onFocus"
        :placeholder="newTerritory.placeholder"
      />
      <input
        type="number"
        min="1"
        v-model="newTerritory.defensiveBattalions"
        class="w-21 ms-1 opacity-25"
        :class="styleClasses.INPUT_FIELD"
        @keyup.enter="addNewTerritory"
      />
      <input
        type="number"
        min="1"
        v-model="newTerritory.desiredOccupiers"
        class="w-21 ms-1 opacity-25"
        :class="styleClasses.INPUT_FIELD"
        @keyup.enter="addNewTerritory"
      />
      <font-awesome-icon
        class="blue-color"
        :class="styleClasses.END_ICON"
        size="2xl" 
        icon="plus" 
        @click="addNewTerritory"
      />
    </div>
    <button 
      ref="calculateButton" 
      type="button" 
      class="btn btn-primary mt-2 mb-2 pt-3" 
      :disabled="isCalculating" 
      @click="calculateOdds"
    >
      <h2>{{ calculateButtonLabel }}</h2>
    </button>
    <BattleConquestResults 
      :results="results" 
      :rawOccupierArray="rawOccupierArray"
      :rawHoldOffArray="rawHoldOffArray"
    />
  </div>
</template>

<script setup>
import { reactive, ref, nextTick, computed } from "vue";
import { Sortable } from "sortablejs-vue3";
import { calculateConquestOdds, formatOccupiers, formatDefensiveHoldoffs } from '@/oddsHelpers.js';
import BattleConquestResults from '@/components/BattleConquestResults.vue';

const styleClasses = {
  INPUT_FIELD: "form-control mb-1 input-field",
  END_ICON: "ps-1 pb-1 align-self-center w-5 btn-hover"
};

const isCalculating = ref(null);
const newTerritory = reactive({});
const calculateButton = ref(null);
const offensiveBattalions = ref(4);
const orderedTerritoryList = reactive({ Items: [] });
const rawOccupierArray = ref([{label: null, chance: null}]);
const rawHoldOffArray = ref([{label: null, chance: null}]);
const rawTerritoryList = ref([
  {
    id: getGuid(),
    sortOrder: 1,
    name: null,
    placeholder: "Territory 1",
    defensiveBattalions: 1,
    desiredOccupiers: 1
  }
]);

const results = reactive({
  offensiveVictory: null,
  defensiveVictory: null,
  offensiveOccupiers: []
});

const calculateButtonLabel = computed(() => isCalculating.value ? 'Calculating...' : 'Calculate');

Object.assign(orderedTerritoryList.Items, rawTerritoryList.value);
setUpNewTerritory();

function isLastTerritory(id) {
  return (orderedTerritoryList.Items[orderedTerritoryList.Items.length - 1].id === id);
}

function getGuid() {
  return Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);
}

function setUpNewTerritory() {
  newTerritory.id = getGuid();
  newTerritory.name = null;
  newTerritory.placeholder = `Territory ${rawTerritoryList.value.length + 1}`;
  newTerritory.defensiveBattalions = 1;
  newTerritory.desiredOccupiers = 1;
}

function updateList(e) {
  orderedTerritoryList.Items.splice(e.newIndex, 0, orderedTerritoryList.Items.splice(e.oldIndex, 1)[0]);
  setSortOrders();
}

function setSortOrders() {
  orderedTerritoryList.Items.forEach((obj, idx) => {
    obj.sortOrder = idx + 1;
  })
}

async function addNewTerritory() {
  let newTerr = {};
  Object.assign(newTerr, newTerritory);
  rawTerritoryList.value.push(newTerr);
  orderedTerritoryList.Items.push(newTerr);
  setUpNewTerritory();
  await nextTick();
  calculateButton.value.scrollIntoView({ behavior: "smooth" });
}

async function removeTerritory(territory) {
  territory.isDeleted = true;
  orderedTerritoryList.Items = orderedTerritoryList.Items.filter((obj) => obj.id !== territory.id);
  setSortOrders();
}

async function calculateOdds() {
  isCalculating.value = true;
  await new Promise((r) => setTimeout(r, 100));
  Object.assign(results, (await calculateConquestOdds(offensiveBattalions.value, orderedTerritoryList.Items)));

  let potentialOccupierCount = offensiveBattalions.value - 1;
  for (let i = 0; i < orderedTerritoryList.Items.length - 1; i++) {
    potentialOccupierCount -= orderedTerritoryList.Items[i].desiredOccupiers;
  }
  
  rawOccupierArray.value = formatOccupiers(results, potentialOccupierCount);
  rawHoldOffArray.value = formatDefensiveHoldoffs(results, orderedTerritoryList.Items);
  isCalculating.value = false;
}
</script>

<style scoped>
.label { float: left; }

.sort-icon:hover {
  cursor: move;
}

.input-field {
  background-color: rgba(128, 128, 128, 0.252);
}

.bottom-border {
  border-bottom: 2px solid rgba(255, 255, 255, 0.326);
}

.w-5 {
  width: 5%;
}

.w-8 {
  width: 8%;
}

.w-15 {
  width: 15%;
}

.w-21 {
  width: 21%;
}

.w-45 {
  width: 45%;
}

.btn-hover:hover {
  cursor: pointer;
}

.blue-color {
  color: blue;
}

.form-control:disabled {
  background-color: rgba(128, 128, 128, 0.252);
  opacity: 25%;
}

.opacity-25 {
  opacity: 25% !important;
}
</style>