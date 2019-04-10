const express = require("express"),
    app = express(),
    compression = require('compression'),
    conn = require("./middleware/db"),
    conn1 = require("./middleware/db1"),
    db = require("./middleware/dbmanager"),
    helmet = require("helmet"),
    path = require('path'),
    es6Render = require("express-es6-template-engine"),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
    bcrypt = require("bcrypt"),
    csrf = require("csurf"),
    favicon = require('serve-favicon'),
    singlepost = require("./models/singlepost"),
    session = require("express-session"),
    cookieParser = require("cookie-parser"),
    PORT = process.env.PORT || 5000,
    sess = {
        cookie: { maxAge: 3600000 },
        secret: "wgu_cms app 19920#0#",
        resave: false,
        saveUninitialized: false,
        httpOnly: true
    },
    flash = require('connect-flash'),
    saltRounds = 10;

app.disable('x-powered-by');
app.engine("html", es6Render);
app.set("views", "views");
app.set("view engine", "html");
app.use(function (req, res, next) {
    if (!req.session)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});
app.use(cookieParser());
app.use(session(sess));
app.use((req, res, next) => {
    res.locals.user = req.session.user ? req.session.user : '';
    next();
});
app.use(flash());


app.use(compression());
app.use("/public", express.static(__dirname + "/public"));
app.use(favicon(path.join(__dirname, 'public/img/', 'logo.png')));

app.use(methodOverride("_method"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

app.use(csrf({ cookie: true }));
app.use((err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);
    res.status(403);
    res.send("form tempered with");
});

//homepage
app.get("/", (req, res) => {
    conn.query("select postid, user_id, title, slug, CONCAT(SUBSTRING_INDEX(body, ' ',  15), '...' ) as body, published, post_created, post_updated from posts", (err, result) => {
        if (result) {
            res.render("home", {
                locals: {
                    blog: result,
                    title: "homepage",
                    flash: req.flash("info"),
                    user: req.session.user
                },
                partials: {
                    header: "header",
                    nav: "nav",
                    footer: "footer"
                }
            });
        } else {
            res.send("No post exists!");
        }
    });

});

app.get("/search/:text", (req, res) => {
    conn.query(`select postid, title, slug from posts where title like ${conn.escape('%' + req.params.text + '%')} or body like ${conn.escape('%' + req.params.text + '%')};`, (err, result) => {

        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            res.render("search", {
                locals: {
                    user: req.session.user,
                    flash: req.flash("info"),
                    text: req.params.text,
                    ans: result[0] ? result : ''
                },
                partials: {
                    header: "header",
                    nav: "nav",
                    footer: "footer"
                }
            });
        }
    });
});

//create new post
app.get("/new", isAuthenticated, (req, res) => {
    res.render("new", {
        locals: {
            user: req.session.user,
            token: req.csrfToken(),
            flash: req.flash("info")
        },
        partials: {
            header: "header",
            nav: "nav",
            footer: "footer"
        }
    })
});

app.post("/new", isAuthenticated, (req, res) => {

    db.createPost(req.session.user.id, req.body.title, req.body.slug, req.body.body, labels) ? res.redirect("/") : res.redirect("/");

});

app.get("/login", (req, res) => {

    res.render("login", {
        locals: {
            flash: req.flash("info"),
            token: req.csrfToken(),
            user: req.session.user
        },
        partials: {
            header: "header",
            nav: "nav",
            footer: "footer"
        }
    })
});

app.post("/login", (req, res) => {
    const redirect_to = req.session.redirectTo || '/admin';
    conn.query(`select * from users where email = ${conn.escape(req.body.email)}`, (err, result) => {
        console.log(result);
        if (err) {
            console.log(err);
        } else {
            if (result[0]) {
                bcrypt.compare(req.body.password, result[0].password, (err, ans) => {
                    if (ans) {
                        const user = {
                            id: result[0].id,
                            email: result[0].email
                        };
                        req.session.user = user;
                        req.flash("info", "Logged In successfully!");
                        res.redirect(redirect_to);
                        req.session.redirectTo = "";

                    } else {
                        req.flash("info", "wrong email/password!");
                        res.redirect("/login");
                    }
                });
            } else {
                req.flash("info", "Please register!");
                res.redirect("/register");
            }
        }
    });

});

app.get("/logout", isAuthenticated, (req, res) => {
    req.session.user = null;
    req.session.destroy((err) => {

        if (err) {
            console.log(err);
        } else {
            console.log("Successfully logged out!");
        }

    });
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.setHeader('Expires', '-1');
    res.setHeader('Pragma', 'no-cache');
    res.clearCookie("connect.sid");

    res.redirect("/login");
});

app.get("/register", (req, res) => {
    if (req.session.user) {
        req.flash("info", "You are logged in!");
        res.redirect("/");
    }
    res.render("register", {
        locals: {
            flash: req.flash("info"),
            token: req.csrfToken(),
            user: req.session.user
        },
        partials: {
            header: "header",
            nav: "nav",
            footer: "footer"
        }
    })
});

app.post("/register", (req, res) => {
    console.log(req.body);
    conn.query(`select * from users where email = ${conn.escape(req.body.email)};`, (err, result) => {
        console.log(result.length);
        if (result.length > 0) {
            req.flash("info", "Users exists! Please Login.");
            res.redirect("/login");
        } else {
            //hash the password
            bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
                if (db.createUser(req.body.name, req.body.email, hash)) {
                    req.flash("info", "Successfully created!");
                    res.redirect("/login");
                } else {
                    req.flash("info", "User wasn't added! Please register again!");
                    res.redirect("/login");
                }

                // conn.query(`insert into users (username, email, password, created) values (${req.body.name}, ${req.body.email}, ${hash}, curdate() )`, (err, result) => {
                //     if (result.affectedRows > 0) {
                //         console.log("successfully registered! Please Login!");
                //         res.redirect("/login");
                //     } else {
                //         console.log("users wasn't added to the DB");
                //         res.redirect("back");
                //     }
                // });
            });
        }
    });
});

app.get("/admin", isAuthenticated, (req, res) => {
    conn.query(`select postid,title,post_updated as updated, slug from posts;`, (err, result) => {

        res.render("admin", {
            locals: {
                flash: req.flash("info"),
                token: req.csrfToken(),
                user: req.session.user,
                posts: result
            },
            partials: {
                header: "header",
                nav: "nav",
                footer: "footer"
            }
        });
    });

});

app.get("/delete/:id", isAuthenticated, (req, res) => {
    conn.query(`delete from posts where postid = ${conn.escape(req.params.id)}`, (err, result) => {
        if (err) {
            console.log(err);
            req.flash("info", "Delete unsuccessful!!");
            res.redirect("/");
        } else {
            req.flash("info", "Successfully Deleted!");
            res.redirect("/");
        }
    });

});


app.get("/:slug", (req, res) => {
    let sp = '';
    conn1.query(`select * from posts where slug=${conn1.escape(req.params.slug)};select title, slug from posts where slug <> ${conn1.escape(req.params.slug)} order by postid desc limit 5;`, (err, result) => {

        if (err) {
            console.log(err);
        }
        if (result[0][0]) {
            //using the model of singlepost.js
            sp = result[0][0] ? new singlepost(result[0][0].postid, result[0][0].user_id, result[0][0].title, result[0][0].slug, result[0][0].body, result[0][0].published, result[0][0].post_created, result[0][0].post_updated) : '';

            res.render("singlepost", {
                locals: {
                    user: req.session.user,
                    id: sp ? sp.getID() : '',
                    title: sp ? sp.getPosts().ptitle : '',
                    slug: sp ? sp.getPosts().pslug : '',
                    up: sp ? sp.getPosts().pup : '',
                    body: sp ? sp.getPosts().pbody : '',
                    flash: req.flash("info"),
                    token: req.csrfToken(),
                    recents: result[1]
                },
                partials: {
                    header: "header",
                    nav: "nav",
                    footer: "footer"
                }
            });
        } else {
            req.flash("info", "Post doesn't exist");
            res.redirect("/");
        }
    })
});

app.get("/:id/edit", isAuthenticated, (req, res) => {

    conn.query(`select * from posts where postid = ${conn.escape(req.params.id)}`, (err, result) => {

        if (result) {
            res.render("editpost", {
                locals: {
                    user: req.session.user,
                    res: result[0],
                    title: "Edit post",
                    flash: req.flash("info"),
                    token: req.csrfToken()
                },
                partials: {
                    header: "header",
                    nav: "nav",
                    footer: "footer"
                }
            });
        } else {
            res.redirect("/");
        }
    })
});

app.put("/:id", isAuthenticated, (req, res) => {

    //update post call
    if (db.updatePost(req.params.id, req.body.title, req.body.slug, req.body.body)) {
        req.flash("info", "Successfully updated!");
    }
    res.redirect("/");

});




function isAuthenticated(req, res, next) {

    if (req.session.user) {
        next();
    } else {
        req.flash("info", "Please Login to Continue!");
        req.session.user = null;
        req.session.redirectTo = `${req.path}`;
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.redirect("/login");
    }

};


app.listen(PORT, () => console.log(`Listening on ${PORT}`));