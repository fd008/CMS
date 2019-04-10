const mysql = require("mysql");
const con = mysql.createPool({
    multipleStatements: true,
    connectionLimit: 15,
    host: "52.206.157.109",
    user: "U054eD",
    password: "53688419536",
    database: "U054eD"
}
);

module.exports = con;