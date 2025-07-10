const { Router } = require("express");
const fxn = require("./EmailTemplate.controller");
const { auth } = require("../../Middlewares/middlewares");

const router = Router();
//  For Add Template
router.post("/addTemplate", auth, fxn.AddTemplate);

router.post("/getAllEmailTemplate", auth, fxn.getAllTemplate);

router.put("/deleteTemplate/:id", auth, fxn.deleteTemplate);

// router.post("/updateTemplate/:id", auth, fxn.updateTemplate);

module.exports = router;
