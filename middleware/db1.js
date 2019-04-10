const mysql = require("mysql");
const con = mysql.createPool({
    multipleStatements: true,
    connectionLimit: 15,
    host: "mysql ip here",
    user: "username here",
    password: "password here",
    database: "database name here"
}
);

module.exports = con;