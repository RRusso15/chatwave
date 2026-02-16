export default class User {
    constructor(id, username, password, groups = [],online = false,avatar = null) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.groups = groups;
        this.online = online;
        this.avatar = avatar;
    }

    generateAvatar() {
        return Math.floor(Math.random() * 7) + 1;
    }
}
