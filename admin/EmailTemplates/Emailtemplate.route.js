const { Router } = require("express");
const { AddTemplate } = require("./EmailTemplate.controller");
const { auth } = require("../../Middlewares/middlewares");

const router = Router();
//  For Add Template
router.post("/addTemplate", auth, AddTemplate);

module.exports = router;
