const privates = new WeakMap();

module.exports = class Users {
    constructor(uid, uname, uemail, ucreate, upd) {
        privates.set(uid, uid);
        this.uname = uname;
        this.uemail = uemail;
        this.ucreate = ucreate;
        this.upd = upd;
    }

    getId() {
        return privates.get(uid);
    }

    getUsers() {
        const obj = {
            uname: this.uname,
            uemail: this.uemail,
            ucreate: this.ucreate,
            upd: this.upd
        }
        return obj;
    }
}