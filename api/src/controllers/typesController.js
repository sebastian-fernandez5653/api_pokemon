const axios = require("axios");
const { Types } = require("../db");

const getAllTypes = async () => {
    const allTypes = await Types.findAll();
    // Si no tiene ningun tipo cargado en la BDD que las cree
    
    if (!allTypes.length) {
        try {

    // Obtener todos los tipos de dietas de las recetas
            const { results } = (await axios.get("https://pokeapi.co/api/v2/type")).data;
    // Limpio los tipos por nombre 
            const pokeTypes = results.map((e) => {
                return { name: e.name }
            });
    // Crear las dietas en la base de datos
            await Types.bulkCreate(pokeTypes);
            return allTypes;

        } catch (error) {
            console.error("Error al obtener los types desde la API:", error.message);
        }
    } else {
    // Si ya tiene los tipos cargados en la BDD
        console.log('Tipos cargados de la base de datos');
        return allTypes;
    }
};

module.exports = { getAllTypes };