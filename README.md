# Chatwave

## What is Chatwave?

Chatwave is a lightweight, web-based real-time chat application designed to enable seamless communication between multiple users. The application allows users to authenticate, view online participants, and exchange messages through both group and private chats, all within a clean and intuitive interface.

Chatwave is built using plain JavaScript, HTML, and CSS, focusing on simplicity, usability, and maintainability while adhering to modern software engineering best practices.

---

## Why Choose Chatwave?

**Real-Time Communication**  
Chatwave enables instant message exchange, allowing users to communicate efficiently without page refreshes.

**Simplicity & Performance**  
Built using vanilla JavaScript, HTML, and CSS, the application avoids unnecessary complexity while maintaining responsiveness and cross-browser compatibility.

**User-Centered Design**  
A clean and intuitive interface ensures a smooth user experience, making it easy to navigate chats and manage user interactions.

**Persistent Data Storage**  
Chat messages and user data are stored locally to ensure conversation history is retained after page refresh.

---

# Documentation

## Software Requirements Specification (SRS)

### Overview

Chatwave is a simple real-time chat application that allows authenticated users to communicate through group and private messaging. The system is designed to simulate real-time interaction using client-side technologies and local storage mechanisms, making it suitable for lightweight deployments and academic evaluation.

---

### Components and Functional Requirements

### 1. Authentication and Authorization Management
- Users can sign up with a unique username and password.
- Users can log in using valid credentials.
- Users can log out of the application.
- Non-existing users are validated and denied access.

---

### 2. User Management
- Users have a unique profile identified by their username.
- Usernames must be unique across the system.
- Users can view their profile information.
- User session state is managed on login and logout.

---

### 3. Real-Time Chat Subsystem

#### Group Chat
- Users can send and receive messages in a shared chat room.
- Messages are displayed instantly to all active users.

#### Private Chat
- Users can send and receive private messages to specific users.
- Private messages are visible only to the sender and recipient.

---

### 4. Online Users Management
- The application displays a list of users currently online.
- Online status is updated dynamically on login and logout.

---

### 5. Data Persistence Subsystem
- Chat messages are persisted using `localStorage`.
- Messages remain available after page refresh.
- User data is stored in JSON format for structured retrieval.

---

### 6. User Experience Enhancements
- Each chat message displays a timestamp.
- The interface is responsive and cross-browser compatible.
- Semantic HTML and well-organized CSS are used throughout the application.

---

## Running the Application

### Local Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/RRusso15/chatwave.git
   ```

2. Navigate into the project directory:
   ```bash
   cd chatwave
   ```

3. Open `index.html` in a web browser  
   *(No additional dependencies or frameworks required)*

---

### Deployment (GitHub Pages)
1. Push the project to the `main` branch.
2. Enable GitHub Pages in repository settings.
3. Select the root directory as the source.
4. Access the application using the provided GitHub Pages URL.

---

## Development Guidelines
- Plain JavaScript, HTML, and CSS only (no frameworks or libraries).
- Clean coding principles are followed to ensure readability and maintainability.
- Semantic HTML is used for accessibility.
- CSS is modular and well-organized.
- Regular commits with meaningful messages.
- Feature-based branching strategy is used.

---

## Project Management
- GitHub Issues are used to track features, planning tasks, and bugs.
- A GitHub Project board is used to monitor progress.
- Milestones define major development phases.
- Pull requests require facilitator review before merging into `main`.

---

## Bonus Features (Optional)
- User typing indicators.
- Username change functionality.
- Message formatting options (bold, italic).
- Data encryption for stored JSON data.

---

## License
This project is developed for academic purposes as part of a graduate program assignment.
