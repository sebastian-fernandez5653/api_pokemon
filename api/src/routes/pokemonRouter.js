const { Router } = require("express");
const pokemonRouter = Router();

const { searchPokemonById, searchPokemonByName, createPokemones } = require("../handlers/pokemonsHandler");


pokemonRouter.get("/:id", searchPokemonById)
pokemonRouter.get("/", searchPokemonByName)
pokemonRouter.post("/", createPokemones)

module.exports = pokemonRouter;