const { getAllorder, getOneOrder } = require("../Controller/orderController");
const { userAuth } = require("../Middlewares/middlewares");

const router = require("express").Router();

router.post("/orders", userAuth, getAllorder);
router.post("/order/:id", userAuth, getOneOrder);

module.exports = router;
