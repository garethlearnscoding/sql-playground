function wrapPythonExample(code) {
  return `import sqlite3
  
con = sqlite3.connect("test.db")
cursor = con.cursor()
${code}
con.close()`;
}

export const examples = {
  insert: {
    sql_syntax:
      "INSERT INTO table_name (column1, column2) VALUES (value1, value2);",
    sql_example: "INSERT INTO users (id, name) VALUES (3, 'John');",
    python_example: wrapPythonExample(`cursor.execute("INSERT INTO users (id, name) VALUES (?, ?)", (3, "John"))
con.commit()`),
  },

  select: {
    sql_syntax: "SELECT column1 FROM table_name WHERE condition;",
    sql_example: "SELECT * FROM users WHERE id = 1;",
    python_example: wrapPythonExample(`cursor.execute("SELECT * FROM users WHERE id = ?",(1,))
rows = cursor.fetchall()`),
  },

  update: {
    sql_syntax: "UPDATE table_name SET column = value WHERE condition;",
    sql_example: "UPDATE users SET name = 'May' WHERE id = 2;",
    python_example: wrapPythonExample(`cursor.execute("UPDATE users SET name = ? WHERE id = ?", ("May", 2))
con.commit()`),
  },

  delete: {
    sql_syntax: "DELETE FROM table_name WHERE condition;",
    sql_example: "DELETE FROM users WHERE id = 1;",
    python_example: wrapPythonExample(`cursor.execute("DELETE FROM users WHERE id = ?", (1,))
con.commit()`),
  },
};