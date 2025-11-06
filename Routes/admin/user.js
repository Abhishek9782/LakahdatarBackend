const router = require("express").Router();
const { auth } = require("../../Middlewares/middlewares");
const fxn = require("../../Controller/admin/userController");

router.get("/allusers", auth, fxn.getAllusers);
router.post("/changeuserStatus", auth, fxn.changeUserStatus);

module.exports = router;
