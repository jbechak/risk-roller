<template>
  <div class="mx-3">
    <img :class="isActive ? null : styleClasses.OPACITY_25" :src="currentDieRef" :style="styles.rotate" @click="toggleShow" />
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
  isRed: {
    type: Boolean,
    default: true
  },
  isTogglable: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['change']);
defineExpose({ rollDie });

const isActive = ref(true);

const redDiceRef = ref([redOne, redTwo, redThree, redFour, redFive, redSix]);
const whiteDiceRef = ref([whiteOne, whiteTwo, whiteThree, whiteFour, whiteFive, whiteSix]);
const currentDieRef = computed(() =>
  props.isRed ? redDiceRef.value[currentNumber.value] : whiteDiceRef.value[currentNumber.value]
);

const currentNumber = ref(0);
const styleClasses = {
  OPACITY_25: "opacity-25"
};

const styles = reactive({
  rotate: null
});

async function rollDie() {
  if (isActive.value) {
    const maxAngle = 50
    for (let j = 0; j < 3; j++) {
      await rotateRange(1, (i) => i < maxAngle, 10);
      await rotateRange(maxAngle, (i) => i > 0 - maxAngle, -10);
      await rotateRange(0 - maxAngle, (i) => i < 1, 10);
    }
    emit('change', currentNumber.value + 1, props.isRed);
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
  isActive.value = !isActive.value;
  currentNumber.value = 0;
}
</script>