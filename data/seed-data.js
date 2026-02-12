export const seedData = {
  users: [
    {
      id: "u1",
      username: "russell",
      password: "123456",
      groups: ["g1"],
      online: false
    },
    {
      id: "u2",
      username: "john",
      password: "password123",
      groups: ["g1"],
      online: false
    }
  ],

  groups: [
    {
      id: "g1",
      name: "General",
      members: ["u1", "u2"],
      createdBy: "u1"
    }
  ],

  messages: [
    {
      id: "m1",
      senderId: "u1",
      content: "Welcome to Chatwave!",
      timestamp: "2026-02-11T10:00:00.000Z",
      chatType: "group",
      chatId: "g1",
      replyTo: null,
      readBy: ["u1", "u2"]
    },
    {
      id: "m2",
      senderId: "u2",
      content: "Excited to start chatting!",
      timestamp: "2026-02-11T10:05:00.000Z",
      chatType: "group",
      chatId: "g1",
      replyTo: null,
      readBy: ["u1", "u2"]
    }
  ]
};
