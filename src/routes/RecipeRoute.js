const { Router } = require("express");
const recipeRouter = Router();
require("dotenv").config();

const {
  getRecipeHandler,
  postRecipeHandler,
  getRecipesHandler
} = require("../handlers/RecipeHandlers.js");



recipeRouter.get("/", getRecipesHandler);
recipeRouter.get("/:idRecipe", getRecipeHandler);

recipeRouter.post("/", postRecipeHandler);

module.exports = recipeRouter;
