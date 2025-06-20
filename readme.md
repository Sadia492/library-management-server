# 📚 Library Management Server

A robust and scalable RESTful API for managing a library system, built using **Express.js**, **TypeScript**, and **MongoDB** with **Mongoose**. This system allows users to perform full CRUD operations on books, manage borrowing activities, enforce business rules like availability control, and retrieve insightful borrowing statistics.

---

## 🚀 Features

- **Book Management**

  - Create, Read, Update, and Delete books
  - Validate required fields and enforce data integrity (e.g., non-negative copies, unique ISBNs)
  - Filter books by genre and sort by creation date
  - Mongoose middleware for logging and validation

- **Borrowing System**

  - Borrow books with quantity and due date
  - Automatically update book availability
  - Prevent borrowing if insufficient copies are available
  - Business logic encapsulated via static/instance methods

- **Advanced Data Aggregation**

  - View total borrowed quantity per book
  - Includes book title and ISBN
  - Uses MongoDB aggregation pipeline

- **Error Handling**

  - Standardized error response structure
  - Detailed Mongoose validation errors included

- **Clean Architecture**
  - Modular folder structure
  - Uses TypeScript for type safety
  - Mongoose schema modeling with hooks and methods

---

## 📦 Tech Stack

- **Backend:** Node.js, Express.js
- **Language:** TypeScript
- **Database:** MongoDB
- **ODM:** Mongoose
- **Environment Management:** dotenv
- **Linting & Formatting:** ESLint, Prettier

---

## 🛠️ Getting Started

### 📥 Installation

1. **Clone the repository**

```bash
git clone https://github.com/Sadia492/library-management-server.git
cd library-management-server
```

2. **Install dependencies**

```bash
npm install
```

3. **Create `.env` file**

Create a `.env` file in the root directory and add your MongoDB URI:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/libraryDB
```

4. **Start the development server**

```bash
npm run dev
```

To build and run in production mode:

```bash
npm run build
npm start
```

---

## 🔗 API Endpoints

### 📘 Books

| Method | Endpoint             | Description                 |
| ------ | -------------------- | --------------------------- |
| POST   | `/api/books`         | Create a new book           |
| GET    | `/api/books`         | Get all books (with filter) |
| GET    | `/api/books/:bookId` | Get book by ID              |
| PUT    | `/api/books/:bookId` | Update book info            |
| DELETE | `/api/books/:bookId` | Delete a book               |

> Supports query parameters: `filter`, `sortBy`, `sort`, `limit`

### 📖 Borrowing

| Method | Endpoint      | Description                      |
| ------ | ------------- | -------------------------------- |
| POST   | `/api/borrow` | Borrow a book                    |
| GET    | `/api/borrow` | Borrow summary using aggregation |

---

## 📊 Example Usage

### ✅ Create a Book

```http
POST /api/books
```

```json
{
  "title": "The Theory of Everything",
  "author": "Stephen Hawking",
  "genre": "SCIENCE",
  "isbn": "9780553380163",
  "description": "An overview of cosmology and black holes.",
  "copies": 5
}
```

### 🛒 Borrow a Book

```http
POST /api/borrow
```

```json
{
  "book": "64ab3f9e2a4b5c6d7e8f9012",
  "quantity": 2,
  "dueDate": "2025-07-18T00:00:00.000Z"
}
```

### 📈 Borrow Summary

```http
GET /api/borrow
```

```json
[
  {
    "book": {
      "title": "The Theory of Everything",
      "isbn": "9780553380163"
    },
    "totalQuantity": 5
  }
]
```

---
