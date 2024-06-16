import "./styles.scss";
import winSoundFile from "./assets/winSound.wav";
import blackSoundFile from "./assets/black.wav";
import crossSoundFile from './assets/cross.wav';
import emptySoundFile from './assets/empty.wav';
import { puzzles } from "./levels";

const main = document.createElement('div')
main.classList = 'main'
document.body.appendChild(main)

const header = document.createElement('div');
header.id = 'header'
main.appendChild(header)

const menu = document.createElement('ul')
menu.id = 'menu'
header.appendChild(menu)

const theme = document.createElement('div')
theme.classList = "theme";
theme.textContent = "Theme"
header.appendChild(theme)

const leaderBoardBtn = document.createElement('div')
leaderBoardBtn.classList = 'leader-btn'
leaderBoardBtn.textContent = 'High score'
header.appendChild(leaderBoardBtn)

const levelsList = document.createElement('div');
levelsList.classList.add('level-list');
levelsList.textContent = "Levels"
header.appendChild(levelsList);

const container = document.createElement('div')
container.id = 'container'
main.append(container)

const title = document.createElement('h2')
title.classList = 'title'
title.textContent = "Nonograms"
header.appendChild(title)

const createSeaction = (className) => {
const element = document.createElement('section');
element.classList.add(className);
container.appendChild(element);
return element;
} 
const timerSection = createSeaction('timer-section')
const timer = document.createElement('div')
timer.id = 'timer'
timer.innerHTML = "00:00"
timerSection.appendChild(timer)

const gridSection = createSeaction('grid-section')

const nonogram = document.createElement('table');
nonogram.id = 'nonogram'
gridSection.appendChild(nonogram)

const saveLoadSection = createSeaction('save-load-section')
const saveBtn = document.createElement('button');
saveBtn.classList = 'save-btn'
saveBtn.textContent = 'Save game'
saveLoadSection.append(saveBtn)

const loadBtn = document.createElement('button');
loadBtn.classList = 'load-game'
loadBtn.textContent = 'Load Game'
saveLoadSection.append(loadBtn)
 
const btnsSection = createSeaction('btns-section')
const resetBtn = document.createElement('button');
resetBtn.classList.add('reset_btn')
resetBtn.textContent = "Reset game"
btnsSection.appendChild(resetBtn)
  
const solution = document.createElement('button')
solution.classList.add('solution')
solution.textContent = "Solution"
btnsSection.appendChild(solution)

const randomBtn = document.createElement('button')
randomBtn.classList = 'randomGame'
randomBtn.textContent = 'Random game'
btnsSection.append(randomBtn)
 
let timeStart 
let timeInterval
let hasWon
let puzzleIndex = 0
let puzzleData = puzzles[puzzleIndex]
let puzzleName = puzzleData[0].name
let puzzleMatrix = puzzleData[0].data
let leaderBoardShow = false
let leaderboardTable;

const menuEl = [levelsList, theme, leaderBoardBtn]

menuEl.forEach((el) => {
const element = document.createElement('li')
element.appendChild(el)
menu.appendChild(element)
})

const playSound = (soundFile) => {
  const sound = new Audio(soundFile)
  sound.play()
}
const createModal = (className) => {
    const element = document.createElement('div');
    element.classList.add(className, 'hidden');
    container.appendChild(element);
    return element;
  }

  const createTextElement = (className, text) => {
    const textElement = document.createElement('div');
    textElement.classList.add(className);
    textElement.innerHTML = text;
    return textElement;
  }
  const createWinLose = (className) => {
    const element = document.createElement('div');
    element.classList.add(className);
    modal.appendChild(element);
    return element;
  }
  export const modal = createModal('modal');
  export const overlay = createModal('overlay');
  export const win = createWinLose('win');
  export const lose = createWinLose('lose');
  
  export const winContent = () => {
    if (!hasWon) {
      const elapsedTime = Math.floor((new Date() - timeStart) / 1000)
      const wonText = createTextElement('won-text', `Great! You have solved the nonogram in ${elapsedTime} seconds!`);
      win.appendChild(wonText);
      hasWon = true;
      addLeaderData(puzzleName, elapsedTime)
      const resetBtn = document.querySelector('.reset_btn');
      modal.append(resetBtn)
    }
  };
  
  export const modalOpen = () => {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
    if (winCheck()) {
      winContent();
    } else {
      loseContent();
    }
  };
  
  export const modalClose = () => {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
  };
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && (!modal.classList.contains('hidden'))) {
      modalClose();
    }
  });
  
    const createNonogramGrid = (arr) => {
    const nonogram = document.getElementById('nonogram');
    nonogram.innerHTML = '';
    
    for (let i = 0; i < arr.length + 1; i++) {
      let classRow = "hints_row";
      const row = document.createElement('tr')
      if (i === 0) classRow = "nonogram_top";
      row.classList = classRow;
      nonogram.append(row)
      for (let j = 0; j < arr.length + 1; j++) {
        let cell = document.createElement('td');
        if (i === 0 && j !== 0) {
          cell.classList = "nonogram_top-hint";
        }
        if (j === 0 && i !== 0) {
          cell.classList = "nonogram_row-hint";
        }
        if (j !== 0 && i !== 0) {
        cell.classList.add('cell');
        cell.dataset.x = j;
        cell.dataset.y = i;
        }
        row.append(cell);
      }
    }
    fillHints(arr)
    };
    
  

    const fillHints = (arr) => {
      const rowsHints = document.getElementsByClassName('nonogram_row-hint');
      const colsHints = document.getElementsByClassName('nonogram_top-hint');
    
      for (let i = 0; i < rowsHints.length; i++) {
        rowsHints[i].innerHTML = '';
      }
      for (let i = 0; i < colsHints.length; i++) {
        colsHints[i].innerHTML = '';
      }
    
      for (let i = 0; i < arr.length; i++) {
        const rowHint = getRowHints(arr, i);
        rowsHints[i].textContent = rowHint;
      }
 
      for (let i = 0; i < arr[0].length; i++) {
        const colHint = getColHints(arr, i);
        colsHints[i].textContent = colHint;
      }
    };
    
  
  const getRowHints = (arr, rowIndex) => {
    const row = arr[rowIndex]
    const hint = []
    let count = 0
    for ( let i = 0; i < row.length; i++) {
       if(row[i] === 1) {
           count++
       } else {
           if( count > 0) {
               hint.push(count)
               count = 0
           }
       }
    }
    if( count > 0) {
       hint.push(count)
   }
   return hint.join(' ');
   }
  
   const getColHints = (arr, colIndex) => {
    const hint = []
    let count = 0
    for ( let i = 0; i < arr.length; i++) {
        if(arr[i][colIndex] === 1) {
            count++
        } else {
            if(count > 0) {
                hint.push(count)
                count = 0
            }
        }
    }
    if(count > 0) {
        hint.push(count)
    }
    return hint.join(' ');
   }
  
   
const cellColorChange = (event) => {
    if(event.target.classList.contains('cell')) {
        const cell = event.target
        if(!cell.querySelector('.cross')) {
          if(cell.classList.contains('black')) {
            playSound(emptySoundFile)
          } else {
            playSound(blackSoundFile)
          }
          cell.classList.toggle('black')

        }
    }
    if (winCheck()) {
        playSound(winSoundFile)
        modalOpen()
    } 
}
nonogram.addEventListener('click', cellColorChange)

const xChange = (event) => {
  event.preventDefault()
  if(event.target.classList.contains('cell')) {
    const cell = event.target
    const clickedCross = cell.querySelector('.cross')
    if(clickedCross) {
      playSound(emptySoundFile)
      clickedCross.remove()
    } else {
      playSound(crossSoundFile)
      const cross = document.createElement('div');
      cross.innerHTML = "&#10060";
      cross.classList.add('cross');
      cell.appendChild(cross);
    }
  }
}

nonogram.addEventListener('contextmenu', xChange)

const resetGame = () => {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('black');
        const crosses = cell.querySelectorAll('.cross');
        crosses.forEach(cross => {
            cross.remove();
        });
    });
    clearInterval(timeInterval)
    timeStart = null
    document.getElementById('timer').textContent = '00:00'
    modalClose()
}
resetBtn.addEventListener('click', resetGame)

const startTimer = () => {
    timeStart = new Date()
    timeInterval = setInterval(updateTimer, 1000)

}
const updateTimer = () => {
    const currentTime = new Date()
    const elapsedTime = Math.floor((currentTime - timeStart) / 1000)
    const minutes = Math.floor(elapsedTime / 60)
    const seconds = elapsedTime % 60;
    const formattedTime = `${padZero(minutes)}: ${padZero(seconds)}`
    document.getElementById('timer').textContent = formattedTime
}
const padZero = (num) => {
    return num < 10 ? '0' + num : num
}
nonogram.addEventListener('click', () => {
    if(!timeStart) {
        startTimer()
    }
})

export const winCheck = () => {
    const cells = document.querySelectorAll('.cell')
    for(let i = 0; i < cells.length; i++) { 
        const cell = cells[i]
        const row = parseInt(cell.dataset.y)
        const col = parseInt(cell.dataset.x)
        const isFilled = cell.classList.contains('black')
        if ((puzzleMatrix[row][col] === 1 && !isFilled) || (puzzleMatrix[row][col] === 0 && isFilled)) {
            return false;
        }
     }
     return true
}

puzzles.forEach((level) => {
  const list = document.createElement('ul');
  list.classList.add('list', 'hidden'); // Скрыть список уровней по умолчанию
  levelsList.appendChild(list);

  level.forEach((puzzle) => {
      const li = document.createElement('li');
      li.classList.add('li');
      li.textContent = puzzle.name;
      list.appendChild(li);

      li.addEventListener('click', (event) => {
          const puzzleName = event.target.textContent;
          const selectedPuzzle = level.find((puzzle) => puzzle.name === puzzleName);
          if (selectedPuzzle) {
              puzzleMatrix = selectedPuzzle.data;
              createNonogramGrid(puzzleMatrix);
              fillHints(puzzleMatrix);
              resetGame();
          }
      });
  });
});

levelsList.addEventListener('click', (event) => {
  if (event.target === levelsList) {
      const list = levelsList.querySelector('ul');
      list.classList.toggle('hidden');
  }
});

const gameSolution = () => {
  const cells = document.querySelectorAll('.cell')
  for(let i = 0; i < cells.length; i++) {
    const cell = cells[i]
    const row = parseInt(cell.dataset.y)
    const col = parseInt(cell.dataset.x)
    const isFilled = puzzleMatrix[row][col] === 1 
    if (isFilled) {
        cell.classList.add('black')
      } else {
       cell.classList.remove('black')
      }
    }

}

solution.addEventListener('click', gameSolution)

const shuffleGame = () => {
  const randomLvlInx = Math.floor(Math.random() * puzzles.length)
  const randomLvl = puzzles[randomLvlInx]
  const randomPuzzleInx = Math.floor(Math.random() * randomLvl.length)
  const randomPuzzle = randomLvl[randomPuzzleInx]
  puzzleMatrix = randomPuzzle.data
  createNonogramGrid(puzzleMatrix);
  fillHints(puzzleMatrix);
};

randomBtn.addEventListener('click', shuffleGame);

const changeTheme = () => {
  const cells = document.querySelectorAll('.cell')
  cells.forEach((cell) => {
    cell.classList.toggle('dark')
  })
 document.body.classList.toggle('dark')
 const buttons = [
  saveBtn,
  continueBtn,
  resetBtn,
  solution,
  randomBtn
];

buttons.forEach(button => {
  button.classList.toggle('dark');
});
}
theme.addEventListener('click', changeTheme)

const saveLeaderData = (data) => {
localStorage.setItem('leaders', JSON.stringify(data))
}
const getLeaderData = () => {
  return JSON.parse(localStorage.getItem('leaders')) || []
}
const addLeaderData = (puzzleName, elapsedTime) => {
  const entry = {
    puzzleName,
    elapsedTime,
    timestamp: new Date().toISOString()
  }
  let leadersBoard = getLeaderData()
  leadersBoard.push(entry)
  leadersBoard.sort((a,b) => a.elapsedTime - b.elapsedTime)
  if(leadersBoard.length > 5) {
    leadersBoard = leadersBoard.slice(0, 5)
  }
  saveLeaderData(leadersBoard)
}
const displayLeaderboard = () => {
  const leaderboard = getLeaderData();

  if (leaderBoardShow && leaderboardTable) {
    leaderboardTable.remove();
    leaderBoardShow = false;
    leaderboardTable = null; 
    return;
  }
  leaderboardTable = document.createElement('table');
  leaderboardTable.classList.add('leaderboard-table');
  leaderBoardBtn.appendChild(leaderboardTable);

  const headerRow = document.createElement('tr');
  headerRow.innerHTML = '<th>Puzzle</th><th>Time</th>';
  leaderboardTable.appendChild(headerRow);

  leaderboard.forEach((entry) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${entry.puzzleName}</td><td>${formatTime(entry.elapsedTime)}</td>`;
    leaderboardTable.appendChild(row);
  });
  leaderBoardShow = true
};
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${padZero(minutes)}:${padZero(remainingSeconds)}`;
};
leaderBoardBtn.addEventListener('click', displayLeaderboard)

const saveGame = () => {
  const gameState = {
    puzzleMatrix,
    hasWon,
    cellStates: [],
    min: Number(timer.textContent.slice(0, 2)),
    sec: Number(timer.textContent.slice(-2))
  };
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);
    const isBlack = cell.classList.contains('black');
    gameState.cellStates.push({ x, y, isBlack });
  });
  localStorage.setItem('save', JSON.stringify(gameState));
  console.log('Game saved successfully:', gameState);
};
saveBtn.addEventListener('click', saveGame);

  
const loadGame = () => {
  const savedGame = JSON.parse(localStorage.getItem('save'));
  if (savedGame) {
    puzzleMatrix = savedGame.puzzleMatrix;
    hasWon = savedGame.hasWon;
    timer.textContent = `${
      String(savedGame.min).length === 1 ? "0" + savedGame.min : savedGame.min
    }:${String(savedGame.sec).length === 1 ? "0" + savedGame.sec : savedGame.sec}`;
    
    createNonogramGrid(puzzleMatrix);
    fillHints(puzzleMatrix);

    savedGame.cellStates.forEach(state => {
      const cell = document.querySelector(`.cell[data-x="${state.x}"][data-y="${state.y}"]`);
      if (cell) {
        if (state.isBlack) {
          cell.classList.add('black');
        } else {
          cell.classList.remove('black');
        }
      }
    });

    console.log('Game loaded successfully:', savedGame);
  } else {
    console.log('No saved game found.');
  }
};

loadBtn.addEventListener('click', loadGame);

window.onload = () => {
  createNonogramGrid(puzzleMatrix);
  fillHints(puzzleMatrix);
  document.addEventListener('contextmenu', (e) => e.preventDefault());
}
