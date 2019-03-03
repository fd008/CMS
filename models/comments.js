
module.exports =  class comments {
    constructor(cid, cslug, ctext, cpublic, cc, cupd) {
        this.cid = cid;
        this.cslug = cslug;
        this.ctext = ctext;
        this.cpublic = cpublic;
        this.cc = cc;
        this.cupd = cupd;
    }

    getComments() {
        const obj = {
            cid: this.cid,
            cslug: this.cslug,
            ctext: this.ctext,
            cpublic: this.cpublic,
            cc: this.cc,
            cupd: this.cupd
        }
        return obj;
    }
}