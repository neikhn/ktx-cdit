const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { UserRoles } = require("../helpers/roleHelper");
const saltRounds = 10;

const validateRole = (roleId) => {
  return Object.values(UserRoles).includes(roleId);
};

const userService = {
  authenticate: async (username, password) => {
    const user = await userModel.getByUsername(username);
    if (!user) {
      return null; // User not found
    }

    const passwordMatch = await bcrypt.compare(password, user.Password);
    if (passwordMatch) {
      return user; // Successful
    } else {
      return null; // Incorrect
    }
  },

  create: async (userData) => {
    if (!validateRole(userData.UserType)) {
      throw new Error("Invalid user role specified");
    }
    const hashedPassword = await bcrypt.hash(userData.Password, saltRounds);
    const userWithHashedPassword = {
      ...userData,
      Password: hashedPassword,
    };
    return await userModel.create(userWithHashedPassword);
  },

  update: async (userId, userData) => {
    if (userData.UserType !== undefined && !validateRole(userData.UserType)) {
      throw new Error("Invalid user role specified");
    }

    if (userData.Password) {
      const hashedPassword = await bcrypt.hash(userData.Password, saltRounds);
      userData = {
        ...userData,
        Password: hashedPassword,
      };
    }
    return await userModel.update(userId, userData);
  },

  getAll: async () => {
    return await userModel.getAll();
  },

  getById: async (userId) => {
    return await userModel.getById(userId);
  },

  getByUsername: async (userName) => {
    return await userModel.getByUsername(userName);
  },

  delete: async (userId) => {
    return await userModel.delete(userId);
  },
};

module.exports = userService;
