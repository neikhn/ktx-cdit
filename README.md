## Project Structure
```
/my-app
├── controllers
│   ├── userController.js
│   ├── sessionController.js
├── models  
│   ├── userModel.js
│   ├── sessionModel.js
├── services
│   ├── userService.js
│   ├── sessionService.js
├── helpers
│   ├── sessionCleanup.js
├── routes
│   ├── userRoutes.js
│   ├── sessionRoutes.js
├── middleware
│   ├── authMiddleware.js
├── server.js
├── .env
├── dbConfig.js
```

## Description
This project is a Node.js application that follows the MVC (Model-View-Controller) architecture. It includes structured separation for handling sessions through controllers, models, services, and routes.

## Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```sh
   cd my-app
   ```
3. Install dependencies:
   ```sh
   npm install
   ```

## Usage

1. Start the server:
   ```sh
   node server.js
   ```
   or with Nodemon (if installed):
   ```sh
   npm run dev
   ```
2. The server will be running on `http://localhost:3000`.

## Folder Structure
- **models/**: Defines the data structure and interacts with the database.
- **services/**: Implements business logic for handling operations.
- **middleware/**: Contains middleware functions for authentication and authorization.
- **helpers/**: Contains helper functions for the application.
- **controllers/**: Contains controllers that handle requests and responses.
- **routes/**: Defines API endpoints and maps them to controllers.
- **server.js**: The main entry point for the application.

## API Endpoints

User Management
| Method | Endpoint | Description | Auth Required | Request Body | Response |
|--------|----------|-------------|---------------|--------------|-----------|
| POST | /users/register | Register a new user | No | ```json { "FullName": "string", "Username": "string", "PhoneNumber": "string", "Email": "string", "QRCode": "string", "Password": "string", "UserType": "number" }``` | ```json { "message": "User registered successfully", "user": { "UserID": "number", "FullName": "string", "Username": "string", "PhoneNumber": "string", "Email": "string", "QRCode": "string", "UserType": "number" }}``` |
| POST | /users/login | Login user | No | ```json { "username": "string", "password": "string" }``` | ```json { "message": "Login successful", "user": { "UserID": "number", "FullName": "string", "Username": "string" }}``` |


Session Management
| Method | Endpoint | Description | Auth Required | Response |
|--------|----------|-------------|---------------|-----------|
| GET | /sessions/info | Get current session info | Yes | json{ "message": "Session found", "session": { "SessionID": "string", "UserID": "number", "CreatedAt": "date" }} |
| DELETE | /sessions/logout | Logout (invalidate session) | Yes | json{ "message": "Logout successful"} |


## Technologies Used
- Node.js
- Express.js
- Microsoft SQL Server (Specify your database)
- Other dependencies (e.g., dotenv, nodemon)

## License
This project is licensed under the MIT License.


