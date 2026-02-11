//check if logged in
let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "../index.html";
}


const chatList = document.getElementById("chatList");
const chatPanel = document.getElementById("chatPanel");
const leftPanel = document.getElementById("leftPanel");
const backBtn = document.getElementById("backBtn");
const tabs = document.querySelectorAll(".tab");
const chatMessages = document.getElementById("chatMessages");
const chatName = document.getElementById("chatName");
const lastSeen = document.querySelector(".last-seen");
const sendIcon = document.getElementById("send-icon");
const messageInput = document.querySelector(".chat-input input");

const emptyState = document.getElementById("emptyState");
const chatContent = document.getElementById("chatContent");


let users = JSON.parse(localStorage.getItem("users")) || [];
let messages = JSON.parse(localStorage.getItem("messages")) || [];
let groups = JSON.parse(localStorage.getItem("groups")) || [];

let activeTab = "Friends";
let activeChat = null;


//listen  for tab close
window.addEventListener("beforeunload", function () {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    users = users.map(user => {
        if (user.email === currentUser.email) {
            user.online = false;
        }
        return user;
    });

    localStorage.setItem("users", JSON.stringify(users));
});


//switch tabs
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        activeTab = tab.textContent.trim();
        renderList();
    });
});

//render relevant list
function renderList() {
    chatList.innerHTML = "";

    if (activeTab === "Friends") {
        renderFriends();
    }

    if (activeTab === "Groups") {
        renderGroups();
    }

    if (activeTab === "Online") {
        renderOnlineUsers();
    }
}

//render every user
function renderFriends() {
    const filteredUsers = users.filter(u => u.id !== currentUser.id);

    filteredUsers.forEach(user => {
        const chatId = generatePrivateChatId(currentUser.id, user.id);
        const lastMessage = getLastMessage("private", chatId);

        chatList.innerHTML += `
            <div class="chat-item" data-type="private" data-id="${chatId}" data-username="${user.username}">
                <img src="../assets/user-profiles/avatar${randomAvatar()}.png">
                <div class="chat-info">
                    <h4>${user.username}</h4>
                    <p>${lastMessage || "No messages yet"}</p>
                </div>
            </div>
        `;
    });
}

//for groups condition
function renderGroups() {
    groups.forEach(group => {
        const lastMessage = getLastMessage("group", group.id);

        chatList.innerHTML += `
            <div class="chat-item" data-type="group" data-id="${group.id}" data-username="${group.name}">
                <img src="../assets/user-profiles/avatar${randomAvatar()}.png">
                <div class="chat-info">
                    <h4>${group.name}</h4>
                    <p>${lastMessage || "Group chat"}</p>
                </div>
            </div>
        `;
    });
}

//only online users render
function renderOnlineUsers() {
    const onlineUsers = users.filter(
        u => u.id !== currentUser.id && u.online === true
    );

    onlineUsers.forEach(user => {
        const chatId = generatePrivateChatId(currentUser.id, user.id);

        chatList.innerHTML += `
            <div class="chat-item" data-type="private" data-id="${chatId}" data-username="${user.username}">
                <img src="../assets/user-profiles/avatar${randomAvatar()}.png">
                <div class="chat-info">
                    <h4>${user.username}</h4>
                    <p>Online</p>
                </div>
            </div>
        `;
    });
}

//open chat
chatList.addEventListener("click", function (e) {
    const item = e.target.closest(".chat-item");
    if (!item) return;

    const type = item.dataset.type;
    const id = item.dataset.id;
    const name = item.dataset.username;

    activeChat = { type, id };

    chatName.textContent = name;
    if (type === "group") {
        lastSeen.textContent = "Group Chat";
    } else {
        const otherUserId = id.split("_").find(uid => uid !== currentUser.id);
        const otherUser = users.find(u => u.id == otherUserId);

        lastSeen.textContent = otherUser?.online ? "Private Chat: User Online" : "Private Chat: User Offline";
    }

    emptyState.style.display = "none";
    chatContent.style.display = "flex";

    renderMessages();

    if (window.innerWidth <= 900) {
        chatPanel.classList.add("active");
        leftPanel.style.display = "none";
    }
});


//render current chat messages
function renderMessages() {
    chatMessages.innerHTML = "";

    if (!activeChat) return;

    const convo = messages
        .filter(m => m.chatType === activeChat.type && m.chatId === activeChat.id)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    convo.forEach(msg => {
        const isSent = msg.senderId === currentUser.id;
        const sender = users.find(u => u.id === msg.senderId);

        let senderNameTag = "";

        // Only show sender name in GROUP chats and not for yourself
        if (activeChat.type === "group" && !isSent) {
            senderNameTag = `<div class="sender-name">${sender?.username}</div>`;
        }

        chatMessages.innerHTML += `
            <div class="message-wrapper ${isSent ? "sent-wrapper" : "received-wrapper"}">
                ${senderNameTag}
                <div class="message ${isSent ? "sent" : "received"}">
                    <div class="message-text">${msg.content}</div>
                    <div class="message-time">${formatTime(msg.timestamp)}</div>
                </div>
            </div>
        `;
    });


    chatMessages.scrollTop = chatMessages.scrollHeight;
}


//send a message
sendIcon.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
});

function sendMessage() {
    if (!activeChat) return;

    const content = messageInput.value.trim();
    if (!content) return;

    const newMessage = {
        id: "m" + Date.now(),
        senderId: currentUser.id,
        content: content,
        timestamp: new Date().toISOString(),
        chatType: activeChat.type,
        chatId: activeChat.id
    };

    messages.push(newMessage);
    localStorage.setItem("messages", JSON.stringify(messages));

    messageInput.value = "";
    renderMessages();
    renderList(); // update last message preview
}


//helper functions
function getLastMessage(type, chatId) {
    const convo = messages
        .filter(m => m.chatType === type && m.chatId === chatId)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    if (convo.length === 0) return null;

    const last = convo[convo.length - 1].content;
    return last.length > 50 ? last.substring(0, 50) + "..." : last;

}

function generatePrivateChatId(user1, user2) {
    return [user1, user2].sort().join("_");
}

function randomAvatar() {
    return Math.floor(Math.random() * 7) + 1;
}

//get time from timestamp
function formatTime(isoString) {
    const date = new Date(isoString);

    return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
}


//mobiile---back

backBtn.addEventListener("click", function () {
    chatPanel.classList.remove("active");
    leftPanel.style.display = "flex";
});

renderList();

//real time listner to storage changes
window.addEventListener("storage", function (e) {

    if (e.key === "messages") {
        messages = JSON.parse(e.newValue) || [];

        if (activeChat) {
            renderMessages();
        }

        renderList();
    }

    if (e.key === "users") {
        users = JSON.parse(e.newValue) || [];

        // Update online status in header if chat is open
        if (activeChat && activeChat.type === "private") {
            const otherUserId = activeChat.id
                .split("_")
                .find(uid => uid !== currentUser.id);

            const otherUser = users.find(u => u.id == otherUserId);

            lastSeen.textContent = otherUser?.online
                ? "Private Chat: User Online"
                : "Private Chat: User Offline";
        }

        renderList();
    }

    if (e.key === "groups") {
        groups = JSON.parse(e.newValue) || [];
        renderList();
    }
});
