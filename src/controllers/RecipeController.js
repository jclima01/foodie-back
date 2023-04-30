const axios = require("axios");
const { Recipe } = require("../db");
const { Op } = require("sequelize");
const { Diet } = require("../db");
require("dotenv").config();
const API_KEY = process.env.API_KEY;

exports.getAllRecipes = async () => {
  const dbResults = await Recipe.findAll({
    include: {
      model: Diet,
      attributes: ["name"],
      through: {
        attributes: [],
      },
    },
  });
  const dbRes = dbResults.map((recipe) => {
    return {
      id: recipe.id,
      title: recipe.title,
      summary: recipe.summary,
      healthScore: recipe.healthScore,
      image: recipe.image,
      diets: recipe.Diets.map((diet) => diet.name),
      steps: JSON.parse(recipe.steps),
      source: "db"
    };
  });

  const { data } = await axios.get(
    `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=100&addRecipeInformation=true`
  );
  const { results } = data;
  const apiResults = results.map((recipe) => {
    return {
      id: recipe.id,
      title: recipe.title,
      summary: recipe.summary,
      healthScore: recipe.healthScore,
      image: recipe.image,
      diets: recipe.diets,
      steps: recipe.analyzedInstructions[0]?.steps.map((e) => {
        return {
          number: e.number,
          step: e.step,
        };
      }),
      source: "api"
    };
  });

  return [...dbRes, ...apiResults];
};

exports.getRecipeFromAPI = async (idRecipe) => {
  const { data } = await axios.get(
    `https://api.spoonacular.com/recipes/${idRecipe}/information?apiKey=${API_KEY}`
  );
  const {
    id,
    title,
    summary,
    healthScore,
    analyzedInstructions,
    image,
    diets,
  } = data;

  return {
    id,
    title,
    summary,
    healthScore,
    steps: analyzedInstructions[0]?.steps.map((e) => {
      return {
        number: e.number,
        step: e.step,
      };
    }),
    image,
    diets,
    source: "api"
  };
};
exports.getRecipeFromDB = async (idRecipe) => {
  try {
    const recipe = await Recipe.findByPk(idRecipe, {
      include: {
        model: Diet,
        attributes: ["name"],
        through: {
          attributes: [],
        },
      },
    });

    return {
      id: recipe.id,
      title: recipe.title,
      summary: recipe.summary,
      healthScore: recipe.healthScore,
      steps: JSON.parse(recipe.steps),
      image: recipe.image,
      diets: recipe.Diets.map((diet) => diet.name),
      source: "db"
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getRecipeByQuery = async (searchKey) => {
  try {
    const { data } = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch?number=100&apiKey=${API_KEY}&addRecipeInformation=true`
    );
    const { results } = data;
    const apiResults = results.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        summary: recipe.summary,
        healthScore: recipe.healthScore,
        image: recipe.image,
        diets: recipe.diets,
        steps: recipe.analyzedInstructions[0]?.steps.map((e) => {
          return {
            number: e.number,
            step: e.step,
          };
        }),
        source: "api"
      };
    });
    const filteredApiResults = apiResults.filter((recipe) =>
      recipe.title.toLowerCase().includes(searchKey.toLowerCase())
    );
    const recipesFromDB = await Recipe.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${searchKey}%` } },
          { summary: { [Op.like]: `%${searchKey}%` } },
        ],
      },
      include: {
        model: Diet,
        attributes: ["name"],
        through: {
          attributes: [],
        },
      },
    });
    const recipesdb = recipesFromDB.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        summary: recipe.summary,
        healthScore: recipe.healthScore,
        steps: JSON.parse(recipe.steps),
        image: recipe.image,
        diets: recipe.Diets.map((diet) => diet.name),
        source: "db"
      };
    });
    return [...recipesdb, ...filteredApiResults];
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.postRecipe = async (
  diets,
  title,
  image,
  summary,
  healthScore,
  steps
) => {
  try {
    const newRecipe = await Recipe.create({
      title,
      image,
      summary,
      healthScore,
      steps: JSON.stringify(steps)
    });

    const arrDiets = diets.map((diet) => diet.id);

    await newRecipe.addDiet(arrDiets);

    return newRecipe;
  } catch (error) {
    throw new Error(error.message);
  }
};
