const userService = require("../services/userService");
const sessionService = require("../services/sessionService");
const { UserRoles, roleHelper } = require("../helpers/roleHelper");

const userController = {
  register: async (req, res) => {
    try {
      const userData = req.body; // take data from body
      const existingUser = await userService.getByUsername(userData.Username);
      if (existingUser) {
        return res.status(409).json({ message: "User already existed" });
      }
      const newUser = await userService.create(userData);
      return res
        .status(201)
        .json({ message: "User registered successfully", user: newUser });
    } catch (error) {
      console.error("Error during user registration:", error);
      return res
        .status(500)
        .json({ message: "Failed to register user", error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await userService.authenticate(username, password);

      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
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
          Username: user.Username,
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

      // If trying to change UserType
      if (updateData.UserType !== undefined) {
        // Only Administrator and Manager can change roles
        if (!roleHelper.hasMinimumRole(currentUserRole, UserRoles.MANAGER)) {
          return res.status(403).json({
            message: "You don't have permission to change user roles",
          });
        }

        // Administrator role can only be assigned by other Administrators
        if (
          updateData.UserType === UserRoles.ADMINISTRATOR &&
          currentUserRole !== UserRoles.ADMINISTRATOR
        ) {
          return res.status(403).json({
            message: "Only Administrators can assign Administrator role",
          });
        }

        // Cannot assign a role higher than your own
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
      // User with lower hierachy can't get higher hierachy user
      const filteredUsers = users.filter(
        (user) =>
          roleHelper.hasPermissionOver(currentUserRole, user.UserType) ||
          currentUserRole === user.UserType
      );
      // Remove sensitive information (passwords) before sending
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

      // Remove sensitive information before sending
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
