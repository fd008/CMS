const Posts = require("./posts");

//inheritence from posts
module.exports = class singlepost extends Posts {
    constructor(pid, userID, ptitle, pslug, pbody, ppub, pcreate, pup) {
        super(pid, userID, ptitle, pslug, pbody, ppub, pcreate, pup);
    }
}

