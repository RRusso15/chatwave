export default class User {
    constructor(id, username, password, groups = []) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.groups = groups;
    }
}
