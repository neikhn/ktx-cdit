const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userService = {
  authenticateUser: async (username, password) => {
    const user = await userModel.getUserByUsername(username);
    if (!user) {
      return null; // User not found
    }

    const passwordMatch = await bcrypt.compare(password, user.MatKhau);
    if (passwordMatch) {
      return user; // Successful
    } else {
      return null; // Incorrect
    }
  },

  createUser: async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.MatKhau, saltRounds);
    const userWithHashedPassword = {
      ...userData,
      MatKhau: hashedPassword,
    };
    return await userModel.createUser(userWithHashedPassword);
  },
};

module.exports = userService;
