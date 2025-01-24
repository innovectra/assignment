const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT Default '',
      likes INTEGER DEFAULT 0,
      assignedTo INTEGER DEFAULT NULL,
      FOREIGN KEY (assignedTo) REFERENCES assignees (id) ON DELETE SET NULL
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS assignees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL
    )
  `);
  db.run('delete from assignees');
  db.run(`INSERT INTO assignees (name,email) VALUES ('John Doe','bhatsuhail926@gmail.com'), ('Jane Smith','new.concept.app@gmail.com')`);
  db.run('delete from comments');
});

module.exports = { db };