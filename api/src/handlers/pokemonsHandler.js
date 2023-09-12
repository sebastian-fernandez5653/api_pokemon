const {searchById, searchByName, getAllPokemons, createPokemon} = require("../controllers/pokemonContoller")

const searchPokemonById = async (req, res) => {
const { id } = req.params;
    //Me fijo si el id pasado es de la bdd o de la api
    const source = isNaN(id) ? "bdd" : "api" 
    try {
        const pokemonsById = await searchById(id, source)
        res.status(200).json(pokemonsById);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const searchPokemonByName = async (req, res) => {
    const { name } = req.query
    try {
    //si me llega un nombre ejecuto la funcion para buscarlo
        if(name){
        const pokemonByName = await searchByName(name);
        if (!pokemonByName) res.status(404).json({ message: "Nombre de pokemon no encontrado" });
        res.status(200).json(pokemonByName);
        }

    //si no me llego un nombre por query que me entregue todos los pokemones 
        const allPokemons = await getAllPokemons();
        res.status(200).json(allPokemons)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const createPokemones = async (req, res) => {
    const { name, image, hp, attack, defense, speed, height, weight, pokemonId, types } = req.body;
    if(!name) 'Faltan datos por enviar';
    try {
    //Creo un personaje en mi base de datos con todas las props enviadas por body
        const creationPokemon = await createPokemon(name, image, hp, attack, defense, speed, height, weight, pokemonId, types )
        res.status(200).json(creationPokemon)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {searchPokemonById, searchPokemonByName, createPokemones};