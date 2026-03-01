// ui.js
import { db,resetDatabase } from "./db.js";

export function renderPythonStyleOutput(result) {
  if (!result || result.length === 0) return "[]";
  const rows = result[0].values;
  return `[${rows.map((r) => `(${r.map((c) => (typeof c === "string" ? `'${c}'` : c)).join(", ")})`).join(", ")}]`;
}

export function renderHTMLTable(result) {
  if (!result || !result[0]) return "<p>No columns found</p>";

  const { columns, values } = result[0];

  // Start table and add header row
  let html = "<table class='sql-output'><thead><tr>";
  columns.forEach(col => html += `<th>${col}</th>`);
  html += "</tr></thead><tbody>";

  // If there are no rows, still show a single "No data" row
  if (!values || values.length === 0) {
    html += `<tr><td colspan="${columns.length}" style="text-align:center; font-style:italic;">No data</td></tr>`;
  } else {
    values.forEach(row => {
      html += "<tr>";
      row.forEach(cell => html += `<td>${cell}</td>`);
      html += "</tr>";
    });
  }

  html += "</tbody></table>";
  return html;
}

export function renderTable(tableEl) {
  if (!db) return;

  const tablesResult = db.exec(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name NOT LIKE 'sqlite_%';
  `);

  if (!tablesResult.length) {
    tableEl.innerHTML = "No tables found.";
    return;
  }

  let finalHTML = "";
  const tableNames = tablesResult[0].values.map(r => r[0]);

  tableNames.forEach(name => {
    const result = db.exec(`SELECT * FROM ${name};`);

    finalHTML += `<h4>${name}</h4>`;

    // Always render headers
    let html = "<table class='sql-output'><thead><tr>";

    // Use PRAGMA to get column names if no rows
    let columns = [];
    if (result.length && result[0].columns) {
      columns = result[0].columns;
    } else {
      const pragmaResult = db.exec(`PRAGMA table_info(${name});`);
      if (pragmaResult.length) {
        columns = pragmaResult[0].values.map(col => col[1]); // col[1] is column name
      }
    }

    columns.forEach(col => html += `<th>${col}</th>`);
    html += "</tr></thead><tbody>";

    if (!result.length || result[0].values.length === 0) {
      html += "<tr><td colspan='" + columns.length + "'>No data</td></tr>";
    } else {
      result[0].values.forEach(row => {
        html += "<tr>";
        row.forEach(cell => html += `<td>${cell}</td>`);
        html += "</tr>";
      });
    }

    html += "</tbody></table>";
    finalHTML += html;
  });

  tableEl.innerHTML = finalHTML;
}

export function attachRunQuery(buttonEl, outputEl, tableEl, examplesDict, queryEl = null) {
  buttonEl.addEventListener("click", () => {
    let query;

    if (queryEl) {
      // Use the textarea/query element provided
      query = queryEl.value;
    } else {
      // Fallback: read topic from URL and get SQL from examples dictionary
      const params = new URLSearchParams(window.location.search);
      const selectedTopic = params.get("topic") || "select";

      if (!examplesDict[selectedTopic]) {
        if (outputEl) outputEl.textContent = "No example for this topic.";
        if (tableEl) tableEl.innerHTML = "";
        return;
      }

      query = examplesDict[selectedTopic].sql_example;
    }

    try {
      const result = db.exec(query);
      if (outputEl) outputEl.textContent = renderPythonStyleOutput(result);
      renderTable(tableEl);
    } catch (e) {
      if (outputEl) outputEl.textContent = e.message;
      if (tableEl) tableEl.innerHTML = "";
    }
  });
}

// // ui.js
// export function attachResetDB(buttonEl, outputEl, tableEl, setupFn) {
//   buttonEl.addEventListener("click", async () => {
//     if (typeof setupFn === "function") {
//       await setupFn();               // call the page-specific setup
//       renderTable(tableEl);          // render table with correct element
//       if (outputEl) outputEl.textContent = "Database Reset.";
//     } else {
//       console.error("No setup function provided for reset.");
//     }
//   });
// }

export function attachResetDB(buttonEl,outputEl) {
  buttonEl.addEventListener("click", async () => {
    // read topic dynamically from URL

    const params = new URLSearchParams(window.location.search);
    const topic = params.get("topic");

    console.log("Reset Button | Topic:", topic);

    await resetDatabase(topic);
    if (outputEl) outputEl.textContent = "Database Reset.";
  });
}