# Postman API Testing Guide for ChatFlow

This repository includes a pre-configured **Postman Collection (v2.1 JSON)** located at:
📁 [backend/ChatFlow_API.postman_collection.json](file:///home/infirio/Desktop/chatapp/backend/ChatFlow_API.postman_collection.json)

---

## How to Import into Postman

1. Open **Postman**.
2. Click **Import** (top left corner).
3. Drag & drop or select the file: `backend/ChatFlow_API.postman_collection.json`.
4. Click **Import**.
5. Set `baseUrl` collection variable to `http://localhost:5000/api` if needed.

---

## Endpoints & JSON Body Payloads

### 1. Health & Seeding

#### `GET /api/health`
Check API server status. No body.

#### `POST /api/seed`
Seed MongoDB with initial mock data. No body.

---

### 2. Authentication

#### `POST /api/auth/register`
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@chatflow.io",
  "password": "password123",
  "confirmPassword": "password123"
}
```

#### `POST /api/auth/login`
```json
{
  "email": "alex.morgan@chatflow.io",
  "password": "password123"
}
```

#### `GET /api/auth/contacts`
No body.

---

### 3. Users CRUD

#### `GET /api/users`
No body.

#### `GET /api/users/:id`
No body (e.g. `/api/users/user_0`).

#### `POST /api/users`
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
```json
{
  "customStatus": "Focusing on Node.js REST API specs ⚡",
  "status": "online",
  "bio": "Updated bio..."
}
```

#### `DELETE /api/users/:id`
No body (e.g. `/api/users/contact_5`).

---

### 4. Conversations CRUD

#### `GET /api/conversations`
No body.

#### `GET /api/conversations/:id`
No body (e.g. `/api/conversations/conv_1`).

#### `POST /api/conversations`
```json
{
  "name": "Frontend Core Team 🚀",
  "type": "group",
  "description": "Group channel for UI components and design systems.",
  "avatar": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=250"
}
```

#### `PUT /api/conversations/:id`
```json
{
  "isPinned": true,
  "unreadCount": 0
}
```

#### `DELETE /api/conversations/:id`
No body (e.g. `/api/conversations/conv_5`).

---

### 5. Messages CRUD

#### `GET /api/messages/:conversationId`
No body (e.g. `/api/messages/conv_1`).

#### `POST /api/messages`
```json
{
  "conversationId": "conv_1",
  "senderId": "user_0",
  "senderName": "Alex Morgan",
  "text": "Hey Sarah! Postman API testing works like a charm 🔥"
}
```

#### `PUT /api/messages/:id`
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
No body (e.g. `/api/messages/m1_1`).

---

## Testing via cURL Commands

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Seed Database
```bash
curl -X POST http://localhost:5000/api/seed
```

### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex.morgan@chatflow.io", "password":"password123"}'
```

### 4. Send Message
```bash
curl -X POST http://localhost:5000/api/messages \
  -H "Content-Type: application/json" \
  -d '{"conversationId":"conv_1", "senderId":"user_0", "senderName":"Alex Morgan", "text":"Testing API via cURL 🚀"}'
```
