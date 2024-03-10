<template>
  <p class="mx-3 text-start">
    Enter a string of enemy territories to plan your conquest. 
    You may drag them to reorder. 
  </p>
  <div class="pb-3 px-3">
    <div class="d-flex flex-column mb-3 pb-3 bottom-border">
      <label for="offensiveArmies" class="form-label pe-2 mb-0">
        <h3 class="text-start" >Offensive Armies</h3>
      </label>
      <input
        id="offensiveArmies"
        type="number"
        class="form-control form-control-sm w-15 input-field"
        min="2"
        max="100"
        v-model="offensiveArmies"
      />
    </div>

    <h3 class="text-start">Enemy Territories</h3>
    <div d-flex>
      <!-- <label for="" class="w-10">Order</label> -->
      <label for="" class="w-55">Territory Name</label>
      <label for="" class="w-20">Defensive Armies</label>
      <label for="" class="w-20">Desired Occupiers</label>
      <label for="" class="w-5"></label>
      <!-- <span class="w-5"></span> -->
    </div>
    <Sortable
      :list="rawTerritoryList"
      itemKey="id"
      :options="{sort: true, handle: '.sort-icon'}"
      @end="updateList"
      @remove="removed"
      @update="update"
      @sort="onSort"
    >
      <template #item="{element, index}">
        <div v-if="!element.isDeleted" class="draggable d-flex" :key="element.id">
          <font-awesome-icon 
            :class="getSortIconStyleClass(index)" 
            class="pt-1 pe-1 w-5"
            size="xl" 
            icon="sort"
          />
          <!-- <div class="align-self-center w-10 pb-1" :class="getStyleClass(index)" >
            {{ element.sortOrder }}
          </div> -->
          <input
            :id="element.id"
            type="text"
            ref="spaceRefs"
            v-model="element.name"
            maxLength="50"
            class="form-control mb-1 word-list w-50 input-field"
            :class="getStyleClass(index)" 
            @keyup.enter="submitTerritory(element, index)"
            @focus="onFocus"
            :placeholder="element.placeholder"
          />
          <input
            type="number"
            min="1"
            v-model="element.defensiveArmies"
            class="form-control mb-1 word-list w-20 ms-1 input-field draggable-item"
            :class="getStyleClass(index)" 
            @keyup.enter="submitTerritory(element, index)"
          />
          <input
            type="number"
            min="1"
            v-model="element.desiredOccupiers"
            class="form-control mb-1 word-list w-20 ms-1 input-field"
            :class="getStyleClass(index)" 
            @keyup.enter="submitTerritory(element, index)"
          />
          <div class="align-self-center w-5 btn-hover">
            <font-awesome-icon 
              v-if="index === rawTerritoryList.length - 1"
              class="pb-1 ps-half blue-color"
              size="2xl" 
              icon="plus" 
              @click="submitTerritory(element, index)"
            />
            <font-awesome-icon
              v-else
              class="ps-1 pb-1"
              size="2xl" 
              icon="xmark" 
              @click="removeTerritory(element)"
            />
          </div>
        </div>
      </template>
    </Sortable>

    <button ref="calculateButton" type="button" class="btn btn-primary mt-1 pt-3" @click="calculateOdds">
      <h2>Calculate</h2>
    </button>
  </div>
</template>

<script setup>
import { reactive, ref, nextTick } from "vue";
import { Sortable } from "sortablejs-vue3";

const calculateButton = ref(null);
const offensiveArmies = ref(4);
const rawTerritoryList = ref([
  {
    id: getGuid(),
    sortOrder: 1,
    name: null,
    placeholder: "Territory 1",
    defensiveArmies: 1,
    desiredOccupiers: 1
  },
  {
    id: getGuid(),
    sortOrder: 2,
    name: null,
    placeholder: "Territory 2",
    defensiveArmies: 1,
    desiredOccupiers: 1
  }
]);

function getStyleClass(index) {
  if (index === rawTerritoryList.value.length - 1) {
    return 'opacity-25';
  } 
  return null
}

function getSortIconStyleClass(index) {
  return index === rawTerritoryList.value.length - 1
    ? 'opacity-25'
    : 'sort-icon';
  // if (index === rawTerritoryList.value.length - 1) {
  //   return 'opacity-25';
  // } 
  // else return 'sort-icon';
}

const orderedTerritoryList = reactive({ Items: [] });
Object.assign(orderedTerritoryList.Items, rawTerritoryList.value);

function getGuid() {
   return Math.random().toString(36).substring(2, 15) +
   Math.random().toString(36).substring(2, 15);
}

function updateList(e) {
  console.log('end');
  console.log(e);
  //rawTerritoryList.value.splice(e.newIndex, 0, rawTerritoryList.value.splice(e.oldIndex, 1)[0]);
  orderedTerritoryList.Items.splice(e.newIndex, 0, orderedTerritoryList.Items.splice(e.oldIndex, 1)[0]);
  setSortOrders();
}

function update(e) {
  console.log('update');
  console.log(e);
}

function onSort(e) {
  console.log('sort');
  console.log(e);
}

function removed(e) {
  console.log('removed');
  console.log(e);
}

function setSortOrders() {
  orderedTerritoryList.Items.forEach((obj, idx) => {
    obj.sortOrder = idx + 1;
  })
}

async function submitTerritory(newTerritoryObject, index) {
  if (index !== rawTerritoryList.value.length - 1)
    return;
  //orderedTerritoryList.Items.push(newTerritoryObject);
  //orderedTerritoryList.Items[index].name = newTerritoryObject.name;

  if (rawTerritoryList.value.findIndex((x) => x.name === "") === -1) {
    const id = getGuid();
    let newTerritory = {
      id: id,
      sortOrder: orderedTerritoryList.Items.length + 1,
      //sortOrder: rawTerritoryList.value.length + 1,
      name: null, 
      placeholder: `Territory ${rawTerritoryList.value.length + 1}`,
      defensiveArmies: 1,
      desiredOccupiers: 1
    }
    rawTerritoryList.value.push(newTerritory);
    orderedTerritoryList.Items.push(newTerritory);
  }

  await nextTick();
  //const nextIndex = orderedTerritoryList.Items.length > index + 1 ? index + 1 : index;
	//document.getElementById(orderedTerritoryList.Items[nextIndex].id).focus();
  calculateButton.value.scrollIntoView({ behavior: "smooth" });
}

async function removeTerritory(territory) {
  console.log(territory);
  territory.isDeleted = true;
  orderedTerritoryList.Items = orderedTerritoryList.Items.filter((obj) => obj.id !== territory.id);
  setSortOrders();

  // const rawIndex = rawTerritoryList.value.findIndex((obj) => obj.id === territory.id);
  // const orderedIndex = orderedTerritoryList.Items.findIndex((obj) => obj.id === territory.id)
  // console.log(rawIndex);
  // console.log(orderedIndex);
  // rawTerritoryList.value.splice(rawIndex, 1);
  // orderedTerritoryList.Items.splice(orderedIndex, 1);
  // await nextTick();
  // rawTerritoryList.value = rawTerritoryList.value.filter((obj) => obj.id !== territory.id);
  // orderedTerritoryList.Items = orderedTerritoryList.Items.filter((obj) => obj.id !== territory.id);
  //setSortOrders();
  //rawTerritoryList.value.findIndex(())
  // rawTerritoryList.value.splice(indexOf(territory), 1)
  // orderedTerritoryList.Items.splice(indexOf(territory), 1)
}

</script>

<style scoped>
.label { float: left; }

.word-list:hover {
  cursor: move;
}

.input-field {
  background-color: rgba(128, 128, 128, 0.252);
}

.bottom-border {
  border-bottom: 2px solid rgba(255, 255, 255, 0.326);
}

.circle-btn {
  border-radius: 50%;
}

.w-5 {
  width: 5%;
}

.w-10 {
  width: 10%;
}

.w-15 {
  width: 15%;
}

.w-20 {
  width: 20%;
}

.w-45 {
  width: 45%;
}

.w-55 {
  width: 55%;
}

.ps-half {
  padding-left: 2px;
}

.btn-hover:hover {
  cursor: pointer;
}

.blue-color {
  color: blue;
}
</style>