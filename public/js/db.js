export let db;
let SQL;

export async function initDB() {
  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: file =>
        `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`,
    });
  }

  // Logging override (wrap exec)
  if (!SQL.Database.prototype._execLogged) {
    const originalExec = SQL.Database.prototype.exec;
    SQL.Database.prototype.exec = function(sql) {
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
}


export function execQuery(sql) {
  if (!db) throw new Error("Database not initialized");
  return db.exec(sql);
}