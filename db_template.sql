-- this sql file is used to create the database and tables for the project
CREATE DATABASE ktx;
USE ktx;

CREATE TABLE Users (
  UserID INT IDENTITY(1,1) PRIMARY KEY,
  FullName NVARCHAR(50),
  Email VARCHAR(255) UNIQUE NOT NULL, -- Primary login identifier
  Password VARCHAR(255) NOT NULL, -- Hashed password
  PhoneNumber VARCHAR(20) UNIQUE,
  ProfilePicture VARCHAR(MAX),
  UserType INT NOT NULL,
  CONSTRAINT CHK_UserType CHECK (UserType IN (1, 2, 3, 4))
  -- 1: Administrator
  -- 2: Manager
  -- 3: Shift Supervisor
  -- 4: Student
);

CREATE TABLE Sessions (
  SessionID VARCHAR(255) PRIMARY KEY, -- Store UUID as string
  UserID INT NOT NULL,
  CreatedAt DATETIME2 DEFAULT GETDATE(),
  FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE --delete session on user delete
);

CREATE TABLE Students (
  StudentID VARCHAR(20) PRIMARY KEY,
  DateOfBirth DATE,
  Gender NVARCHAR(10),
  StudentType NVARCHAR(20),
  AcademicYear NVARCHAR(20),
  UserID INT NOT NULL,
  FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE Areas (
  AreaID INT IDENTITY(1,1) PRIMARY KEY,
  AreaName NVARCHAR(100) UNIQUE NOT NULL,
  AreaDescription NVARCHAR(MAX)
);

CREATE TABLE Rooms (
  RoomID VARCHAR(20) PRIMARY KEY,
  RoomName NVARCHAR(100),
  MaxCapacity INT,
  AreaID INT NOT NULL,
  FOREIGN KEY (AreaID) REFERENCES Areas(AreaID)
);

CREATE TABLE ResidenceRegistrations (
  RegistrationID INT IDENTITY(1,1) PRIMARY KEY,
  RegistrationDate DATE,
  CheckInDate DATE,
  CheckOutDate DATE,
  RegistrationStatus NVARCHAR(20),
  StudentID VARCHAR(20) NOT NULL,
  RoomID VARCHAR(20) NOT NULL,
  FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
  FOREIGN KEY (RoomID) REFERENCES Rooms(RoomID)
);
 

 
