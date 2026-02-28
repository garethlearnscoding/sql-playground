let db;
let SQL;
const isSandbox = !!document.getElementById("query");

function renderPythonStyleOutput(result) {
  if (!result || result.length === 0) return "[]";

  const rows = result[0].values;
  const formatted = rows.map((row) => {
    const cells = row.map((cell) =>
      typeof cell === "string" ? `'${cell}'` : cell,
    );
    return `(${cells.join(", ")})`;
  });
  return `[${formatted.join(", ")}]`;
}

function renderHTMLTable(result) {
  if (!result || result.length === 0) return "<p>No data</p>";

  const { columns, values } = result[0];

  let html = "<table class='sql-output'><thead><tr>";
  columns.forEach((col) => (html += `<th>${col}</th>`));
  html += "</tr></thead><tbody>";

  values.forEach((row) => {
    html += "<tr>";
    row.forEach((cell) => (html += `<td>${cell}</td>`));
    html += "</tr>";
  });

  html += "</tbody></table>";
  return html;
}

function runQuery() {
  let query;

  // read topic fresh from URL
  const params = new URLSearchParams(window.location.search);
  const selectedTopic = params.get("topic") || "select";

  if (isSandbox) {
    query = document.getElementById("query").value;
  } else {
    if (!examples[selectedTopic]) return;
    query = examples[selectedTopic].sql_example;
  }

  try {
    const result = db.exec(query);
    const outputEl = document.getElementById("output");
    if (outputEl) outputEl.textContent = renderPythonStyleOutput(result);
    renderTable();
  } catch (e) {
    const outputEl = document.getElementById("output");
    if (outputEl) outputEl.textContent = e.message;

    const tableEl = document.getElementById("table");
    if (tableEl) tableEl.innerHTML = "";
  }
}

function renderTable() {
  try {
    const tablesResult = db.exec(`
SELECT name FROM sqlite_master 
WHERE type='table' AND name NOT LIKE 'sqlite_%';
`);

    if (!tablesResult.length) {
      document.getElementById("table").innerHTML = "No tables found.";
      return;
    }

    const tableNames = tablesResult[0].values.map((row) => row[0]);
    let finalHTML = "";

    tableNames.forEach((tableName) => {
      const result = db.exec(`SELECT * FROM ${tableName};`);
      finalHTML += `<h4>${tableName}</h4>`;

      if (!result.length || result[0].values.length === 0) {
        finalHTML += "<p>No data.</p>";
        return;
      }

      const { columns, values } = result[0];
      let html = "<table class='sql-output'><thead><tr>";
      columns.forEach((col) => (html += `<th>${col}</th>`));
      html += "</tr></thead><tbody>";

      values.forEach((row) => {
        html += "<tr>";
        row.forEach((cell) => (html += `<td>${cell}</td>`));
        html += "</tr>";
      });

      html += "</tbody></table>";
      finalHTML += html;
    });

    document.getElementById("table").innerHTML = finalHTML;
  } catch (e) {
    document.getElementById("table").innerHTML = e.message;
  }
}

async function initDB() {
  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: (file) =>
        `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`,
    });
  }

  if (!SQL.Database.prototype._execLogged) {
    const originalExec = SQL.Database.prototype.exec;
    SQL.Database.prototype.exec = function (sql) {
      try {
        const result = originalExec.call(this, sql);
        console.groupCollapsed(`SQL Query @ ${new Date().toISOString()}`);
        console.log("Query:", sql);
        console.log("Result:", result);
        console.groupEnd();
        return result;
      } catch (e) {
        console.groupCollapsed(`SQL Query Error @ ${new Date().toISOString()}`);
        console.log("Query:", sql);
        console.error("Error:", e.message);
        console.groupEnd();
        throw e;
      }
    };
    SQL.Database.prototype._execLogged = true;
  }
  db = new SQL.Database();

  db.run(`
    CREATE TABLE IF NOT EXISTS users(
      id INTEGER PRIMARY KEY,
      name TEXT
    );
  `);

  const countResult = db.exec("SELECT COUNT(*) FROM users;");
  if (countResult[0].values[0][0] === 0) {
    db.run("INSERT INTO users (name) VALUES ('Alice'), ('Bob');");
  }

  renderTable();
}

function resetDB() {
  initDB();
  document.getElementById("output").textContent = "Database Reset.";
}

// Attach buttons after HTML is loaded
window.addEventListener("DOMContentLoaded", () => {
  runBtn.addEventListener("click", runQuery);
  document.getElementById("resetBtn").addEventListener("click", resetDB);

  initDB();
});
