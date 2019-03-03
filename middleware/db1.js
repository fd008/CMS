const mysql = require("mysql");
const con = mysql.createPool({
    multipleStatements: true,
    connectionLimit: 15,
    host: "199.175.55.241",
    user: "fd",
    password: "Amarpass19920#0#",
    database: "wgu_cms"
}
);

module.exports = con;