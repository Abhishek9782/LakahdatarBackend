const { Router } = require("express");
const { AddTemplate, getAllTemplate } = require("./EmailTemplate.controller");
const { auth } = require("../../Middlewares/middlewares");

const router = Router();
//  For Add Template
router.post("/addTemplate", auth, AddTemplate);

router.post("/getAllEmailTemplate", auth, getAllTemplate);
module.exports = router;
