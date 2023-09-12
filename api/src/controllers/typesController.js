const axios = require("axios");
const { Types } = require("../db");

const getAllTypes = async () => {
    // Función para obtener las dietas de la API y guardarlas en la base de datos
    try {
        const { results } = (await axios.get("https://pokeapi.co/api/v2/type")).data;

        const pokeTypes = results.map(pokemon => pokemon.name).flat(); // Obtener todos los tipos de dietas de las recetas
        const uniqueTypes = Array.from(new Set(pokeTypes)); // Eliminar duplicados

        // Crear las dietas en la base de datos
        const createTypes = uniqueTypes.map(name => Types.create({ name }))
        Promise.all(createTypes);

        const allTypes = await Types.findAll();

        console.log("Typos de pokemones precargadas en la base de datos:", uniqueTypes);
        return allTypes
    } catch (error) {
        console.error("Error al obtener los types desde la API:", error.message);
    }
};

module.exports = { getAllTypes };