import { puzzles } from "./levels";
const container = document.getElementById('container')
const nonogram = document.getElementById('nonogram');
const header = document.getElementById('header');
container.appendChild(nonogram)

let rows = 5
let cols = 5
let timeStart 
let timeEnd
let timeInterval
let lastRightClick
let hasWon
let hasLost
let currentPuzzle;
let puzzleIndex = 0
let puzzleData = puzzles[puzzleIndex]
let puzzleName = puzzleData[0].name
let puzzleMatrix = puzzleData[0].data

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
      const wonText = createTextElement('won-text', 'Great! You have solved the nonogram!');
      win.appendChild(wonText);
      hasWon = true;
    }
  };
  
  export const loseContent = () => {
    if (!hasLost) {
      const lostText = createTextElement('lost-text', 'Sorry! You\'ve lost the game!');
      lose.appendChild(lostText);
      hasLost = true;
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
  

  const createNonogramGrid = () => {
    nonogram.innerHTML = ''; 
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = i;
        cell.dataset.col = j;
        nonogram.appendChild(cell);
      }
    }
  };
  const changeGridSize = (size) => {
    rows = size
    cols = size
    createNonogramGrid()
  }
const cellColorChange = (event) => {
    if(event.target.classList.contains('cell')) {
        const cell = event.target
        cell.classList.toggle('black')
    }
    //fillHints();
    if (winCheck()) {
        modalOpen()
    }
}
nonogram.addEventListener('click', cellColorChange)

const xChange = (event) => {
event.preventDefault()
if(event.target.classList.contains('cell')) {
    const cell = event.target
    const cross = document.createElement('div');
    cross.innerHTML = "&#10060"
    cross.classList.add('cross')
    cell.appendChild(cross)
    cross.style.display = "block"
    cross.style.left = offsetX + 'px';
    cross.style.top = offsetY + 'px';
}
}
nonogram.addEventListener('contextmenu', xChange)
nonogram.addEventListener('contextmenu', (event) => {
    event.preventDefault()
    const currTime = new Date().getTime()
    const timeClick = currTime - lastRightClick
    lastRightClick = currTime
    if(timeClick <= 300) {
        const clickedCell = event.target.closest('.cell')
        if(clickedCell) {
            const cross = clickedCell.querySelector('.cross');
            if(cross) {
                cross.style.display = 'none';
            }
        }
    }
})

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
    //createNonogramGrid();
    fillHints();
}

const resetBtn = document.createElement('button');
resetBtn.classList.add('reset_btn')
resetBtn.textContent = "Reset game"
container.appendChild(resetBtn)
resetBtn.addEventListener('click', resetGame)

const timer = document.createElement('div')
timer.id = 'timer'
timer.innerHTML = "00:00"
container.appendChild(timer)

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

const fillHints = () => {
    const rowsHints = document.getElementById('rows-hints');
    const colsHints = document.getElementById('cols-hints');

    rowsHints.innerHTML = '';
    colsHints.innerHTML = '';
     
    for (let i = 0; i < rows; i++) {
        const rowHints = document.createElement('div');
        rowHints.classList.add('row-hint');
        rowHints.textContent = getRowHints(i);
        rowsHints.appendChild(rowHints);
    }
        

    for (let i = 0; i < cols; i++) {
        const colHints = document.createElement('div');
        colHints.classList.add('col-hint');
        colHints.textContent = getColHints(i);
        colsHints.appendChild(colHints);
    }
};

const getRowHints = (rowIndex) => {
    const row = puzzleMatrix[rowIndex]
    const hint = []
    let count = 0
    for ( let i = 0; i < cols; i++) {
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
   return hint.join(' ')
   }

   const getColHints = (colIndex) => {
    const hint = []
    let count = 0
    for ( let i = 0; i < rows; i++) {
        if(puzzleMatrix[i][colIndex] === 1) {
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
    return hint.join('\n')
   }

   const rowsHints = document.createElement('div');
   rowsHints.id = 'rows-hints'
   container.insertBefore(rowsHints, nonogram.nextSibling)

   const colsHints = document.createElement('div');
   colsHints.id = 'cols-hints';
   container.insertBefore(colsHints, nonogram);

export const winCheck = () => {
    const cells = document.querySelectorAll('.cell')
    for(let i = 0; i < cells.length; i++) {
        const cell = cells[i]
        const row = parseInt(cell.dataset.row)
        const col = parseInt(cell.dataset.col)
        const isFilled = cell.classList.contains('black')
        if ((puzzleMatrix[row][col] === 1 && !isFilled) || (puzzleMatrix[row][col] === 0 && isFilled)) {
            return false;
          }
        }
    return true
}

const levelsList = document.createElement('div');
levelsList.classList.add('level-list');
levelsList.textContent = "Levels"
header.appendChild(levelsList);

puzzles.forEach((level, i) => {
    const levelTitle = document.createElement('h3');
    levelTitle.textContent = `Levels ${i + 1}`;
    levelsList.appendChild(levelTitle);

    const list = document.createElement('ul');
    list.classList.add('list');
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
                changeGridSize();
                fillHints();
            }
        });
    });
});

levelsList.addEventListener('click', () => {
  const list = levelsList.querySelector('ul');
  if (list.style.display === 'none' || !list.style.display) {
      list.style.display = 'block';
  } else {
      list.style.display = 'none';
  }
});

const solution = document.createElement('button')
solution.classList.add('solution')
solution.textContent = "Solution"
container.appendChild(solution)

const gameSolution = () => {
  const cells = document.querySelectorAll('.cell')
  for(let i = 0; i < cells.length; i++) {
    const cell = cells[i]
    const row = parseInt(cell.dataset.row)
    const col = parseInt(cell.dataset.col)
    const isFilled = puzzleMatrix[row][col] === 1 
    if (isFilled) {
        cell.classList.add('black')
      } else {
       cell.classList.remove('black')
      }
    }

}

solution.addEventListener('click', gameSolution)
document.getElementById('size5').addEventListener('click', () => changeGridSize(5));
document.getElementById('size10').addEventListener('click', () => changeGridSize(10));
document.getElementById('size15').addEventListener('click', () => changeGridSize(15));


  window.onload = () => {
    createNonogramGrid();
    fillHints();
};
