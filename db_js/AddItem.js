var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./Database/testDB.db', (err) => {
        if (err) {
            console.error(err.message);
        }
    });

/*
db.serialize( (ListItem) => {
    InsertDB(ListItem, db);
});
*/

function InsertDB(ListItem, db){
    db.run("CREATE TABLE if not exists Lists (list_items TEXT)");
    var stmt = db.prepare("INSERT INTO Lists VALUES (?)");
    stmt.run(ListItem);
    stmt.finalize();
}

