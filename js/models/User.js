export default class User {
    constructor(id, username, password, groups = [],online = false) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.groups = groups;
        this.online = online;
    }
}
