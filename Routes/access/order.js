const orderController = require("../../Controller/access/orderController");
const { userAuth } = require("../../Middlewares/middlewares");

const router = require("express").Router();

router.post("/orders", userAuth, orderController.getAllorder);
router.post("/order/:id", userAuth, orderController.getOneOrder);

module.exports = router;
