### 📕🐭 BookWorm

This project is a small chatbot for interrogating PDF documents with Gemini.

Each user can have multiple and varied conversations, each conversation can have multiple messages, and each conversation can be linked to a document.
From here the various entities for the database are derived:

- Users
- Conversations
- Messages
- Documents

### 📗 Documentation

you can find the API documentation in the `postman.json` file. Also you cand find some files for testing on `testfiles` folder.

### 👁️ Preview

Here the user authenticates, uploads a pdf file, the document is vectorized and saved to the vector store. Then, the user creates a conversation and proceeds to interrogate the document via chat. The LLM enhances its context by making use of the message history.
<br>

<br>
<img
    src="./docs/demo.gif"
/>

<br>

The API allows you to interrogate the document of your choice and also to retrieve the text sources (pages and lines).
<br>

<img
    src="./docs/demo2.gif"
/>

### ⚙️ Technologies

- Langchain
- Express
- TypeORM
- Zod
- Postgres
- PGVector

### 📦 Installation

```
npm install
```

### 🐋 Docker

```
docker compose up
```

### ⚡️ Development

```
npm run dev
```

### 🚀 Build

```
npm run build
```

### 🧪 Test

```
npm run test
```

### 🔐 Generate JWT Secret

```
openssl rand -hex 64
```
