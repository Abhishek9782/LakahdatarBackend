const { Router } = require("express");
const router = Router();
const { upload } = require("../../Middlewares/multer");
const { auth } = require("../../Middlewares/middlewares");
const fxn = require("./product.controller");
//  Product Handle
router.post("/productadd", auth, upload.single("src"), fxn.productAdd);

router.put("/deleteproduct/:id", auth, fxn.productDelete);

router.post(
  "/updateproduct/:id",
  auth,
  upload.single("src"),
  fxn.updateProduct
);

router.post("/getAllproduct", auth, fxn.getAllProducts);

//  to delete product
router.put("/deleteproduct/:id", auth, fxn.deleteProduct);

module.exports = router;
