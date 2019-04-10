const mysql = require("mysql");
const con = mysql.createPool({
    connectionLimit: 10,
    host: "host ip here",
    user: "username here",
    password: "password here",
    database: "database here"
}
);



//users table
con.query(`CREATE TABLE users (
    id int(11) NOT NULL AUTO_INCREMENT,
    username varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    created date not null,
    updated timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id) )`, (err, res) => {
        if (err) {
            console.log("users table exists");
        } else {
            console.log("users table created!");
        }
    }
);

con.query(`insert into users(id, username, email, password, created ) values( 1 ,'wgu_user', 'fhasan4@wgu.edu', 'wguproject123', curdate())`, (err, res) => {
    if (err) {
        console.log("user already exists!");
    } else {
        console.log("users inserted");
    }
});

//posts table
con.query(`CREATE TABLE posts  (
    postid int(11) NOT NULL AUTO_INCREMENT,
    user_id int(11) DEFAULT NULL,
    title varchar(255) NOT NULL,
    slug varchar(255) NOT NULL,
    body text NOT NULL,
    published tinyint(1) NOT NULL,
    post_created date not null,
    post_updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (postid),
    UNIQUE KEY slug (slug),
    KEY user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES users (id) )`, (err, result) => {
        if (err) {
            console.log("posts table exists!");
        } else {
            console.log("posts table created!");
        }

    }
);

con.query(`insert into posts (postid, user_id, title, slug, body, published, post_created) values (1, 1, 'First Post Title', 'first-post', 'This is the body of the CMS. Add text/images/videos here using the Wysiwyg text editor.',  1, curdate() )`, (err, res) => {
    if (err) {
        console.log("post exists!");
    } else {
        console.log("post inserted!");
    }
});

con.query(`insert into posts (postid, user_id, title, slug, body, tags, published, post_created) values (2, 1, 'Second Post Title', 'second-post', 'This is the body of second post of the CMS. Add text/images/videos here using the Wysiwyg text editor.', 1, curdate() )`, (err, res) => {
    if (err) {
        console.log("post exists!");
    } else {
        console.log("post inserted!");
    }
});





module.exports = con;