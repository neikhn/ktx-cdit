const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { UserRoles } = require("../helpers/roleHelper");
const saltRounds = 10;

const validateRole = (roleId) => {
  return Object.values(UserRoles).includes(roleId);
};

const userService = {
  authenticate: async (email, password) => {
    const user = await userModel.getByEmail(email);
    if (!user) {
      return null; 
    }

    const passwordMatch = await bcrypt.compare(password, user.Password);
    if (passwordMatch) {
      return user; 
    } else {
      return null; 
    }
  },

  create: async (userData, transaction = null) => {
    try {
      if (!validateRole(userData.UserType)) {
        throw new Error("Invalid user role specified");
      }

      const hashedPassword = await bcrypt.hash(userData.Password, saltRounds);

      const userDataToCreate = {
        ...userData,
        Password: hashedPassword,
      };

      return await userModel.create(userDataToCreate, transaction);
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
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

  getByEmail: async (email) => {
    return await userModel.getByEmail(email);
  },

  delete: async (userId) => {
    return await userModel.delete(userId);
  },
};

module.exports = userService;
