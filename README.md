# 🚀 reactrack

`reactrack` is a full-stack web application built using the **MERN** (MongoDB, Express, React, Node.js) stack, designed to be a starting point for **robust, scalable systems**. This project emphasizes a structured API layer, secure user authentication, and comprehensive documentation.

<hr>

## ✨ Recursos

* **API-First Approach:** Built with **Express.js** to handle RESTful API requests.
* **Robust State Management:** Utilizes **React.js** for a dynamic and responsive frontend (Note: Frontend setup details are assumed to be in a separate directory or part of a deployment process, but the backend is ready).
* **Secure Authentication:** Implements token-based authentication with **JSON Web Tokens (JWT)** and secure password hashing with **bcryptjs**.
* **Database:** Uses **MongoDB** (via Mongoose) for flexible data storage.
* **Email Services:** Integrated with **Nodemailer** for transactional emails (e.g., password reset), configured for services like Brevo (Sendinblue).
* **Documentation:** Includes a dedicated API documentation route (similar to **Swagger**) to make the backend endpoints easily discoverable.
* **Environment Configuration:** Secure handling of sensitive data using **`.env`** files.

## 🛠️ Tecnologias

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **React.js** | Dynamic and component-based user interfaces. |
| **Backend** | **Express.js** | Minimalist, fast, unopinionated Node.js web framework. |
| **Database** | **MongoDB** | NoSQL database for flexible data modeling. |
| **Runtime** | **Node.js** | JavaScript runtime environment for server-side code. |
| **Language** | **TypeScript** | Enhances code quality and maintainability. |

<hr>

## 🏁 Começando...

### Pré-Requisitos

* Node.js (v18+)
* MongoDB Instance (Local or Cloud-hosted)

### Instalação

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/gui-silva-github/reactrack.git
    cd reactrack
    ```

2.  **Install dependencies:**
    ```bash
    cd server
    npm install
    cd ../
    cd client
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a file named **`.env`** in the root directory and populate it with your configuration (use `.env.local` for local, user-specific settings).

    **`.env` Configuration:**
    ```env
    MONGODB_URL=<Your_MongoDB_Connection_String>
    JWT_SECRET=<Your_Strong_Secret_Key_for_JWT>
    NODE_ENV=development # or production
    SMTP_USER=<Your_Email_Service_Username> # e.g., Brevo/Sendinblue SMTP user
    SMTP_PASS=<Your_Email_Service_Password>
    SENDER_EMAIL=<The_Email_Address_Used_for_Sending>
    ```

### Rodando a aplicação

This project uses **TypeScript** and is compiled to the `dist` directory. The `package.json` setup uses `nodemon` for development.

1.  **Start the server:**
    ```bash
    cd server
    npm run server
    ```
    This command executes the script `"server": "nodemon dist/server.js"`, which watches for changes in the compiled JavaScript files and restarts the server.

2.  **Access the API Documentation:**
    The API documentation, similar to a Swagger interface, is available via the home route defined in `routes/home.ts`: `http://localhost:4000`.

---

## 💻 Detalhes da API do Backend

The backend is centered around the **Express.js** server defined in `server.ts`, which handles routing, middleware, and database connection (`config/mongodb.ts`).

### Core Routes

| Route File | Purpose | Key Endpoints |
| :--- | :--- | :--- |
| `routes/auth.ts` | **Authentication** | `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/forgot-password` |
| `routes/user.ts` | **User Data** | `/api/user/data` (Protected by `middleware/userAuth.ts`) |
| `routes/home.ts` | **Documentation** | `/` (Serves the API documentation page) |
| `routes/error.ts` | **Error Handling** | `*` (Handles 404 Not Found errors) |

### Configuração TypeScript 

The `tsconfig.json` specifies modern standards for the backend:

```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "esnext",
    "rootDir": "./",
    "moduleResolution": "node",
    "outDir": "./dist"
  }
}
```

<hr>

## Server Backend

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/npm-run-server.png" />

<hr>

## Swagger Backend

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/home-server.png" />

<hr>

## Client Frontend

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/npm-run-dev.png" />

<hr>

## UI/UX Frontend

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/home-client.png" />

<hr>

## Fit System

### Home

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/fit/home.png" />
<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/fit/home2.png" />

### Search

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/fit/search.png" />

### Horizontal Scroll

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/fit/horizontal.png" />

### Muscle Wiki

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/fit/muscleWiki.png" />

### Exercises

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/fit/exercises.png" />

### Exercise

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/fit/exercise.png" />

### Same Muscles

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/fit/sameMuscles.png" />

### Same Equipment

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/fit/sameEquipment.png" />

<hr>

## Crypto System

### Home

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/crypto/home.png" />

### 10 Coins

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/crypto/top10.png" />

### Coin Details

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/crypto/coinDetails.png" />

<hr>

## Opinly System

### Home

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/opinly/home.png" />

### Server JSON

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/opinly/server.png" />

### Coin Details

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/opinly/opinions.png" />





