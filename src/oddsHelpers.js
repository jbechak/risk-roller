let redDiceValues = [];
let whiteDiceValues = [];
let redWhiteWinSet = [];
let totalCombinations;
let diceCount;

export function calculateOdds(redDiceCount, whiteDiceCount) {
  diceCount = redDiceCount + whiteDiceCount;
  resetValues(redDiceCount, whiteDiceCount);
  let currentDie = 0;
  recurseOdds(currentDie);
  totalCombinations = redWhiteWinSet.length;
  return compileOdds();
}

function resetValues(redDiceCount, whiteDiceCount) {
  redDiceValues = fillArrayWithZeros(redDiceCount);
  whiteDiceValues = fillArrayWithZeros(whiteDiceCount);
  redWhiteWinSet = [];
  totalCombinations = 0;
}

function fillArrayWithZeros(arrLength) {
  let arr = [];
  for (let i = 0; i < arrLength; i++) arr.push(0);
  return arr;
}


function recurseOdds(currentDie) {
  if (currentDie >= diceCount) {
    return;
  }
  currentDie++;
  for (let i = 1; i <= 6; i++) {
    if (currentDie <= redDiceValues.length) {
      redDiceValues[currentDie - 1] = i;
    } else {
      whiteDiceValues[currentDie - redDiceValues.length - 1] = i;
    }
    recurseOdds(currentDie);
    if (currentDie == diceCount) {
      redWhiteWinSet.push(getRiskWinners());
    }
  }
  currentDie--;
}

function getRiskWinners() {
  let wins = [0, 0];
  if (Math.max(...whiteDiceValues) >= Math.max(...redDiceValues)) {
    wins[1]++;
  } else {
    wins[0]++;
  }

  if (whiteDiceValues.length > 1 && redDiceValues.length > 1) {
    if (getSecondHighest(whiteDiceValues) >= getSecondHighest(redDiceValues)) {
      wins[1]++;
    }
    else wins[0]++;
  }
  return wins;
}

function getSecondHighest(arr) {
  let largest = arr[0];
  let secondHighest = -1;
  arr.forEach((currentValue) => {
    if (currentValue > largest) {
      secondHighest = largest;
      largest = currentValue;
    } else if (currentValue < largest && currentValue > secondHighest) {
      secondHighest = currentValue;
    }
  });
  return secondHighest;
}

function compileOdds() {
  let result = {
    redSweep: { label: 'Red Sweep', count: 0},
    redWin: { label: 'Red Win', count: 0},
    whiteSweep: { label: 'White Sweep', count: 0},
    whiteWin: { label: 'White Win', count: 0},
    tie: { label: 'Tie', count: 0}
  };
  redWhiteWinSet.forEach((redWhite) => {
    if (redWhite[0] == 2) {
      result.redSweep.count++;
    }
    else if (redWhite[1] == 2) {
      result.whiteSweep.count++;
    }
    else if (redWhite[0] == 1 && redWhite[1] == 1) {
      result.tie.count++;
    }
    else if (redWhite[0] == 1) {
      result.redWin.count++;
    }
    else if (redWhite[1] == 1) {
      result.whiteWin.count++;
    }
  });

  for (let field in result) {
    result[field].chance = (result[field].count / totalCombinations * 100).toFixed();
  }

  let resultArr = [];
  for (let property in result) {
    if (result[property].chance != 0)
      resultArr.push(result[property]);
  }
  
  return resultArr.sort((a,b) => b.chance - a.chance);
}