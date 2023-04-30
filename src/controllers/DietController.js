const axios = require("axios");
const { Diet } = require("../db");
require("dotenv").config();
const API_KEY = process.env.API_KEY;
exports.postDiets = async () => {
  const { data } = await axios.get(
    `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=100&addRecipeInformation=true`
  );
  const dietsArray = [];
  data.results.forEach((result) => {
    result.diets.forEach((diet) => {
      if (!dietsArray.includes(diet)) {
        dietsArray.push(diet);
      }
    });
  });
  const diets = dietsArray.map((diet) => {
    return {
      name: diet,
    };
  });

  const d = await Diet.bulkCreate(diets);

  return d;
};
exports.getDiets = async () => {
  const diets = await Diet.findAll();
  if (diets.length === 0) {
    const { data } = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=100&addRecipeInformation=true`
    );
    const dietsArrayFromApi = [];
    data.results.forEach((result) => {
      result.diets.forEach((diet) => {
        if (!dietsArrayFromApi.includes(diet)) {
          dietsArrayFromApi.push(diet);
        }
      });
    });
    const dietsArrayWhitObjects = dietsArrayFromApi.map((diet) => {
      return {
        name: diet,
      };
    });

    const d = await Diet.bulkCreate(dietsArrayWhitObjects);
    return d;
  } else {
    return diets;
  }
};
