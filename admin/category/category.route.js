const { Router } = require("express");
const { auth } = require("../../Middlewares/middlewares");
const fxn = require("./category.controller");
const router = Router();

router.post("/create-category", auth, fxn.createCategory);
router.post("/update-category", auth, fxn.updateCategory);
router.post("/delete-category", auth, fxn.deleteCategory);
router.post("/chnagestatus-category", auth, fxn.categoryStatusUpdate);

module.exports = router;
