const container = document.getElementById('container')
const nonogram = document.getElementById('nonogram');
container.appendChild(nonogram)

const rows = 5
const cols = 5
let timeStart 
let timeEnd
let timeInterval
let lastRightClick

for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell')
        cell.dataset.row = i
        cell.dataset.col = j
        nonogram.appendChild(cell)
    }
}
const cellColorChange = (event) => {
    if(event.target.classList.contains('cell')) {
        const cell = event.target
        cell.classList.toggle('black')
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

const resetBtn = document.createElement('button');
resetBtn.classList.add('reset_btn')
resetBtn.innerHTML = "Reset game"
container.appendChild(resetBtn)
resetBtn.addEventListener('click', () => {
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
})

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