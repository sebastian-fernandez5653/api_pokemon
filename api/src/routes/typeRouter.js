const { Router } = require("express");
const { getAllTypes } = require("../controllers/typesController");
const { getTypes } = require("../handlers/typesHandler");

const typesRouter = Router();

typesRouter.get("/", getTypes)

getAllTypes()

module.exports = typesRouter;
