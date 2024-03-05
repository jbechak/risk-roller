<template>
  <div id="oddsComponentContainer" class="mb-3">
    <h2 class="mt-3">Odds</h2>
    <nav class="pt-1">
      <div class="nav nav-tabs" id="nav-tab" role="tablist">
        <button 
          :class="activeTab === tabs.SINGLE_ROLL ? styleClasses.ACTIVE_BUTTON : styleClasses.INACTIVE_BUTTON"
          id="nav-home-tab" 
          data-bs-toggle="tab" 
          data-bs-target="#nav-home" 
          type="button" role="tab" 
          aria-controls="nav-home" 
          aria-selected="true"
          @click="activeTab = tabs.SINGLE_ROLL"
        >{{ tabs.SINGLE_ROLL }}</button>
        <button 
          :class="activeTab === tabs.BATTLE ? styleClasses.ACTIVE_BUTTON : styleClasses.INACTIVE_BUTTON"
          id="nav-profile-tab" 
          data-bs-toggle="tab" 
          data-bs-target="#nav-profile" 
          type="button" 
          role="tab" 
          aria-controls="nav-profile" 
          aria-selected="false"
          @click="activeTab = tabs.BATTLE"
        >{{ tabs.BATTLE }}</button>
        <button 
          :class="activeTab === tabs.CONQUEST ? styleClasses.ACTIVE_BUTTON : styleClasses.INACTIVE_BUTTON"
          id="nav-contact-tab" 
          data-bs-toggle="tab" 
          data-bs-target="#nav-contact" 
          type="button" 
          role="tab" 
          aria-controls="nav-contact" 
          aria-selected="false"
          @click="activeTab = tabs.CONQUEST"
        >{{ tabs.CONQUEST }}</button>
      </div>
    </nav>
    <div class="tab-content" id="nav-tabContent">
      <div 
        :class="activeTab === tabs.SINGLE_ROLL ? styleClasses.ACTIVE_TAB : styleClasses.INACTIVE_TAB"
        id="nav-home" 
        role="tabpanel" 
        aria-labelledby="nav-home-tab"
      >
        <SingleRollOdds
          :redDiceCount="props.redDiceCount" 
          :whiteDiceCount="props.whiteDiceCount"
        />
      </div>
      <div 
        :class="activeTab === tabs.BATTLE ? styleClasses.ACTIVE_TAB : styleClasses.INACTIVE_TAB"
        id="nav-profile" 
        role="tabpanel" 
        aria-labelledby="nav-profile-tab"
      >
        <BattleOdds/>
      </div>
      <div 
        :class="activeTab === tabs.CONQUEST ? styleClasses.ACTIVE_TAB : styleClasses.INACTIVE_TAB"
        id="nav-contact" 
        role="tabpanel" 
        aria-labelledby="nav-contact-tab"
      >Coming Soon</div>
    </div>
  </div> 
</template>

<script setup>
import { ref, defineProps } from 'vue';
import SingleRollOdds from '@/components/SingleRollOdds.vue';
import BattleOdds from '@/components/BattleOdds.vue';

const props = defineProps({
  redDiceCount: {
    type: Number,
    default: 3
  },
  whiteDiceCount: {
    type: Number,
    default: 2
  },
});

const tabs = {
  SINGLE_ROLL: 'Single Roll',
  BATTLE: 'Battle',
  CONQUEST: 'Conquest'
}

const styleClasses = {
  ACTIVE_BUTTON: 'nav-link active',
  INACTIVE_BUTTON: 'nav-link',
  ACTIVE_TAB: 'tab-pane fade show active',
  INACTIVE_TAB: 'tab-pane fade',
}

const activeTab = ref(tabs.SINGLE_ROLL);

</script>

<style scoped>
.nav-link {
  color: rgba(0, 0, 0, 0.626);
  background-color: rgba(255, 255, 255, 0.148);
}

.nav-link.active {
  background-color: rgba(255, 255, 255, 0.344) !important;
}

#oddsComponentContainer {
  min-height: 25vh;
}
</style>