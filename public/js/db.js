import { examples } from "../data/data.js";
import { renderTable } from "./ui.js";
export let db;
let SQL;

export async function initDB() {
  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: (file) =>
        `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`,
    });
    overrideExecLogging(SQL);
  }

  db = new SQL.Database();
}

export function overrideExecLogging(SQL) {
  if (SQL.Database.prototype._execLogged) return;

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

export function execQuery(sql) {
  if (!db) throw new Error("Database not initialized");
  return db.exec(sql);
}

export async function resetDatabase(topic = null) {
  console.log("TOPIC:" + topic);

  // Clear all tables
  if (db) {
    const tables = db.exec(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%';
    `);
    tables[0]?.values.forEach((row) => {
      db.exec(`DROP TABLE IF EXISTS ${row[0]};`);
    });
  }

  await initDB(); // fresh DB

  // If topic provided and has setup queries, run them
  if (topic && examples[topic]?.setup) {
    for (const q of examples[topic]?.setup) {
      db.exec(q);
    }
  }

  // Choose table element based on topic
  const tableEl = topic
    ? document.getElementById("tableDocs")
    : document.getElementById("tableSandbox");
  if (tableEl) renderTable(tableEl);

  // Choose output element dynamically
  const outputEl = topic
    ? document.getElementById("outputDocs")
    : document.getElementById("outputSandbox");
  if (outputEl) outputEl.textContent = "Database initialized";
}
