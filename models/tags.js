module.exports = class tags{

    constructor(tid, tslug, tname) {
        this.tid = tid;
        this.tslug = tslug;
        this.tname = tname;
    }

    getTags() {
        const obj = {
            tid: this.tid,
            tslug: this.tslug,
            tname: this.tname
        }
        return obj;
    }
}