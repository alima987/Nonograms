const container = document.getElementById('container')
const nonogram = document.getElementById('nonogram');
container.appendChild(nonogram)

const rows = 8
const cols = 8

for(let i = 0; i <rows; i++) {
    for(let j = 0; j < cols; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell')
        cell.dataset.row = i
        cell.dataset.col = j
        nonogram.appendChild(cell)
    }
}