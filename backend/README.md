# ChatFlow Express & Mongoose REST API Backend

A production-ready Node.js, Express, and Mongoose CRUD REST API backend for ChatFlow.

---

## 🚀 Quick Start

1. **Start MongoDB via Docker**:
   ```bash
   docker compose up -d
   ```

2. **Start Backend API Server**:
   ```bash
   cd backend
   npm run dev
   ```

3. **Seed Initial Database Records**:
   ```bash
   npm run seed
   # Or send POST request to http://localhost:5000/api/seed
   ```

---

## 📋 Complete REST API Documentation & Request Payloads

### 1. Health & Database Seeding

#### `GET /api/health`
Check API server status.
- **Request Body**: None

#### `POST /api/seed`
Populate database with initial mock data.
- **Request Body**: None
- **Response**:
  ```json
  {
    "usersCount": 5,
    "conversationsCount": 6,
    "messagesCount": 7,
    "message": "Database seeded successfully with initial ChatFlow data!"
  }
  ```

---

### 2. Authentication API

#### `POST /api/auth/register`
Register a new user account.
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane.doe@chatflow.io",
    "password": "password123",
    "confirmPassword": "password123"
  }
  ```

#### `POST /api/auth/login`
Authenticate user with email and password.
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "email": "alex.morgan@chatflow.io",
    "password": "password123"
  }
  ```

#### `GET /api/auth/contacts`
Fetch all contacts for starting new conversations.
- **Request Body**: None

---

### 3. Users CRUD API

#### `GET /api/users`
Fetch all users.
- **Request Body**: None

#### `GET /api/users/:id`
Fetch user details by ID (e.g., `/api/users/user_0`).
- **Request Body**: None

#### `POST /api/users`
Create a new user record.
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "name": "Robert Taylor",
    "email": "robert.t@chatflow.io",
    "password": "password123",
    "role": "Senior Architect",
    "bio": "Cloud & Infrastructure engineer.",
    "status": "online"
  }
  ```

#### `PUT /api/users/:id`
Update existing user profile (e.g., `/api/users/user_0`).
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "customStatus": "Coding something amazing 🚀",
    "status": "online",
    "bio": "Lead Frontend Engineer & UI Designer."
  }
  ```

#### `DELETE /api/users/:id`
Delete user record by ID (e.g., `/api/users/contact_5`).
- **Request Body**: None

---

### 4. Conversations CRUD API

#### `GET /api/conversations`
Fetch all conversations.
- **Request Body**: None

#### `GET /api/conversations/:id`
Fetch single conversation by ID (e.g., `/api/conversations/conv_1`).
- **Request Body**: None

#### `POST /api/conversations`
Start a new direct or group conversation.
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "name": "Frontend Core Team 🚀",
    "type": "group",
    "description": "Group channel for UI components and design systems.",
    "avatar": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=250"
  }
  ```

#### `PUT /api/conversations/:id`
Update conversation settings (e.g., `/api/conversations/conv_1`).
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "isPinned": true,
    "isMuted": false,
    "unreadCount": 0
  }
  ```

#### `DELETE /api/conversations/:id`
Delete conversation by ID (e.g., `/api/conversations/conv_5`).
- **Request Body**: None

---

### 5. Messages CRUD API

#### `GET /api/messages/:conversationId`
Fetch all messages in a conversation (e.g., `/api/messages/conv_1`).
- **Request Body**: None

#### `POST /api/messages`
Send a new message (text, media, or file attachment).
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "conversationId": "conv_1",
    "senderId": "user_0",
    "senderName": "Alex Morgan",
    "senderAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    "text": "Hey Sarah! Check out this new component preview.",
    "media": {
      "type": "image",
      "url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
      "caption": "Design Preview.png"
    }
  }
  ```

#### `PUT /api/messages/:id`
Update message text, status, or reactions (e.g., `/api/messages/m1_4`).
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "status": "read",
    "reactions": [
      {
        "emoji": "🔥",
        "count": 2,
        "users": ["user_0", "conv_1"]
      }
    ]
  }
  ```

#### `DELETE /api/messages/:id`
Delete message by ID (e.g., `/api/messages/m1_1`).
- **Request Body**: None

---

## 📦 Postman Collection Import

Import [ChatFlow_API.postman_collection.json](file:///home/infirio/Desktop/chatapp/backend/ChatFlow_API.postman_collection.json) directly into Postman to test all these requests interactively.
