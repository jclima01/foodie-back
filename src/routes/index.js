const { Router } = require('express');
// Importar todos los routers;
const recipeRouter = require('./RecipeRoute.js');
const dietRouter = require('./DietRoute.js');


const mainRouter = Router();

// Configurar los routers

mainRouter.use('/recipes', recipeRouter);
mainRouter.use('/diets', dietRouter);



module.exports = mainRouter;
