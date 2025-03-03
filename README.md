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

## User Roles and Permissions

The system implements a hierarchical role-based access control with the following user types:

| Role ID | Role Name | Description | Permissions |
|---------|-----------|-------------|-------------|
| 1 | Administrator | Highest level system administrator | - Full system access<br>- Can manage all users including other administrators<br>- Can assign any role |
| 2 | Manager | Facility manager | - Can manage all users except administrators<br>- Access to management features<br>- Cannot assign administrator role |
| 3 | Shift Supervisor (Trực ca) | Day-to-day operations supervisor | - Can manage students<br>- Access to operational features<br>- Cannot modify higher-level roles |
| 4 | Student | Regular student user | - Can view and modify own profile<br>- Limited access to basic features |

### Role Hierarchy

The system implements a strict hierarchy where:
- Higher-level roles can manage users of the same level or below
- Users can always modify their own profile regardless of role
- Only administrators can create other administrators
- Role assignments can only be done by users with higher-level roles

## API Endpoints (Updated)

### User Management
| Method | Endpoint | Description | Auth Required | Required Role | Request Body | Response Codes |
|--------|----------|-------------|---------------|---------------|--------------|----------------|
| POST | /users/register | Register a new user | No | None | ```json { "FullName": "string", "Username": "string", "PhoneNumber": "string", "Email": "string", "QRCode": "string", "Password": "string", "UserType": "number" }``` | 201: Created<br>500: Server Error (duplicate/invalid data) |
| POST | /users/login | User login | No | None | ```json { "Username": "string", "Password": "string" }``` | 200: Success<br>401: Unauthorized |
| GET | /users | List all users | Yes | Manager+ | None | 200: Success<br>401: Unauthorized<br>403: Forbidden |
| GET | /users/:id | Get user details | Yes | Any* | None | 200: Success<br>401: Unauthorized<br>403: Forbidden<br>404: Not Found |
| PUT | /users/:id | Update user | Yes | Any* | ```json { "FullName": "string", ... }``` | 200: Success<br>401: Unauthorized<br>403: Forbidden<br>404: Not Found<br>500: Server Error |
| DELETE | /users/:id | Delete user | Yes | Admin | None | 200: Success<br>401: Unauthorized<br>403: Forbidden<br>404: Not Found |

*Users can always access/modify their own profile, higher roles required for other users

### Session Management
| Method | Endpoint | Description | Auth Required | Response Codes |
|--------|----------|-------------|---------------|----------------|
| GET | /sessions/check | Verify session status | Yes | 200: Valid session<br>401: Invalid/No session |
| POST | /users/logout | Logout (invalidate session) | Yes | 200: Success<br>401: Unauthorized |

## Role-Based Access Control

### Endpoint Permissions Matrix
| Endpoint | Administrator | Manager | Shift Supervisor | Student |
|----------|--------------|---------|------------------|---------|
| GET /users | ✅ Full access | ✅ Full access | ❌ | ❌ |
| GET /users/:id | ✅ All users | ✅ Lower roles | ✅ Students only | ✅ Self only |
| POST /users | ✅ All roles | ✅ Lower roles | ❌ | ❌ |
| PUT /users/:id | ✅ All users | ✅ Lower roles | ✅ Students only | ✅ Self only |
| DELETE /users/:id | ✅ All users | ❌ | ❌ | ❌ |

### Role Hierarchy Rules
1. **Administrator (Level 1)**
   - Can perform all operations
   - Only role that can create/modify other administrators
   - Full system access

2. **Manager (Level 2)**
   - Can manage all users except administrators
   - Can view and modify all non-administrator users
   - Cannot delete users

3. **Shift Supervisor (Level 3)**
   - Can manage student accounts
   - Limited to student-related operations
   - Cannot modify higher-level roles

4. **Student (Level 4)**
   - Can view and modify own profile only
   - No access to other users' data
   - Most restricted access level

### Permission Inheritance
- Each role automatically inherits permissions from roles below it
- Users can always access and modify their own profile regardless of role
- Role assignments can only be done by users with higher-level roles
- Attempts to perform unauthorized operations will receive a 403 Forbidden response

### User Management Tests
- User Registration (success, duplicate username, invalid role)
- User Authentication (login success, invalid credentials)
- User Operations (get, update, delete) with various permission levels
- Role-based access control validation

### Session Management Tests
- Session validation
- Session expiration handling
- Logout functionality

Each test case includes:
- HTTP Method and endpoint
- Request payload (if applicable)
- Expected response codes
- Authentication requirements

To run the tests:
1. Ensure the server is running
2. Use the test cases documented in `testcases.txt` as a reference
3. Test each endpoint using your preferred API testing tool (e.g., Postman, cURL)

## Technologies Used
- Node.js
- Express.js
- MSSQL
- Other dependencies (e.g., dotenv, nodemon)

## License
This project is licensed under the MIT License.


