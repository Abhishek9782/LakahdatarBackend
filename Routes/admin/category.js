const { Router } = require("express");
const { auth } = require("../../Middlewares/middlewares");
const fxn = require("../../Controller/admin/categorController");
const { upload } = require("../../Middlewares/multer");
const router = Router();

router.post("/create-category", auth, upload.single("src"), fxn.createCategory);
router.post("/update-category", auth, fxn.updateCategory);
router.post("/delete-category", auth, fxn.deleteCategory);
router.post("/chnagestatus-category", auth, fxn.categoryStatusUpdate);
router.get("/get-all-categories", auth, fxn.getAllCategories);

module.exports = router;
