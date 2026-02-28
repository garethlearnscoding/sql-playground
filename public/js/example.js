const examples = {
  insert: {
    sql_syntax:
      "INSERT INTO table_name (column1, column2) VALUES (value1, value2);",
    sql_example: "INSERT INTO users (id, name) VALUES (3, 'John');",
    python_example: `cursor.execute("INSERT INTO users (id, name) VALUES (?, ?)", (3, "John"))
conn.commit()`,
  },

  select: {
    sql_syntax: "SELECT column1 FROM table_name WHERE condition;",
    sql_example: "SELECT * FROM users WHERE id = 1;",
    python_example: `cursor.execute("SELECT * FROM users WHERE id = ?",(1,))
rows = cursor.fetchall()`,
  },

  update: {
    sql_syntax: "UPDATE table_name SET column = value WHERE condition;",
    sql_example: "UPDATE users SET name = 'May' WHERE id = 2;",
    python_example: `cursor.execute("UPDATE users SET name = ? WHERE id = ?", ("May", 2))
conn.commit()`,
  },

  delete: {
    sql_syntax: "DELETE FROM table_name WHERE condition;",
    sql_example: "DELETE FROM users WHERE id = 1;",
    python_example: `cursor.execute("DELETE FROM users WHERE id = ?", (1,))
conn.commit()`,
  },
};

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
