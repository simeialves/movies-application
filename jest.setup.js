const { db } = require("./src/config/db");

afterEach((done) => {
  db.serialize(() => {
    db.run("DELETE FROM movies_producers;", done);
    db.run("DELETE FROM producers;");
    db.run("DELETE FROM movies;");
  });
});
