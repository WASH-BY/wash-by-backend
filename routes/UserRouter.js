// USER ROUTES

const express = require("express");
const UserController = require("../controllers/userController");
const auth = require("../middleware/auth");
const userRouter = express.Router();

userRouter.route("/getAllUsers").get(auth, UserController.getAllUsers);
userRouter.route("/getUserById/:id").get(auth, UserController.getUserById);
userRouter.route("/logout").get(auth, UserController.logOut);
userRouter.route("/register").post(UserController.register);
userRouter.route("/login").post(UserController.login);
userRouter.route("/refresh_token").post(UserController.getAcessToken);
userRouter.route("/updateUser/:id").put(auth, UserController.updateUser);
userRouter.route("/deleteUser/:id").delete(auth, UserController.deleteUser);
userRouter.route("/follow/:id").patch(auth, UserController.follow);
userRouter.route("/unfollow/:id").patch(auth, UserController.unfollow);
module.exports = userRouter;
