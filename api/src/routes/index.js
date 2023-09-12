const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

const pokemonRouter = require("./pokemonRouter");
const typeRouter = require("./typeRouter");


// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use("/pokemons", pokemonRouter);
router.use("/types", typeRouter);

module.exports = router;
