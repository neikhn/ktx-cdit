-- this sql file is used to create the database and tables for the project
create database ktx;
use ktx;

-- create tables
CREATE TABLE Users (
  UserID INT IDENTITY(1,1) PRIMARY KEY,
  FullName NVARCHAR(50),
  Username VARCHAR(50) UNIQUE NOT NULL,
  PhoneNumber VARCHAR(20) UNIQUE,
  Email VARCHAR(255) UNIQUE,
  QRCode VARCHAR(255) UNIQUE,
  Password VARCHAR(255) NOT NULL, -- Hashed password
  UserType INT NOT NULL
);

CREATE TABLE Sessions (
  SessionID VARCHAR(255) PRIMARY KEY, -- Store UUID as string
  UserID INT NOT NULL, 
  CreatedAt DATETIME2 DEFAULT GETDATE(),
  
  FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE --delete session on user delete
);

