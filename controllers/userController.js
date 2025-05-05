const userService = require("../services/userService");
const sessionService = require("../services/sessionService");
const { UserRoles, roleHelper } = require("../helpers/roleHelper");
const userModel = require("../models/userModel");

const userController = {
  register: async (req, res) => {
    try {
      const { FullName, PhoneNumber, Email, Password, UserType } = req.body;

      if (!FullName || !PhoneNumber || !Email || !Password || !UserType) {
        return res.status(400).json({
          message: "Missing required fields",
          error: "All fields are required"
        });
      }

      const existingUser = await userModel.getByPhoneNumber(PhoneNumber);
      if (existingUser) {
        return res.status(400).json({
          message: "Registration failed",
          error: "Phone number already registered"
        });
      }

      const existingEmail = await userModel.getByEmail(Email);
      if (existingEmail) {
        return res.status(400).json({
          message: "Registration failed",
          error: "Email already registered"
        });
      }

      const userId = await userService.create(req.body);

      res.status(201).json({
        message: "User registered successfully",
        userId: userId
      });
    } catch (error) {
      console.error("Error in user registration:", error);
      res.status(500).json({
        message: "Failed to register user",
        error: error.message
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userService.authenticate(email, password);

      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid email or password" });
      }
      const sessionId = await sessionService.create(user.UserID);

      res.cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      return res.status(200).json({
        message: "Login successful",
        user: {
          UserID: user.UserID,
          FullName: user.FullName,
          Email: user.Email,
        },
      });
    } catch (error) {
      console.error("Error during login:", error);
      return res
        .status(500)
        .json({ message: "Login failed", error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const userId = req.params.id;
      const updateData = req.body;
      const currentUserRole = req.session.UserType;

      if (updateData.UserType !== undefined) {
        if (!roleHelper.hasMinimumRole(currentUserRole, UserRoles.MANAGER)) {
          return res.status(403).json({
            message: "You don't have permission to change user roles",
          });
        }

        if (
          updateData.UserType === UserRoles.ADMINISTRATOR &&
          currentUserRole !== UserRoles.ADMINISTRATOR
        ) {
          return res.status(403).json({
            message: "Only Administrators can assign Administrator role",
          });
        }

        if (
          !roleHelper.hasPermissionOver(currentUserRole, updateData.UserType)
        ) {
          return res.status(403).json({
            message: "Cannot assign a role higher than your own",
          });
        }
      }

      const updatedUser = await userService.update(userId, updateData);

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const { Password, ...userResponse } = updatedUser;

      res.status(200).json({
        message: "User updated successfully",
        user: userResponse,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({
        message: "Failed to update user",
        error: error.message,
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const users = await userService.getAll();
      const currentUserRole = req.session.UserType;
      const filteredUsers = users.filter(
        (user) =>
          roleHelper.hasPermissionOver(currentUserRole, user.UserType) ||
          currentUserRole === user.UserType
      );
      const sanitizedUsers = filteredUsers.map((user) => {
        const { Password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      res.status(200).json({
        message: "Users retrieved successfully",
        users: sanitizedUsers,
      });
    } catch (error) {
      console.error("Error retrieving users:", error);
      res.status(500).json({
        message: "Failed to retrieve users",
        error: error.message,
      });
    }
  },

  getById: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await userService.getById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { Password, ...userWithoutPassword } = user;

      res.status(200).json({
        message: "User retrieved successfully",
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error("Error retrieving user:", error);
      res.status(500).json({
        message: "Failed to retrieve user",
        error: error.message,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const userId = req.params.id;
      const deletedUser = await userService.delete(userId);

      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const { Password, ...userResponse } = deletedUser;

      res.status(200).json({
        message: "User deleted successfully",
        user: userResponse,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({
        message: "Failed to delete user",
        error: error.message,
      });
    }
  },
};

module.exports = userController;
