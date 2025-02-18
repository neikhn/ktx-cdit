const userService = require("../services/userService");
const sessionService = require("../services/sessionService");

const userController = {
  register: async (req, res) => {
    try {
      const userData = req.body; // take data from body
      const newUser = await userService.createUser(userData);
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
      const user = await userService.authenticateUser(username, password);

      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }
      const sessionId = await sessionService.createSession(user.UserID);

      res.cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      }); 
      return res
        .status(200)
        .json({
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
};

module.exports = userController;
