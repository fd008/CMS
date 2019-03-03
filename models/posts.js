const ID = Symbol('id');

module.exports = class Posts {
    constructor(pid, userID, ptitle, pslug, pbody, ppub, pcreate, pup) {
        this[ID] = pid;
        this.userID = userID;
        this.ptitle = ptitle;
        this.pslug = pslug;
        this.pbody = pbody;
        this.ppub = ppub;
        this.pcreate = pcreate;
        this.pup = pup;
    }

    //encapsulation
    getID() {
        return this[ID];
    }
    setID(num) {
        this[ID] = num;
    }

    getPosts() {
        const obj = {
            userID: this.userID,
            ptitle: this.ptitle,
            pslug: this.pslug,
            pbody: this.pbody,
            ppub: this.ppub,
            pcreate: this.pcreate,
            pup: this.pup
        }
        return obj;
    }
}

