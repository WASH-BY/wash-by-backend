const Recipe = require("../models/RecipeModal");
const AysncHandler = require("../middleware/AsyncHandler");
const APIFeatures = require("../utils/APIFeatures");
const recipeController = {
  getAllRecipe: async (req, res) => {
    try {
      const products = new APIFeatures(Recipe.find(), req.query)
        .paginating()
        .sorting()
        .searching()
        .filtering();

      const result = await Promise.allSettled([
        products.query,
        Recipe.countDocuments(), //count number of products.
      ]);

      const RecipeData =
        result[0].status === "fulfilled" ? result[0].value : [];
      const count = result[1].status === "fulfilled" ? result[1].value : 0;

      return res.status(200).json({ RecipeData, count });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getRecipeById: async (req, res) => {
    try {
      let recipeExists = await Recipe.findById(req.params.id)
        .populate("createdBy", "name email")
        .select("-updatedAt -__v");
      if (!recipeExists) {
        return res
          .status(400)
          .json({ success: false, message: "Recipe not found" });
      }

      res.status(200).json({ success: true, data: recipeExists });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  createRecipe: async (req, res, next) => {
    try {
      const {
        recipe_id,
        name,
        description,
        rating,
        cookingTime,
        spiceLevel,
        cuisine,
        fat,
        calorie,
        protien,
        allergens,
        ingredients,
        carbohydrate,
        whyHaveIt,
        vegFlag,
        containsEgg,
        recipeAvailableStartDate,
        recipeAvailableEndDate,
      } = req.body;
      // const userD = await User.findById(req.user.id).select("id name");

      const ifProductExists = await Recipe.findOne({ recipe_id });

      if (ifProductExists)
        return res
          .status(400)
          .json({ success: false, message: "This recipe already exists" });

      let newRecipe = await Recipe.create({
        recipe_id,
        RecipeName: name.toLowerCase(),
        description,
        rating,
        cookingTime,
        spiceLevel,
        cuisine,
        fat,
        calorie,
        protien,
        allergens,
        ingredients,
        carbohydrate,
        whyHaveIt,
        vegFlag,
        containsEgg,
        recipeAvailableStartDate,
        recipeAvailableEndDate,
        createdBy: req.user.id,
      });
      // newRecipe = { ...newRecipe, userD };

      // console.log(newRecipe);
      res.status(201).json({ success: true, data: newRecipe });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  updateRecipe: async (req, res) => {
    try {
      let recipeExists = await Recipe.findById({ _id: req.params.id });
      if (!recipeExists) {
        return res
          .status(400)
          .json({ success: false, message: "Recipe not found" });
      }
      const updateRecipe = await Recipe.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      ).select("-updatedAt -__v");

      res.status(200).json({ success: true, data: updateRecipe });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteRecipe: AysncHandler(async (req, res) => {
    let recipeExists = await Recipe.findById({ _id: req.params.id });

    if (!recipeExists) {
      return res
        .status(400)
        .json({ success: false, message: "Recipe not found" });
    }
    await Recipe.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: [] });
  }),
};

module.exports = recipeController;
