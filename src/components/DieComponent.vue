<template>
  <div :class="parentDivClasses">
    <img 
      :class="dieImgClass"
      :src="currentDieRef" 
      :style="styles.rotate" 
      @click="toggleShow" 
    >
    <div v-if="die.isLoser && die.isActive" class="color-overlay">
      <img v-if="die.isLoser" class="x-marker" src="@/assets/x-marker.png" @click="toggleShow" />
    </div>
    
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
  POINTER_ON_HOVER: "pointer-on-hover",
  WINNER_BORDER: "winner-border",
  NO_BORDER: "no-border",
  PARENT_DIV: "parent-div"
};

const dieImgClass = computed(() => {
  let classes = [props.die?.isActive ? null : styleClasses.OPACITY_25];
  classes.push(props.die?.isWinner ? styleClasses.WINNER_BORDER : styleClasses.NO_BORDER);
  return classes;

})

const parentDivClasses = computed(() => {
  let classes = ['mx-3', styleClasses.PARENT_DIV];
  if (props.die.isTogglable) classes.push(styleClasses.POINTER_ON_HOVER);
  return classes;
})

const styles = reactive({
  rotate: null
});

async function rollDie() {
  if (props.die.isActive) {
    const maxAngle = 50
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
}
</script>

<style scoped>
.pointer-on-hover {
  cursor: pointer;
}

.winner-border {
  border: 10px solid yellow;
  border-radius: 15px;
  margin-bottom: 20px;
}

.no-border {
  padding: 10px;
}

.parent-div {
  width: 100px;
  height: 90px;
}

.color-overlay {
  position: relative;
  bottom: 110px;
  left: 10px;
  background-color: gray;
  opacity: 50%;
  width: 100px;
  height: 100px;
  border-radius: 10px;
}

.opacity-25 {
  opacity: 25% !important;
}
</style>