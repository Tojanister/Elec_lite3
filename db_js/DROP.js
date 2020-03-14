var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./Database/testDB.db');

db.serialize(function() {
    db.run("DROP TABLE lorem");
});

db.close();