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

const settingsBtn = document.getElementById("settingsBtn");

const addGroupBtn = document.getElementById("addGroupBtn");
const groupModal = document.getElementById("groupModal");
const profileModal = document.getElementById("profileModal");
const overlay = document.getElementById("modalOverlay");

const closeGroupModal = document.getElementById("closeGroupModal");
const closeProfileModal = document.getElementById("closeProfileModal");

const createGroupBtn = document.getElementById("createGroupBtn");
const groupNameInput = document.getElementById("groupNameInput");

const replyPreview = document.getElementById("replyPreview");
const replyText = document.getElementById("replyText");
const cancelReply = document.getElementById("cancelReply");

const searchInput = document.getElementById("searchInput");
let searchQuery = "";


let users = JSON.parse(localStorage.getItem("users")) || [];
let messages = JSON.parse(localStorage.getItem("messages")) || [];
let groups = JSON.parse(localStorage.getItem("groups")) || [];

let activeTab = "Friends";
let activeChat = null;
let replyingTo = null;

let typingTimeout = null;

//opening modals for rgoup or profile view
const profileHeader = document.querySelector(".chat-header");

setUserOnline();


function setUserOnline() {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    users = users.map(user => {
        if (user.id === currentUser.id) {
            user.online = true;
        }
        return user;
    });

    localStorage.setItem("users", JSON.stringify(users));
}

addGroupBtn.addEventListener("click", () => {
    overlay.classList.add("active");
    groupModal.classList.add("active");
    const groupUserList = document.getElementById("groupUserList");
    groupUserList.innerHTML = "";

    users
        .filter(u => u.id !== currentUser.id)
        .forEach(user => {
            groupUserList.innerHTML += `
            <div class="group-user-row">
                <label class="group-user-label">
                    <input 
                        type="checkbox" 
                        class="group-user-checkbox" 
                        value="${user.id}"
                    >
                    <span>${user.username}</span>
                </label>
            </div>`;

        });
});

searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderList();
});


profileHeader.addEventListener("click", (e) => {
    if (e.target.id === "backBtn") return;

    if (!activeChat) return;

    overlay.classList.add("active");
    profileModal.classList.add("active");

    const profileUsername = document.getElementById("profileUsername");
    const profileLastSeen = document.getElementById("profileLastSeen");
    const profileAvatar = document.getElementById("profileAvatar");

    if (activeChat.type === "group") {

        const group = groups.find(g => g.id == activeChat.id);

        profileUsername.textContent = group?.name || "Group";
        profileLastSeen.textContent = `Created by ${getUsername(group?.createdBy)}`;
        profileAvatar.src = "../assets/user-profiles/avatar1.png";

        const groupDetails = document.getElementById("groupDetails");

        const memberNames = group.members
            .map(memberId => getUsername(memberId))
            .join(", ");

        groupDetails.innerHTML = `
            <p><strong>Members:</strong></p>
            <p>${memberNames}</p>
        `;
    }else {

        const otherUserId = activeChat.id
            .split("_")
            .find(uid => uid !== currentUser.id);

        const otherUser = users.find(u => u.id == otherUserId);

        profileUsername.textContent = otherUser?.username || "User";
        profileLastSeen.textContent = otherUser?.online
            ? "User Online"
            : "User Offline";

        profileAvatar.src = `../assets/user-profiles/avatar${randomAvatar()}.png`;
    }
});


//helper to show group details fully
function getUsername(userId) {
    const user = users.find(u => u.id === userId);
    return user ? user.username : "Unknown";
}



function closeModals() {
    overlay.classList.remove("active");
    groupModal.classList.remove("active");
    profileModal.classList.remove("active");
}

overlay.addEventListener("click", closeModals);
closeGroupModal.addEventListener("click", closeModals);
closeProfileModal.addEventListener("click", closeModals);

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModals();
});

//create a new group
createGroupBtn.addEventListener("click", () => {
    const groupName = groupNameInput.value.trim();

    if (!groupName) {
        alert("Please enter a group name");
        return;
    }

    const selectedUsers = Array.from(
    document.querySelectorAll(".group-user-checkbox:checked")
    ).map(cb => cb.value);

    const newGroup = {
        id: "g" + Date.now(),
        name: groupName,
        members: [...selectedUsers, currentUser.id],
        createdBy: currentUser.id,
        createdAt: new Date().toISOString()
    };


    groups.push(newGroup);

    localStorage.setItem("groups", JSON.stringify(groups));

    groupNameInput.value = "";
    closeModals();
    renderList();
});



//listen  for tab close
window.addEventListener("beforeunload", function () {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    users = users.map(user => {
        if (user.id === currentUser.id) {
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

    if (chatList.innerHTML.trim() === "") {
        chatList.innerHTML = `<p class="no-results">No chats found</p>`;
    }

}

//render every user
function renderFriends() {
    const filteredUsers = users.filter(u =>
        u.id !== currentUser.id &&
        u.username.toLowerCase().includes(searchQuery)
    );


    filteredUsers.forEach(user => {
        const chatId = generatePrivateChatId(currentUser.id, user.id);
        const lastMessage = getLastMessage("private", chatId);
        const unreadCount = messages.filter(m =>
            m.chatType === "private" &&
            m.chatId === chatId &&
            !m.readBy.includes(currentUser.id)
        ).length;


        chatList.innerHTML += `
            <div class="chat-item" data-type="private" data-id="${chatId}" data-username="${user.username}">
                <img src="../assets/user-profiles/avatar${randomAvatar()}.png">
                <div class="chat-info">
                    <h4>${user.username}</h4>
                    <p>${lastMessage || "No messages yet"}</p>
                </div>
                ${unreadCount > 0 ? `<span class="unread-badge">${unreadCount > 9 ? "9+" : unreadCount}</span>` : ""}
            </div>
        `;
    });
}

//for groups condition
function renderGroups() {

    const userGroups = groups.filter(group =>
        group.members?.includes(currentUser.id) &&
        group.name.toLowerCase().includes(searchQuery)
    );


    userGroups.forEach(group => {
        const lastMessage = getLastMessage("group", group.id);

        chatList.innerHTML += `
            <div class="chat-item" 
                 data-type="group" 
                 data-id="${group.id}" 
                 data-username="${group.name}">
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
        u =>
            u.id !== currentUser.id &&
            u.online === true &&
            u.username.toLowerCase().includes(searchQuery)
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

    // Mark messages as read
    messages.forEach(m => {
        if (
            m.chatType === activeChat.type &&
            m.chatId === activeChat.id &&
            !m.readBy.includes(currentUser.id)
        ) {
            m.readBy.push(currentUser.id);
        }
    });

    localStorage.setItem("messages", JSON.stringify(messages));
    renderList();
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
        let replyQuote = "";

        // Only show sender name in GROUP chats and not for yourself
        if (activeChat.type === "group" && !isSent) {
            senderNameTag = `<div class="sender-name">${sender?.username}</div>`;
        }

        if (msg.replyTo) {
            const original = messages.find(m => m.id === msg.replyTo);
            if (original) {
                replyQuote = `
                    <div class="reply-quote" data-scroll="${original.id}">
                        ${original.content.substring(0, 50)}
                    </div>
                `;
            }
        }


        chatMessages.innerHTML += `
            <div class="message-wrapper ${isSent ? "sent-wrapper" : "received-wrapper"}">
                ${senderNameTag}
                <div class="message ${isSent ? "sent" : "received"}" data-id="${msg.id}">
                    ${replyQuote}
                    <div class="message-text">${msg.content}</div>
                    <div class="message-time">${formatTime(msg.timestamp)}</div>
                </div>
            </div>
        `;
    });


    chatMessages.scrollTop = chatMessages.scrollHeight;
    //scroll to the message being replied
    document.querySelectorAll(".reply-quote").forEach(el => {
        el.addEventListener("click", function () {
            const targetId = this.dataset.scroll;
            const targetMessage = document.querySelector(`.message[data-id="${targetId}"]`);

            if (targetMessage) {
                targetMessage.scrollIntoView({ behavior: "smooth", block: "center" });
                targetMessage.classList.add("highlight-message");

                setTimeout(() => {
                    targetMessage.classList.remove("highlight-message");
                }, 1000);
            }
        });
    });


    // Add click listener to each message
    document.querySelectorAll(".message").forEach(el => {
        el.addEventListener("click", function (e) {

            if (e.target.closest(".reply-quote")) return;
            
            const messageId = this.dataset.id;
            const originalMessage = messages.find(m => m.id === messageId);

            if (!originalMessage) return;

            replyingTo = messageId;
            replyText.textContent = originalMessage.content.length > 50
                ? originalMessage.content.substring(0, 50) + "..."
                : originalMessage.content;

            replyPreview.style.display = "flex";
            messageInput.focus();
        });
    });

    cancelReply.addEventListener("click", () => {
        replyingTo = null;
        replyPreview.style.display = "none";
    });

}



//send a message
sendIcon.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
});

// typing status
messageInput.addEventListener("input", () => {
    if (!activeChat) return;

    let typingStatus = JSON.parse(localStorage.getItem("typingStatus")) || {};

    if (!typingStatus[activeChat.id]) {
        typingStatus[activeChat.id] = {};
    }

    typingStatus[activeChat.id][currentUser.id] = true;

    localStorage.setItem("typingStatus", JSON.stringify(typingStatus));
    clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
        stopTyping();
    }, 1500);
});

function stopTyping() {
    if (!activeChat) return;

    let typingStatus = JSON.parse(localStorage.getItem("typingStatus")) || {};

    if (typingStatus[activeChat.id]) {
        delete typingStatus[activeChat.id][currentUser.id];

        if (Object.keys(typingStatus[activeChat.id]).length === 0) {
            delete typingStatus[activeChat.id];
        }

        localStorage.setItem("typingStatus", JSON.stringify(typingStatus));
    }
}


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
        chatId: activeChat.id,
        replyTo: replyingTo,
        readBy: [currentUser.id]
    };

    messages.push(newMessage);
    localStorage.setItem("messages", JSON.stringify(messages));
    stopTyping();

    messageInput.value = "";
    renderMessages();
    renderList();
    replyingTo = null;
    replyPreview.style.display = "none";
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

        const newMessages = messages.filter(m =>
            m.senderId !== currentUser.id &&
            !m.readBy?.includes(currentUser.id)
        );

        // Only show toast for newest message
        if (newMessages.length > 0) {
            const latest = newMessages[newMessages.length - 1];
            // Don't notify if chat already open
            if (!activeChat || 
                activeChat.id !== latest.chatId || 
                activeChat.type !== latest.chatType) {

                const sender = users.find(u => u.id === latest.senderId);

                let toastMessage = "";
                if (latest.chatType === "group") {
                    const group = groups.find(g => g.id == latest.chatId);

                    toastMessage = `${group?.name} — ${sender?.username}: ${latest.content.substring(0, 40)}`;
                } else {
                    toastMessage = `${sender?.username}: ${latest.content.substring(0, 40)}`;
                }
                showToast(toastMessage);

            }
        }


        if (activeChat) {
            let updated = false;

            messages.forEach(m => {
                if (
                    m.chatType === activeChat.type &&
                    m.chatId === activeChat.id
                ) {
                    if (!m.readBy) m.readBy = [];

                    if (!m.readBy.includes(currentUser.id)) {
                        m.readBy.push(currentUser.id);
                        updated = true;
                    }
                }
            });

            if (updated) {
                localStorage.setItem("messages", JSON.stringify(messages));
            }

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

    //typing indicator
    if (e.key === "typingStatus") {

        const typingStatus = JSON.parse(e.newValue) || {};
        const typingIndicator = document.getElementById("typingIndicator");

        if (!activeChat) return;

        const chatTyping = typingStatus[activeChat.id];

        if (chatTyping) {
            const otherUserId = Object.keys(chatTyping)
                .find(uid => uid !== currentUser.id);

            if (otherUserId) {
                const otherUser = users.find(u => u.id === otherUserId);
                typingIndicator.textContent = `${otherUser?.username} is typing...`;
                return;
            }
        }

        typingIndicator.textContent = "";
    }

});



settingsBtn.addEventListener("click", function () {
    window.location.href = "./settings.html";
});


//toasting: Notifications
function showToast(message) {
    const container = document.getElementById("toastContainer");

    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}
