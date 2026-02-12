let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "../index.html";
}

const usernameInput = document.getElementById("username");
const newPasswordInput = document.getElementById("newPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");
const form = document.getElementById("settings-form");
const formMessage = document.getElementById("formMessage");

const cancelBtn = document.getElementById("cancelBtn");
const backBtn = document.getElementById("backBtn");
const logoutBtn = document.querySelector(".logout-btn");


usernameInput.value = currentUser.username;

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

//save
form.addEventListener("submit", function (e) {
    e.preventDefault();

    formMessage.textContent = "";
    formMessage.style.color = "red";

    const newUsername = usernameInput.value.trim();
    const newPassword = newPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    let users = JSON.parse(localStorage.getItem("users")) || [];

    
    if (newUsername !== currentUser.username) {

        if (!newUsername) {
            formMessage.textContent = "Username cannot be empty.";
            return;
        }

        const usernameExists = users.some(user =>
            user.username.toLowerCase() === newUsername.toLowerCase() &&
            user.id !== currentUser.id
        );

        if (usernameExists) {
            formMessage.textContent = "Username already taken.";
            return;
        }
    }

    
    if (newPassword || confirmPassword) {

        if (!newPassword || !confirmPassword) {
            formMessage.textContent = "Please fill in both password fields.";
            return;
        }

        if (newPassword !== confirmPassword) {
            formMessage.textContent = "Passwords do not match.";
            return;
        }
    }

    
    users = users.map(user => {
        if (user.id === currentUser.id) {
            return {
                ...user,
                username: newUsername,
                password: newPassword ? newPassword : user.password
            };
        }
        return user;
    });

    localStorage.setItem("users", JSON.stringify(users));

    
    currentUser.username = newUsername;
    if (newPassword) {
        currentUser.password = newPassword;
    }

    sessionStorage.setItem("currentUser", JSON.stringify(currentUser));

    formMessage.style.color = "green";
    formMessage.textContent = "Profile updated successfully.";

    newPasswordInput.value = "";
    confirmPasswordInput.value = "";
});


cancelBtn.addEventListener("click", function () {
    newPasswordInput.value = "";
    confirmPasswordInput.value = "";
    formMessage.textContent = "";
    usernameInput.value=currentUser.username;
});


backBtn.addEventListener("click", function () {
    window.location.href = "./chat.html";
});


// logout functionality
logoutBtn.addEventListener("click", function () {

    const confirmLogout = confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

    //set offline
    let users = JSON.parse(localStorage.getItem("users")) || [];

    users = users.map(user => {
        if (user.id === currentUser.id) {
            user.online = false;
        }
        return user;
    });

    localStorage.setItem("users", JSON.stringify(users));
    sessionStorage.removeItem("currentUser");
    window.location.href = "../index.html";
});
