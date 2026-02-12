export const seedData = {
  users: [
  {
    id: "u1",
    username: "russell",
    password: "russell",
    groups: ["g1"],
    online: false
  },
  {
    id: "u2",
    username: "john",
    password: "john",
    groups: ["g1"],
    online: false
  },
  {
    id: "u3",
    username: "sarah",
    password: "123456",
    groups: [],
    online: false
  },
  {
    id: "u4",
    username: "michael",
    password: "123456",
    groups: [],
    online: false
  },
  {
    id: "u5",
    username: "emma",
    password: "emma",
    groups: [],
    online: false
  },
  {
    id: "u6",
    username: "david",
    password: "david",
    groups: [],
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
    },
    {
      id: "m3",
      senderId: "u1",
      content: "How’s everyone finding the new interface?",
      timestamp: "2026-02-11T10:07:00.000Z",
      chatType: "group",
      chatId: "g1",
      replyTo: null,
      readBy: ["u1", "u2"]
    },
    {
      id: "m4",
      senderId: "u2",
      content: "It’s super clean I like the layout.",
      timestamp: "2026-02-11T10:08:30.000Z",
      chatType: "group",
      chatId: "g1",
      replyTo: "m3",
      readBy: ["u1", "u2"]
    },
    {
      id: "m5",
      senderId: "u1",
      content: "Nice! I just finished adding typing indicators.",
      timestamp: "2026-02-11T10:10:00.000Z",
      chatType: "group",
      chatId: "g1",
      replyTo: null,
      readBy: ["u1", "u2"]
    },
    {
      id: "m6",
      senderId: "u2",
      content: "Oh that’s cool. Does it sync across tabs?",
      timestamp: "2026-02-11T10:11:20.000Z",
      chatType: "group",
      chatId: "g1",
      replyTo: "m5",
      readBy: ["u1", "u2"]
    },
    {
      id: "m7",
      senderId: "u1",
      content: "Yep! Using the storage event listener.",
      timestamp: "2026-02-11T10:12:45.000Z",
      chatType: "group",
      chatId: "g1",
      replyTo: "m6",
      readBy: ["u1", "u2"]
    },
    {
      id: "m8",
      senderId: "u2",
      content: "That’s smart. This will be great for the demo.",
      timestamp: "2026-02-11T10:14:00.000Z",
      chatType: "group",
      chatId: "g1",
      replyTo: null,
      readBy: ["u1", "u2"]
    },
    {
      id: "m9",
      senderId: "u1",
      content: "Agreed. Next step: polish the UI animations.",
      timestamp: "2026-02-11T10:15:30.000Z",
      chatType: "group",
      chatId: "g1",
      replyTo: null,
      readBy: ["u1", "u2"]
    },
    {
      id: "m10",
      senderId: "u2",
      content: "Let’s do it",
      timestamp: "2026-02-11T10:16:10.000Z",
      chatType: "group",
      chatId: "g1",
      replyTo: "m9",
      readBy: ["u1", "u2"]
    }
  ]
};
