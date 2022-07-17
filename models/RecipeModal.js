const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema(
  {
    recipe_id: {
      type: "string",
      unique: true,
      trim: true,
      default: Date.now(),
    },
    RecipeName: {
      type: "string",
      required: [true, "Please enter the recipe name"],
      minLength: 3,
    },
    description: {
      type: "string",
      required: [true, "Please enter the description"],
      minLength: 10,
    },
    rating: {
      type: "number",
      default: 4.6,
    },
    cookingTime: {
      type: "number",
      required: [true, "Please enter the cooking time"],
    },
    spiceLevel: {
      type: "string",
      enum: ["mild", "moderate", "spicy"],
      default: "moderate",
    },
    cuisine: {
      type: "string",
      required: [true, "Please enter the origin(country) of the cuisine "],
    },
    fat: {
      type: "number",
    },
    calories: {
      type: "number",
    },
    protien: {
      type: "number",
    },
    allergens: {
      type: "string",
    },
    ingredients: {
      type: "string",
      required: [true, "Please enter the ingredients for the recipe"],
    },
    carbohydrate: {
      type: "string",
    },
    whyHaveIt: {
      type: "string",
      required: [true, "Please enter the benefits of having the recipe"],
    },
    vegFlag: {
      type: "boolean",
      required: [
        true,
        "Please enter true if the recipe is vegetarian or 'false' if non-vegetarian",
      ],
    },
    containsEgg: {
      type: "boolean",
      required: [
        true,
        "Please enter true if the recipe contains EGG else false",
      ],
    },
    recipeAvailableStartDate: {
      type: "string",
      default: Date.now,
    },
    recipeAvailableEndDate: {
      type: "string",
      required: [
        true,
        "Please the end date through which the recipe is available",
      ],
    },
    category: 
      {
        type: String,
        enum: {
          values: [
            "indian",
            "north indian",
            "south indian",
            "chinese",
            "japanese",
            "italian",
            "continental",
            "spanish",
            "mediterranean",
            "greek",
            "french",
          ],
          message: "{VALUE} is not supported",
        },
        required: [
          true,
          "Please Select the appropriate cuisine for the created recipe",
        ],
      },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: Date.now }
);
// RecipeSchema.index({ RecipeName: "text" });

const RecipeModel = mongoose.model("RecipeModel", RecipeSchema);

// RecipeModel.createIndexes({ RecipeName: "text" });

module.exports = RecipeModel;
