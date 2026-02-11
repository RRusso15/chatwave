export default class Group {
    constructor(id, name, members = [], createdBy) {
        this.id = id;
        this.name = name;
        this.members = members;
        this.createdBy = createdBy;
    }
}
