const { postDiets, getDiets } = require("../controllers/DietController");

const postDietsHandler = async (req, res) => {
  try {
    const newDiet = await postDiets();
    res.status(200).json(newDiet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getDietsHandler = async (req, res) => {
  try {
    const diets = await getDiets();
    res.status(200).json(diets);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  postDietsHandler,
  getDietsHandler
};
