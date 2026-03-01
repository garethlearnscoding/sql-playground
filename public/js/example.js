import { examples } from "../data/data.js";

console.log(examples.insert.sql_example);

window.loadExample = function (topic) {
  if (!examples[topic]) return;

  const data = examples[topic];

  // Only update the textarea if it exists and we're on the sandbox route
  if (window.location.pathname === "/sandbox") {
    const queryEl = document.getElementById("query");
    if (queryEl) queryEl.value = data.sql_example;
  }

  const sqlSyntax = document.getElementById("sqlSyntax");
  const sqlExample = document.getElementById("sqlExample");
  const pythonExample = document.getElementById("pythonExample");

  if (sqlSyntax) sqlSyntax.textContent = data.sql_syntax;
  if (sqlExample) sqlExample.textContent = data.sql_example;
  if (pythonExample) pythonExample.textContent = data.python_example;

  Prism.highlightAll();

  history.pushState(null, "", `?topic=${topic}`);
};
// Load from URL if present
const params = new URLSearchParams(window.location.search);
const topic = params.get("topic");
if (topic && examples[topic]) {
  loadExample(topic);
}
