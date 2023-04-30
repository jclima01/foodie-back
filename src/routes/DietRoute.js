const { Router } = require("express");
const router = Router();
const {
  postDietsHandler,
  getDietsHandler,
} = require("../handlers/DietHandler");


router.post("/", postDietsHandler);
router.get("/", getDietsHandler);


module.exports = router;
