const container = document.getElementById('container')
const nonogram = document.getElementById('nonogram');
container.appendChild(nonogram)

const rows = 5
const cols = 5

for(let i = 0; i <rows; i++) {
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