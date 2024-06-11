import "./styles.scss";
const bodyStructute = () => {
  const html = `
  <header id="header"></header>
  <div id ="container">
  <h2 class="title">Nonograms</h2>
  <table id="nonogram">
  </table>
  <button id="size5">5x5</button>
<button id="size10">10x10</button>
<button id="size15">15x15</button>
  </div>
  `
  const root = document.createElement('div');
  root.innerHTML = html
  document.body.appendChild(root)
}
bodyStructute()