function wrapPythonExample(code) {
  return `import sqlite3

con = sqlite3.connect("test.db")
cursor = con.cursor()
${code}
con.close()`;
}

export const tablesData = {
  borrower_table: `
    CREATE TABLE Borrower (
      ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      FirstName TEXT NOT NULL,
      Surname TEXT NOT NULL,
      Contact TEXT NOT NULL
    );
  `,
  publisher_table: `
    CREATE TABLE Publisher (
      ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      Name TEXT NOT NULL
    );
  `,
  book_table: `
    CREATE TABLE Book (
      ID INTEGER PRIMARY KEY NOT NULL,
      Title TEXT NOT NULL,
      PublisherID INTEGER,
      Damaged INTEGER CHECK(Damaged IN (0,1)),
      Price REAL NOT NULL,
      FOREIGN KEY (PublisherID) REFERENCES Publisher(ID)
    );
  `,
  loan_table: `
    CREATE TABLE Loan (
      ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      BorrowerID INTEGER NOT NULL,
      BookID INTEGER NOT NULL,
      DateBorrowed TEXT,
      FOREIGN KEY (BorrowerID) REFERENCES Borrower(ID),
      FOREIGN KEY (BookID) REFERENCES Book(ID)
    );
  `,
  borrower_data: `
    INSERT INTO Borrower(FirstName, Surname, Contact) VALUES
      ("Peter","Tan","999"),
      ("Sarah","Lee","81111123"),
      ("Kumara","Ravi","94456677"),
      ("Some","User","11111111");
  `,
  publisher_data: `
    INSERT INTO Publisher(Name) VALUES
      ("NPH"),
      ("Unpop"),
      ("Appleson"),
      ("Squirrel"),
      ("Yellow Flame");
  `,
  book_data: `
    INSERT INTO Book(ID, Title, PublisherID, Damaged, Price) VALUES
      (1, "The Lone Gatsby", 5, 0,15.99),
      (2, "A Winter's Slumber", 4, 1,21.30),
      (3, "Life of Pie", 4, 0,3.14),
      (4, "A Brief History of Primates", 3, 0,11.30),
      (5, "To Praise a Mocking Bird", 2, 0,18.99),
      (6, "The Catcher in the Eye", 1, 1,14.59),
      (123, "H2 Computing Ten Year Series", NULL, 0,6.70);
  `,
  loan_data: `
    INSERT INTO Loan(BorrowerID, BookID, DateBorrowed) VALUES
      (3, 2, "20180220"),
      (3, 1, "20171215"),
      (2, 3, "20171231"),
      (1, 5, "20180111");
  `,
};

export const setupQueries = {
  insert: [tablesData["publisher_table"], tablesData["publisher_data"]],
  update: [tablesData["book_table"], tablesData["book_data"]],
  select: [tablesData["book_table"], tablesData["book_data"]],
  delete: [tablesData["book_table"], tablesData["book_data"]],
  where: [tablesData["book_table"], tablesData["book_data"]],
  order_by: [tablesData["loan_table"], tablesData["loan_data"]],
  join: [
    tablesData["book_table"],
    tablesData["book_data"],
    tablesData["publisher_table"],
    tablesData["publisher_data"],
  ],
  left_outer_join: [
    tablesData["book_table"],
    tablesData["book_data"],
    tablesData["publisher_table"],
    tablesData["publisher_data"],
  ],
  count: [tablesData["loan_table"], tablesData["loan_data"]],
  sum: [
    tablesData["loan_table"],
    tablesData["loan_data"],
    tablesData["book_table"],
    tablesData["book_data"],
  ],
  avg: [
    tablesData["book_table"],
    tablesData["book_data"],
    tablesData["publisher_table"],
    tablesData["publisher_data"],
  ],
  group_by: [
    tablesData["book_table"],
    tablesData["book_data"],
    tablesData["publisher_table"],
    tablesData["publisher_data"],
  ],
  drop: [tablesData["borrower_table"], tablesData["borrower_data"]],
};

export const examples = {
  insert: {
    setup: [tablesData["publisher_table"], tablesData["publisher_data"]],
    sql_syntax: `INSERT INTO <TABLE>(ATTRIBUTE_1, ATTRIBUTE_2, ...) VALUES (VALUE_1, VALUE_2, ...)`,
    sql_example: `INSERT INTO Publisher(Name) VALUES ("Penguin")`,
    python_example: wrapPythonExample(`cursor.execute('INSERT INTO Publisher(Name) VALUES ("Penguin")')`),
    goal: "Add a new publisher named 'Penguin' to the Publisher table."
  },
  update: {
    setup: [tablesData["book_table"], tablesData["book_data"]],
    sql_syntax: `UPDATE <TABLE> SET ATTRIBUTE = VALUE WHERE CONDITION`,
    sql_example: `UPDATE Book SET Damaged = 1 WHERE ID = 3`,
    python_example: wrapPythonExample(`cursor.execute('UPDATE Book SET Damaged = 1 WHERE ID = 3')`),
    goal: "Mark the book with ID 3 as damaged in the Book table."
  },
  select: {
    setup: [tablesData["book_table"], tablesData["book_data"]],
    sql_syntax: `SELECT ATTRIBUTE_1, ATTRIBUTE_2 FROM <TABLE> WHERE CONDITION`,
    sql_example: `SELECT ID, Title, Price FROM Book`,
    python_example: wrapPythonExample(`cursor.execute('SELECT ID, Title, Price FROM Book')`),
    goal: "Retrieve the ID, Title, and Price of all books from the Book table."
  },
  delete: {
    setup: [tablesData["book_table"], tablesData["book_data"]],
    sql_syntax: `DELETE FROM <TABLE> WHERE CONDITION`,
    sql_example: `DELETE FROM Book WHERE ID = 123`,
    python_example: wrapPythonExample(`cursor.execute('DELETE FROM Book WHERE ID = 123')`),
    goal: "Remove the book with ID 123 from the Book table."
  },
  where: {
    setup: [tablesData["book_table"], tablesData["book_data"]],
    sql_syntax: `SELECT * FROM <TABLE> WHERE ATTRIBUTE = VALUE`,
    sql_example: `SELECT * FROM Book WHERE Damaged = 1`,
    python_example: wrapPythonExample(`cursor.execute('SELECT * FROM Book WHERE Damaged = 1')`),
    goal: "Retrieve all books that are marked as damaged."
  },
  order_by: {
    setup: [tablesData["loan_table"], tablesData["loan_data"]],
    sql_syntax: `SELECT * FROM <TABLE> ORDER BY ATTRIBUTE ASC|DESC`,
    sql_example: `SELECT * FROM Loan ORDER BY DateBorrowed DESC`,
    python_example: wrapPythonExample(`cursor.execute('SELECT * FROM Loan ORDER BY DateBorrowed DESC')`),
    goal: "List all loans sorted by the borrowing date, most recent first."
  },
  join: {
    setup: [
      tablesData["book_table"],
      tablesData["book_data"],
      tablesData["publisher_table"],
      tablesData["publisher_data"],
    ],
    sql_syntax: `SELECT <ATTRIBUTES> FROM <TABLE_1> JOIN <TABLE_2> ON <CONDITION>`,
    sql_example: `SELECT Book.Title, Publisher.Name
FROM Book
JOIN Publisher ON Book.PublisherID = Publisher.ID`,
    python_example: wrapPythonExample(`cursor.execute("""SELECT Book.Title, Publisher.Name
FROM Book
JOIN Publisher ON Book.PublisherID = Publisher.ID""")`),
    goal: "List all books along with their publisher names using an INNER JOIN."
  },
  left_outer_join: {
    setup: [
      tablesData["book_table"],
      tablesData["book_data"],
      tablesData["publisher_table"],
      tablesData["publisher_data"],
    ],
    sql_syntax: `SELECT <ATTRIBUTES> FROM <TABLE_1> LEFT OUTER JOIN <TABLE_2> ON <CONDITION>`,
    sql_example: `SELECT Book.Title, Publisher.Name
FROM Book
LEFT OUTER JOIN Publisher ON Book.PublisherID = Publisher.ID`,
    python_example: wrapPythonExample(`cursor.execute("""SELECT Book.Title, Publisher.Name
FROM Book
LEFT OUTER JOIN Publisher ON Book.PublisherID = Publisher.ID""")`),
    goal: "List all books and include publisher names if they exist, otherwise show NULL."
  },
  count: {
    setup: [tablesData["loan_table"], tablesData["loan_data"]],
    sql_syntax: `SELECT ATTRIBUTE_1, COUNT(ATTRIBUTE_2) FROM <TABLE> GROUP BY ATTRIBUTE_1`,
    sql_example: `SELECT BorrowerID, COUNT(*) AS TotalLoans
FROM Loan
GROUP BY BorrowerID`,
    python_example: wrapPythonExample(`cursor.execute("""SELECT BorrowerID, COUNT(*) AS TotalLoans
FROM Loan
GROUP BY BorrowerID""")`),
    goal: "Count how many loans each borrower has made."
  },
  sum: {
    setup: [
      tablesData["loan_table"],
      tablesData["loan_data"],
      tablesData["book_table"],
      tablesData["book_data"],
    ],
    sql_syntax: `SELECT ATTRIBUTE_1, SUM(ATTRIBUTE_2) FROM <TABLE> GROUP BY ATTRIBUTE_1`,
    sql_example: `SELECT Loan.BorrowerID, SUM(Book.Price) AS TotalSpent
FROM Loan
JOIN Book ON Loan.BookID = Book.ID
GROUP BY Loan.BorrowerID`,
    python_example: wrapPythonExample(`cursor.execute("""SELECT Loan.BorrowerID, SUM(Book.Price) AS TotalSpent
FROM Loan
JOIN Book ON Loan.BookID = Book.ID
GROUP BY Loan.BorrowerID""")`),
    goal: "Calculate the total amount each borrower has spent on all their borrowed books."
  },
  avg: {
    setup: [
      tablesData["book_table"],
      tablesData["book_data"],
      tablesData["publisher_table"],
      tablesData["publisher_data"],
    ],
    sql_syntax: `SELECT ATTRIBUTE_1, AVG(ATTRIBUTE_2) FROM <TABLE> GROUP BY ATTRIBUTE_1`,
    sql_example: `SELECT Publisher.Name, AVG(Book.Price) AS AvgPrice
FROM Book
JOIN Publisher ON Book.PublisherID = Publisher.ID
GROUP BY Publisher.Name`,
    python_example: wrapPythonExample(`cursor.execute("""SELECT Publisher.Name, AVG(Book.Price) AS AvgPrice
FROM Book
JOIN Publisher ON Book.PublisherID = Publisher.ID
GROUP BY Publisher.Name""")`),
    goal: "Compute the average book price for each publisher."
  },
  group_by: {
    setup: [
      tablesData["book_table"],
      tablesData["book_data"],
      tablesData["publisher_table"],
      tablesData["publisher_data"],
    ],
    sql_syntax: `SELECT ATTRIBUTE_1, AGGREGATE_FN(ATTRIBUTE_2) FROM <TABLE> GROUP BY ATTRIBUTE_1`,
    sql_example: `SELECT Publisher.Name,
       COUNT(Book.ID) AS NumBooks,
       AVG(Book.Price) AS AvgPrice
FROM Book
JOIN Publisher ON Book.PublisherID = Publisher.ID
GROUP BY Publisher.Name`,
    python_example: wrapPythonExample(`cursor.execute("""SELECT Publisher.Name,
       COUNT(Book.ID) AS NumBooks,
       AVG(Book.Price) AS AvgPrice
FROM Book
JOIN Publisher ON Book.PublisherID = Publisher.ID
GROUP BY Publisher.Name""")`),
    goal: "For each publisher, count the number of books and calculate the average price of their books."
  },
  drop: {
    setup: [tablesData["borrower_table"], tablesData["borrower_data"]],
    sql_syntax: `DROP TABLE <NAME>`,
    sql_example: `DROP TABLE Borrower`,
    python_example: wrapPythonExample(`cursor.execute("DROP TABLE Borrower")`),
    goal: "Delete the entire Borrower table from the database."
  },
  create: {
    setup: [],
    sql_syntax: `CREATE TABLE <NAME>(ATTRIBUTE_1 TYPE, ATTRIBUTE_2 TYPE, ...)`,
    sql_example: tablesData["book_table"],
    python_example: wrapPythonExample(`cursor.execute("""CREATE TABLE Book (
      ID INTEGER PRIMARY KEY NOT NULL,
      Title TEXT NOT NULL,
      PublisherID INTEGER,
      Damaged INTEGER CHECK(Damaged IN (0,1)),
      Price REAL NOT NULL,
      FOREIGN KEY (PublisherID) REFERENCES Publisher(ID)
    )""")`),
    goal: "Create a Book table with ID, Title, Publisher, Damaged status, and Price."
  },
};