// ui.js
import { db, execQuery } from "./db.js";

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

export function renderTable() {
  if (!db) return;

  const tablesResult = db.exec(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name NOT LIKE 'sqlite_%';
  `);

  const tableEl = document.getElementById("table");
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
    const columns = result[0]?.columns || db.exec(`PRAGMA table_info(${name});`).map(c => c[1]);
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

export function attachUIHandlers() {
  document.getElementById("runBtn").addEventListener("click", () => {
    const query = document.getElementById("query").value;
    const outputEl = document.getElementById("output");
    try {
      const result = execQuery(query);
      outputEl.textContent = renderPythonStyleOutput(result);
      renderTable();
    } catch (e) {
      outputEl.textContent = e.message;
    }
  });

  document.getElementById("resetBtn").addEventListener("click", async () => {
    await import("./db.js").then((m) => m.initDB());
    renderTable();
    document.getElementById("output").textContent = "Database Reset.";
  });
}
