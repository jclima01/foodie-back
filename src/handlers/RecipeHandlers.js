const {
  getRecipeFromDB,
  getRecipeFromAPI,
  getRecipeByQuery,
  postRecipe,
  getAllRecipes,
} = require("../controllers/RecipeController");

const getRecipeHandler = async (req, res) => {
  const { idRecipe } = req.params;
  try {
    if (isNaN(idRecipe)) {
      const recipe = await getRecipeFromDB(idRecipe);
      res.status(200).json(recipe);
    } else {
      const recipe = await getRecipeFromAPI(idRecipe);
      res.status(200).json(recipe);
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};
const getRecipesHandler = async (req, res) => {
  const { query } = req.query;

  try {
    const result = query
      ? await getRecipeByQuery(query)
      : await getAllRecipes();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};
const postRecipeHandler = async (req, res) => {
  const { diets, title, image, summary, healthScore, steps } = req.body;
  try {
    const newRecipe = await postRecipe(
      diets,
      title,
      image,
      summary,
      healthScore,
      steps
    );

    res.status(200).json(newRecipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  postRecipeHandler,
  getRecipeHandler,
  getRecipesHandler,
};
