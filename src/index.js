import "./styles.scss";
const bodyStructute = () => {
  const html = `
  <header class="header"></header>
  <div id ="container">
  <h2 class="title">Nonograms</h2>
  <div id ="nonogram">
  </div>
  </div>
  `
  const root = document.createElement('div');
  root.innerHTML = html
  document.body.appendChild(root)
}
bodyStructute()