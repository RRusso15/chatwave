export default class Message {
    constructor(id, senderId, content, timestamp, chatType, chatId, replyTo = null, readBy = []) {
        this.id = id;
        this.senderId = senderId;
        this.content = content;
        this.timestamp = timestamp;
        this.chatType = chatType; // takes the values group  or private
        this.chatId = chatId; // groupId  || combination of two user IDs
        this.replyTo = replyTo;
        this.readBy = readBy;
    }
}
