<img width="628" height="258" alt="image" src="https://github.com/user-attachments/assets/a0ea4da0-aeb6-4826-a0aa-7c0428d643d0" /># 🚀 reactrack

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

3.  **Start the client:**
    ```bash
    cd client
    npm run dev
    ```

4.  **Run 'all' projects that uses JSON:**
    ```bash
    cd server
    npm run all
    ```
    
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

## JSON Systems

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/json-systems.png" />

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

### Server JSON

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/opinly/server.png" />

### Home

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/opinly/home.png" />

### Opinions

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/opinly/opinions.png" />

<hr>

## Convene System

### Home

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/convene/home.png" />

### Upcoming Events

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/convene/events.png" />

### Find Events

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/convene/find.png" />

### New Event

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/convene/new.png" />

### Event Details

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/convene/details.png" />

### Edit Event

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/convene/edit.png" />

### Delete Event

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/convene/delete.png" />

<hr>

## Talkive System

## SignUp

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/talkive/signup.png"/>

## Login

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/talkive/login.png"/>

## Profile Update

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/talkive/profile.png"/>

## Profile Completed

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/talkive/profileU.png" />

## Chat

<img src="https://github.com/gui-silva-github/talknet/blob/main/public/chat.png"/>

## Search

<img src="https://github.com/gui-silva-github/talknet/blob/main/public/search.png"/>

## Friends

<img src="https://github.com/gui-silva-github/talknet/blob/main/public/friends.png"/>

## ChatBox

<img src="https://github.com/gui-silva-github/talknet/blob/main/public/chatdata.png"/>

## Message

<img src="https://github.com/gui-silva-github/talknet/blob/main/public/messages.png"/>

## Receiving Message

<img src="https://github.com/gui-silva-github/talknet/blob/main/public/messagesr.png"/>

## Online

<img src="https://github.com/gui-silva-github/talknet/blob/main/public/messagesrs.png"/>

## Message Not Seen

<img src="https://github.com/gui-silva-github/talknet/blob/main/public/receivemessages.png"/>

<hr>

## Movies System

### Home

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/movies/home.png" />

### Search

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/movies/search.png" />

### Movie Details

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/movies/details.png" />

<br>

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/movies/details2.png" />

<hr>

## Investments System

### Home

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/investments/home.png" />

### Table Investments

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/investments/table.png" />

<hr>

## Projects System

### Home

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/projects/home.png" />

### Search

<img src="https://github.com/gui-silva-github/reactrack/blob/main/ui-ux/systems/projects/search.png" />


