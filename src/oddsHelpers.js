let redDiceValues = [];
let whiteDiceValues = [];
let redWhiteWinSet = [];
let totalCombinations;
let diceCount;

//let battleOdds = {};
let rollOddsSets = {};
let battleOddsSets = {};

export function calculateOdds(redDiceCount, whiteDiceCount) {
  const storedResult = rollOddsSets[`${redDiceCount}vs${whiteDiceCount}`];
  if (storedResult) 
    return storedResult;

  diceCount = redDiceCount + whiteDiceCount;
  resetValues(redDiceCount, whiteDiceCount);
  let currentDie = 0;
  recurseOdds(currentDie);
  totalCombinations = redWhiteWinSet.length;
  const result = compileOdds();
  rollOddsSets[`${redDiceCount}vs${whiteDiceCount}`] = result;
  return result;
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
    redSweep: { 
      label: 'Offensive Sweep',
      redLosses: 0, 
      whiteLosses: 2,
      count: 0 
    },
    redWin: { 
      label: 'Offensive Win',
      redLosses: 0, 
      whiteLosses: 1,
      count: 0 
    },
    whiteSweep: { 
      label: 'Defensive Sweep',
      redLosses: 2, 
      whiteLosses: 0,
      count: 0 
    },
    whiteWin: { 
      label: 'Defensive Win',
      redLosses: 1,  
      whiteLosses: 0,
      count: 0 
    },
    tie: { 
      label: 'Tie',
      redLosses: 1,
      whiteLosses: 1,
      count: 0 
    }
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
    result[field].chance = (result[field].count / totalCombinations);
  }

  let resultArr = [];
  for (let property in result) {
    if (result[property].chance != 0)
      resultArr.push(result[property]);
  }

  return resultArr.sort((a, b) => b.chance - a.chance);
}

//Advanced Odds

export async function calculateVictoryOdds(redDiceCount, whiteDiceCount) {
  const storedResult = battleOddsSets[`${redDiceCount}vs${whiteDiceCount}`];
  if (storedResult) {
    return storedResult;
  }
  let battleOdds = {
    redOccupiers: {},
    redVictory: 0,
    whiteVictory: 0
  }
  runScenarios(redDiceCount, whiteDiceCount, battleOdds);
  battleOddsSets[`${redDiceCount}vs${whiteDiceCount}`] = battleOdds;
  console.log(battleOddsSets);
  return battleOdds;
}

function runScenarios(redDice, whiteDice, battleOdds, chance = 1) { 
  if (redDice < 2) {
    battleOdds.whiteVictory += chance;
  } 

  else if (whiteDice < 1) {
    battleOdds.redVictory += chance;

    battleOdds.redOccupiers[`${redDice - 1}armies`] = battleOdds.redOccupiers[`${redDice - 1}armies`] 
    ? battleOdds.redOccupiers[`${redDice - 1}armies`] + chance
    : chance;

  } else { 

    const storedResult = battleOddsSets[`${redDice}vs${whiteDice}`];
    if (storedResult) {

      // for (const xArmies in storedResult.redOccupiers) {
      //   battleOdds.redOccupiers[`${redDice - 1}armies`] = battleOdds.redOccupiers[`${redDice - 1}armies`] 
      //     ? battleOdds.redOccupiers[`${redDice - 1}armies`] + storedResult.redOccupiers[xArmies] * chance
      //     : storedResult.redOccupiers[xArmies] * chance;
      // }

      for (const xArmies in storedResult.redOccupiers) {
        battleOdds.redOccupiers[xArmies] = battleOdds.redOccupiers[xArmies] 
          ? battleOdds.redOccupiers[xArmies] + storedResult.redOccupiers[xArmies] * chance
          : storedResult.redOccupiers[xArmies] * chance;
      }
      
      battleOdds.redVictory += (chance * storedResult.redVictory);
      battleOdds.whiteVictory += (chance * storedResult.whiteVictory);
    } else {

      // console.log('not stored', redDice, whiteDice, chance);
      battleOddsSets[`${redDice}vs${whiteDice}`] = {
        redOccupiers: {},
        redVictory: 0,
        whiteVictory: 0
      };

      const redDiceToRoll = redDice > 3 ? 3 : redDice - 1;
      const whiteDiceToRoll = whiteDice > 1 ? 2 : 1;
      const rollResults = calculateOdds(redDiceToRoll, whiteDiceToRoll);
      rollResults.forEach((rollResult) => {
        runScenarios(
          redDice - rollResult.redLosses, 
          whiteDice - rollResult.whiteLosses, 
          battleOddsSets[`${redDice}vs${whiteDice}`], 
          1 * rollResult.chance,
        );
        runScenarios(
          redDice - rollResult.redLosses, 
          whiteDice - rollResult.whiteLosses, 
          battleOdds, 
          chance * rollResult.chance,
        );
      });
    }
  }
}