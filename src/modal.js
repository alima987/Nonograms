const modal = document.createElement('div')
modal.classList.add('modal')
container.appendChild(modal)
const overlay = document.createElement('div')
overlay.classList.add('overlay')
container.appendChild(overlay)

const modalOpen = () => {
modal.classList.remove('hidden')
overlay.classList.remove('overlay')
}
const modalClose = () => {
    modal.classList.add('hidden')
    overlay.classList.add('hidden')
}
document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && (!modal.classList.contains('hidden'))) {
        modalClose()
    }
})