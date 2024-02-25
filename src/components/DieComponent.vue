<template>
  <div class="mx-3" :class="die?.isTogglable ? styleClasses.POINTER_ON_HOVER : null">
    <img 
      :class="die?.isActive ? null : styleClasses.OPACITY_25" 
      :src="currentDieRef" 
      :style="styles.rotate" 
      @click="toggleShow" 
    />
  </div>
</template>

<script setup>
import { reactive, ref, computed, defineProps, defineEmits, defineExpose } from 'vue';
import redOne from '@/assets/RedOne.png';
import redTwo from '@/assets/RedTwo.png';
import redThree from '@/assets/RedThree.png';
import redFour from '@/assets/RedFour.png';
import redFive from '@/assets/RedFive.png';
import redSix from '@/assets/RedSix.png';
import whiteOne from '@/assets/WhiteOne.png';
import whiteTwo from '@/assets/WhiteTwo.png';
import whiteThree from '@/assets/WhiteThree.png';
import whiteFour from '@/assets/WhiteFour.png';
import whiteFive from '@/assets/WhiteFive.png';
import whiteSix from '@/assets/WhiteSix.png';

const props = defineProps({
  die: {
    type: Object,
    default: null
  },
});

const emit = defineEmits(['dieRolled', 'toggleShow']);
defineExpose({ rollDie });

const redDiceRef = ref([redOne, redTwo, redThree, redFour, redFive, redSix]);
const whiteDiceRef = ref([whiteOne, whiteTwo, whiteThree, whiteFour, whiteFive, whiteSix]);
const currentDieRef = computed(() =>
  props.die.isRed ? redDiceRef.value[currentNumber.value] : whiteDiceRef.value[currentNumber.value]
);

const currentNumber = ref(0);
const styleClasses = {
  OPACITY_25: "opacity-25",
  POINTER_ON_HOVER: "pointer-on-hover"
};

const styles = reactive({
  rotate: null
});

async function rollDie() {
  if (props.die.isActive) {
    const maxAngle = 50
    //const rollDuration = Math.floor(Math.random() * 6) + 2;
    for (let j = 0; j < 3; j++) {
      await rotateRange(1, (i) => i < maxAngle, 10);
      await rotateRange(maxAngle, (i) => i > 0 - maxAngle, -10);
      await rotateRange(0 - maxAngle, (i) => i < 1, 10);
    }
    emit('dieRolled', props.die, currentNumber.value + 1);
  }
}

async function rotateRange(startAngle, endExp, increment) {
  for (let i = startAngle; endExp(i); i += increment) {
    await delay(10);
    styles.rotate = `transform: rotate(${i}deg)`
  }
  currentNumber.value = Math.floor(Math.random() * 6);
}

async function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function toggleShow() {
  if (!props.die.isTogglable) return;
  emit('toggleShow', props.die);
  //currentNumber.value = 0;
}
</script>

<style scoped>
.pointer-on-hover {
  cursor: pointer;
}
</style>