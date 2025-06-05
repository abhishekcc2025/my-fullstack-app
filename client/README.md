
# Simple CRM Application (Frontend)

This is the frontend for a Simple CRM application. It is designed to manage contacts and reminders.

**Important:** This version of the application has been updated to fetch and store data via a backend API, instead of using browser localStorage. You will need to set up a backend server that connects to a MySQL database to use this application fully.

## Backend Setup (Required)

This frontend application expects a backend server to be running and accessible. You need to implement this backend server yourself. Here's what the frontend expects:

### 1. API Endpoints

Your backend server should expose the following RESTful API endpoints. The base URL used in the frontend service is `/api`. If your backend is hosted elsewhere or uses a different base path, you'll need to update `API_BASE_URL` in `src/services/crmService.ts`.

*   **`GET /api/entries`**
    *   **Description:** Fetches all CRM entries.
    *   **Success Response:** `200 OK` with a JSON array of CRM entries. Each entry should match the `CRMEntry` interface defined in `src/types.ts`.
        ```json
        [
          {
            "id": "string", // (e.g., UUID)
            "name": "string",
            "email": "string" (optional),
            "phone": "string" (optional),
            "company": "string" (optional),
            "description": "string",
            "reminderDate": "string" // (YYYY-MM-DD format),
            "createdAt": "string" // (ISO string)
          }
        ]
        ```
*   **`POST /api/entries`**
    *   **Description:** Adds a new CRM entry.
    *   **Request Body:** JSON object matching `CRMEntryFormData` from `src/types.ts`.
        ```json
        {
          "name": "string",
          "email": "string" (optional),
          "phone": "string" (optional),
          "company": "string" (optional),
          "description": "string",
          "reminderDate": "string" // (YYYY-MM-DD format)
        }
        ```
    *   **Success Response:** `201 Created` (or `200 OK`) with the newly created CRM entry (including its `id` and `createdAt` assigned by the backend).
*   **`PUT /api/entries/:id`**
    *   **Description:** Updates an existing CRM entry by its `id`.
    *   **Request Body:** JSON object with fields to update, matching `CRMEntryFormData`.
        ```json
        {
          "name": "string",
          "email": "string" (optional),
          // ... other fields
        }
        ```
    *   **Success Response:** `200 OK` with the updated CRM entry.
*   **`DELETE /api/entries/:id`**
    *   **Description:** Deletes a CRM entry by its `id`.
    *   **Success Response:** `200 OK` or `204 No Content`.

### 2. Database Connection (MySQL)

Your backend server will be responsible for connecting to your MySQL database.

**Database Credentials:**
*   **Configuration:** Database connection details (host, port, username, password, database name) should be configured **securely within your backend server's environment**.
*   **DO NOT** hardcode credentials in the frontend or backend source code.
*   **Recommendation:** Use environment variables (e.g., `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`) in your backend server to store these credentials. Most backend frameworks and hosting platforms support `.env` files or other mechanisms for managing environment variables.

**Example (conceptual for a Node.js backend using a `.env` file):**
Your backend server's `.env` file (this file should be in your backend project and added to `.gitignore`):
```
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_crm_database
DB_PORT=3306
```
Your backend code would then use a library (like `dotenv` for Node.js) to load these variables and a MySQL connector (like `mysql2` or an ORM like Sequelize/Prisma) to establish the database connection.

## Frontend Development

To run the frontend application locally for development:

1.  **Prerequisites:**
    *   Node.js and npm (or yarn) installed.
    *   A running backend server implementing the API specified above.

2.  **Installation:**
    ```bash
    npm install
    ```
    (Or `yarn install`)

3.  **Running the Development Server:**
    The `index.html` can be served by any simple HTTP server. For example, using `live-server` (you might need to install it globally: `npm install -g live-server`):
    ```bash
    live-server .
    ```
    This will typically open the application in your default web browser.

    Alternatively, if you are using a bundler like Vite or Parcel (not currently configured in this project), you would use its specific commands.

4.  **Building for Production:**
    This project currently does not have a build step configured. For production, you would typically use a bundler (like Vite, Webpack, or Parcel) to optimize and bundle the JavaScript/TypeScript and CSS assets.

## Modifying API Base URL

If your backend API is not running on the same host/port or if the base path is different from `/api`, you need to update it in the frontend:
1.  Open `src/services/crmService.ts`.
2.  Modify the `API_BASE_URL` constant:
    ```typescript
    const API_BASE_URL = 'http://your-backend-host:port/your-api-base-path'; 
    ```

This frontend is now prepared to communicate with your backend service.
