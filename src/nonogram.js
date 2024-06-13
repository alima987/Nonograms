import "./styles.scss";
import { puzzles } from "./levels";

const header = document.createElement('div');
header.id = 'header'
document.body.append(header)

const container = document.createElement('div')
container.id = 'container'
document.body.append(container)

const title = document.createElement('h2')
title.classList = 'title'
title.textContent = "Nonograms"
container.appendChild(title)

const nonogram = document.createElement('table');
nonogram.id = 'nonogram'
container.appendChild(nonogram)



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
  

  const createNonogramGrid = (arr) => {
  const nonogram = document.getElementById('nonogram');
    nonogram.innerHTML = ''; 

    for (let i = 0; i < arr.length; i++) {
      const row = document.createElement('tr')
      row.classList.add('row')
      nonogram.append(row)
      for (let j = 0; j < arr.length; j++) {
        let cell = document.createElement('td');
        cell.classList.add('cell');
        cell.dataset.x = j
        cell.dataset.y = i
        row.append(cell);
      }
    }
    fillHints(arr)
  };

  const fillHints = (arr) => {
    const rowsHints = document.getElementById('rows-hints');
    const colsHints = document.getElementById('cols-hints');
  
    rowsHints.innerHTML = '';
    colsHints.innerHTML = '';
     
    for (let i = 0; i < arr.length; i++) {
        const rowHints = document.createElement('div');
        rowHints.classList.add('row-hint');
        rowHints.textContent = getRowHints(arr, i);
        rowsHints.appendChild(rowHints);
    }
        
    for (let i = 0; i < arr[0].length; i++) {
        const colHints = document.createElement('div');
        colHints.classList.add('col-hint');
        colHints.textContent = getColHints(arr, i);
        colsHints.appendChild(colHints);
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
   return hint.join(' ')
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
    return hint.join('\n')
   }
  
   const rowsHints = document.createElement('div');
   rowsHints.id = 'rows-hints'
   container.insertBefore(rowsHints, nonogram.nextSibling)
  
   const colsHints = document.createElement('div');
   colsHints.id = 'cols-hints';
   container.insertBefore(colsHints, nonogram);

const cellColorChange = (event) => {
    if(event.target.classList.contains('cell')) {
        const cell = event.target
        cell.classList.toggle('black')
    }
    if (winCheck()) {
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
      clickedCross.remove()
    } else {
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
const levelsList = document.createElement('div');
levelsList.classList.add('level-list');
levelsList.textContent = "Levels"
header.appendChild(levelsList);

puzzles.forEach((level, i) => {
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
                createNonogramGrid(puzzleMatrix);
                fillHints(puzzleMatrix);
            }
        });
    });
});

/*levelsList.addEventListener('click', () => {
  const list = levelsList.querySelector('ul');
  if (list.style.display === 'none' || !list.style.display) {
      list.style.display = 'block';
  } else {
      list.style.display = 'none';
  }
});*/

const solution = document.createElement('button')
solution.classList.add('solution')
solution.textContent = "Solution"
container.appendChild(solution)

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


window.onload = () => {
  createNonogramGrid(puzzleMatrix);
  fillHints(puzzleMatrix);
}
