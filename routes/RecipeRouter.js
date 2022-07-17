const express = require("express");
const recipeRouter = express.Router();
const recipeController = require("../controllers/recipeController");
const auth = require("../middleware/auth");

recipeRouter.route("/getAllRecipes").get(auth, recipeController.getAllRecipe);
recipeRouter
  .route("/getRecipeById/:id")
  .get(auth, recipeController.getRecipeById);
recipeRouter.route("/createRecipe").post(auth, recipeController.createRecipe);
recipeRouter
  .route("/updateRecipe/:id")
  .patch(auth, recipeController.updateRecipe);
recipeRouter
  .route("/deleteRecipe/:id")
  .delete(auth, recipeController.deleteRecipe);

module.exports = recipeRouter;
