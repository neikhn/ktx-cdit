## Project Structure
```
/ktx-cdit
├── controllers/
│   ├── userController.js
│   ├── sessionController.js
│   ├── studentController.js
│   ├── areaController.js
│   ├── roomController.js
│   └── residenceRegistrationController.js
├── models/
│   ├── userModel.js
│   ├── sessionModel.js
│   ├── studentModel.js
│   ├── areaModel.js
│   ├── roomModel.js
│   └── residenceRegistrationModel.js
├── services/
│   ├── userService.js
│   ├── sessionService.js
│   ├── studentService.js
│   ├── areaService.js
│   ├── roomService.js
│   └── residenceRegistrationService.js
├── helpers/
│   ├── sessionCleanup.js
├── routes/
│   ├── userRoutes.js
│   ├── sessionRoutes.js
│   ├── studentRoutes.js
│   ├── areaRoutes.js
│   ├── roomRoutes.js
│   └── residenceRegistrationRoutes.js
├── middlewares/
│   ├── authMiddleware.js
├── tests/
├── tmp/
├── server.js
├── dbConfig.js
├── db_template.sql
├── remove_qrcode.sql
├── test_cases.xlsx
├── package.json
└── package-lock.json
```

## Description
This project is a Node.js application that follows the MVC (Model-View-Controller) architecture. It's a dormitory management system (KTX) that handles user authentication, student management, area and room management, and residence registration. The system includes structured separation for handling various operations through controllers, models, services, and routes.

## Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```sh
   cd ktx-cdit
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Set up the database:
   - Use the `db_template.sql` file to create the database schema
   - Configure your database connection in `dbConfig.js`

## Usage

1. Start the server:
   ```sh
   npm start
   ```
   or
   ```sh
   node server.js
   ```
2. The server will be running on `http://localhost:3000`.

## Features

### User Management
- User registration and authentication
- Role-based access control
- Session management

### Student Management
- Student profile management
- Student records tracking

### Area and Room Management
- Area management
- Room allocation and tracking
- Room status monitoring

### Residence Registration
- Student residence registration
- Room assignment
- Registration status tracking

## API Endpoints

### User Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/users/register | Register a new user | No |
| POST | /api/users/login | User login | No |
| GET | /api/users | List all users | Yes |
| GET | /api/users/:id | Get user details | Yes |
| PUT | /api/users/:id | Update user | Yes |
| DELETE | /api/users/:id | Delete user | Yes |

### Student Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/students | List all students | Yes |
| GET | /api/students/:id | Get student details | Yes |
| POST | /api/students | Create new student | Yes |
| PUT | /api/students/:id | Update student | Yes |
| DELETE | /api/students/:id | Delete student | Yes |

### Area Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/areas | List all areas | Yes |
| GET | /api/areas/:id | Get area details | Yes |
| POST | /api/areas | Create new area | Yes |
| PUT | /api/areas/:id | Update area | Yes |
| DELETE | /api/areas/:id | Delete area | Yes |

### Room Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/rooms | List all rooms | Yes |
| GET | /api/rooms/:id | Get room details | Yes |
| POST | /api/rooms | Create new room | Yes |
| PUT | /api/rooms/:id | Update room | Yes |
| DELETE | /api/rooms/:id | Delete room | Yes |

### Residence Registration
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/residence-registrations | List all registrations | Yes |
| GET | /api/residence-registrations/:id | Get registration details | Yes |
| POST | /api/residence-registrations | Create new registration | Yes |
| PUT | /api/residence-registrations/:id | Update registration | Yes |
| DELETE | /api/residence-registrations/:id | Delete registration | Yes |

## Technologies Used
- Node.js
- Express.js
- MSSQL
- bcrypt (for password hashing)
- cookie-parser (for session management)
- dotenv (for environment variables)
- uuidv4 (for unique identifiers)

## Testing
The project includes test cases documented in (tested with postman):
- `test_cases.xlsx`

## Database
- Database schema is defined in `db_template.sql`
- Database configuration is in `dbConfig.js`

