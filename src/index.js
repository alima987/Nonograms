import "./styles.scss";
const bodyStructute = () => {
  const html = `
  <header id="header"></header>
  <div id ="container">
  <h2 class="title">Nonograms</h2>
  <table id="nonogram">
  </table>
  </div>
  `
  const root = document.createElement('div');
  root.innerHTML = html
  document.body.appendChild(root)
}
bodyStructute()