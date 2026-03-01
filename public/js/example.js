import { examples } from "../data/data.js";
import { resetDatabase } from "./db.js";

// window.loadExample = async function(topic) {
//   const page = document.body.getAttribute("x-data")?.includes("docs") ? "docs" : "sandbox";

//   // If docs page, run resetDatabase with topic setup
//   if (page === "docs") {
//     await resetDatabase(topic);
//   } else {
//     // Sandbox: just clean DB
//     await resetDatabase();
//   }

//   const data = examples[topic];
//   if (!data) return;

//   // Update textarea if sandbox
//   if (page === "sandbox") {
//     const queryEl = document.getElementById("query");
//     if (queryEl) queryEl.value = data.sql_example;
//   }

//   // Update Docs examples
//   const sqlSyntax = document.getElementById("sqlSyntax");
//   const sqlExample = document.getElementById("sqlExample");
//   const pythonExample = document.getElementById("pythonExample");
//   const goalEl = document.getElementById("sqlGoal");

//   if (sqlSyntax) sqlSyntax.textContent = data.sql_syntax;
//   if (sqlExample) sqlExample.textContent = data.sql_example;
//   if (pythonExample) pythonExample.textContent = data.python_example;
//   if (goalEl) goalEl.textContent = data.goal || '',

//   Prism.highlightAll();
//   history.pushState(null, "", `?topic=${topic}`);
// };

window.loadExample = async function (topic) {
  // Get Alpine root
  const alpineRoot = document.body._x_dataStack?.[0];
  if (!alpineRoot) return;

  // If currently in sandbox, switch to docs
  if (alpineRoot.page === "sandbox") {
    alpineRoot.page = "docs";

    // Force Alpine to update DOM after page change
    await Alpine.nextTick();

    // Initialize docs DB after visibility update
    await setupDocsDB();
  }

  // Reset database according to current page
  if (alpineRoot.page === "docs") {
    await resetDatabase(topic);
  } else {
    await resetDatabase();
  }

  const data = examples[topic];
  if (!data) return;

  // Update sandbox textarea only if visible
  if (alpineRoot.page === "sandbox") {
    const queryEl = document.getElementById("query");
    if (queryEl) queryEl.value = data.sql_example;
  }

  // Update Docs examples
  const sqlSyntax = document.getElementById("sqlSyntax");
  const sqlExample = document.getElementById("sqlExample");
  const pythonExample = document.getElementById("pythonExample");
  const goalEl = document.getElementById("sqlGoal");

  if (sqlSyntax) sqlSyntax.textContent = data.sql_syntax;
  if (sqlExample) sqlExample.textContent = data.sql_example;
  if (pythonExample) pythonExample.textContent = data.python_example;
  if (goalEl) goalEl.textContent = data.goal || "";

  Prism.highlightAll();
  history.pushState(null, "", `?topic=${topic}`);
};
