const db = require("./db");

module.exports = {

    createPost: (user_id, title, slug, body, tags) => {

        let done = false;
        db.query(`insert into posts (user_id, title, slug, body, published, post_created) values (${db.escape(user_id)}, ${db.escape(title)}, ${db.escape(slug)}, ${db.escape(body)}, true, curdate() )`, (err, result) => {
            if (err) {
                console.log(err);
                return done;
            } else {
                done = true;
                console.log("post inserted! " + result.insertId);
                return done;
            }
        });

    },

    updatePost: (id, title, slug, body) => {

        let done = '';
        db.query(`update posts set title = ${db.escape(title)}, slug = ${db.escape(slug)}, body = ${db.escape(body)} where postid = ${db.escape(id)}`, (err, result) => {
            if (result.affectedRows > 0) {
                done = true;
                console.log("post updated! " + result.affectedRows);

            } else {
                done = false;
                console.log("post wasn't updated! " + result.affectedRows);

            }
            if (err) {
                console.log(err);
            }

        });
        return done;
    },

    delPost: (id) => {
        let done = false;
        db.query(`delete from posts where postid = ${db.escape(id)}`, (err, result) => {
            if (err) {
                console.log(err);
            }
            if (result.affectedRows > 0) {
                done = true;
                console.log("post deleted!");
                return done;
            } else {
                console.log("post wasn't deleted!");
                return done;
            }
        });

    },

    createUser: (username, email, password) => {
        let done = false;

        db.query(`insert into users( username, email, password, created ) values (${db.escape(username)}, ${db.escape(email)}, ${db.escape(password)}, curdate() );`, (err, result) => {
            if (err) {
                console.log(err);
                return done;
            } else {
                done = true;
                console.log("user added! " + result.insertId);
                return done;
            }
        });

    },

    updateUser: (username, email, password) => {
        let done = false;
        db.query(`update users set username = ${db.escape(username)}, email = ${db.escape(email)}, password = ${db.escape(password)}`, (err, result) => {
            if (err) {
                console.log(err);
            }
            if (result.affectedRows > 0) {
                done = true;
                console.log("user updated!");
                return done;
            } else {
                return done;
                console.log("user wasn't updated!");
            }
        });

    },

    delUser: (id) => {
        let done = false;
        db.query(`delete from users where id =${db.escape(id)}`, (err, result) => {
            if (err) {
                console.log(err);
            }
            if (result.affectedRows > 0) {
                done = true;
                console.log("user deleted!");
                return done;
            } else {
                console.log("user wasn't deleted!");
                return done;
            }
        });

    }
};

