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
      <label for="" class="w-55">Territory Name</label>
      <label for="" class="w-20">Defensive Armies</label>
      <label for="" class="w-20">Desired Occupiers</label>
      <label for="" class="w-5"></label>
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
      <template #item="{element}">
        <div v-if="!element.isDeleted" class="draggable d-flex" :key="element.id">
          <font-awesome-icon 
            class="pt-1 pe-1 w-10 sort-icon"
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
            v-model="element.defensiveArmies"
            class="w-20 ms-1"
            :class="styleClasses.INPUT_FIELD"
          />
          <input
            type="number"
            min="1"
            v-model="element.desiredOccupiers"
            class="w-20 ms-1"
            :class="styleClasses.INPUT_FIELD"
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
      <input
        type="text"
        v-model="newTerritory.name"
        maxLength="50"
        class="w-45 ms-5 opacity-25"
        :class="styleClasses.INPUT_FIELD"
        @keyup.enter="addNewTerritory"
        @focus="onFocus"
        :placeholder="newTerritory.placeholder"
      />
      <input
        type="number"
        min="1"
        v-model="newTerritory.defensiveArmies"
        class="w-20 ms-1 opacity-25"
        :class="styleClasses.INPUT_FIELD"
        @keyup.enter="addNewTerritory"
      />
      <input
        type="number"
        min="1"
        v-model="newTerritory.desiredOccupiers"
        class="w-20 ms-1 opacity-25"
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

    <button ref="calculateButton" type="button" class="btn btn-primary mt-1 pt-3" @click="calculateOdds">
      <h2>Calculate</h2>
    </button>
  </div>
</template>

<script setup>
import { reactive, ref, nextTick } from "vue";
import { Sortable } from "sortablejs-vue3";

const styleClasses = {
  INPUT_FIELD: "form-control mb-1 input-field",
  END_ICON: "ps-1 pb-1 align-self-center w-5 btn-hover"
};

const newTerritory = reactive({});
const calculateButton = ref(null);
const offensiveArmies = ref(4);
const orderedTerritoryList = reactive({ Items: [] });
const rawTerritoryList = ref([
  {
    id: getGuid(),
    sortOrder: 1,
    name: null,
    placeholder: "Territory 1",
    defensiveArmies: 1,
    desiredOccupiers: 1
  }
]);

Object.assign(orderedTerritoryList.Items, rawTerritoryList.value);
setUpNewTerritory();

function getGuid() {
   return Math.random().toString(36).substring(2, 15) +
   Math.random().toString(36).substring(2, 15);
}

function setUpNewTerritory() {
  newTerritory.id = getGuid();
  newTerritory.name = null;
  newTerritory.placeholder = `Territory ${rawTerritoryList.value.length + 1}`;
  newTerritory.defensiveArmies = 1;
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

// async function submitTerritory(newTerritoryObject, index) {
//   if (index !== rawTerritoryList.value.length - 1)
//     return;
//   //orderedTerritoryList.Items.push(newTerritoryObject);
//   //orderedTerritoryList.Items[index].name = newTerritoryObject.name;

//   if (rawTerritoryList.value.findIndex((x) => x.name === "") === -1) {
//     const id = getGuid();
//     let newTerr = {
//       id: id,
//       sortOrder: orderedTerritoryList.Items.length + 1,
//       //sortOrder: rawTerritoryList.value.length + 1,
//       name: null, 
//       placeholder: `Territory ${rawTerritoryList.value.length + 1}`,
//       defensiveArmies: 1,
//       desiredOccupiers: 1
//     }
//     rawTerritoryList.value.push(newTerr);
//     orderedTerritoryList.Items.push(newTerr);
//   }

//   await nextTick();
//   //const nextIndex = orderedTerritoryList.Items.length > index + 1 ? index + 1 : index;
// 	//document.getElementById(orderedTerritoryList.Items[nextIndex].id).focus();
//   calculateButton.value.scrollIntoView({ behavior: "smooth" });
// }

async function removeTerritory(territory) {
  console.log(territory);
  territory.isDeleted = true;
  orderedTerritoryList.Items = orderedTerritoryList.Items.filter((obj) => obj.id !== territory.id);
  setSortOrders();
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