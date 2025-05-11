# VerCity - A Blogging Platform

VerCity is a blogging platform where users can log in, create posts, and comment on blogs. The frontend is built using React and uses **Firebase Authentication** for login. The backend uses **Firebase Admin SDK** to manage and store blog data in a Firebase Realtime Database.

## Installation

### 1. Clone the repository:

```bash
git clone https://github.com/KunalSharma108/Vercity.git
```

### 2. Navigate to the project directory:

```bash
cd Vercity
```

### 3. Install dependencies:

- For the frontend:

```bash
cd Frontend
npm install
```

- For the backend:

```bash
cd Backend
npm install
```

### 4. Setup environment variables:

- In the frontend, create a `.env` file and add:

```env
VITE_BACKEND_API=http://your-backend-url
```

- Then create a JS file (e.g., `config.js`) in the frontend and add:

```js
const backendAPI = import.meta.env.VITE_BACKEND_API;

export default backendAPI;
```

### 5. Start development servers:

- Frontend:

```bash
npm run dev
```

- Backend (runs with `nodemon`):

```bash
npm run dev
```

## Features of this website

- Create and publish blog posts  
- Comment on blog posts  
- Firebase Authentication (Frontend only)  
- Firebase Admin SDK (Backend for data storage)

---
