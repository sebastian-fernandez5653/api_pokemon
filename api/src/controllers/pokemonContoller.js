const axios = require("axios");
const { Pokemons, Types } = require("../db");
const { Op } = require("sequelize");

//Limpia el array que envia la api, para que solo devuelva los elementos que necesita
const cleanArray = (e) => ({
    id: e.id,
    name: e.name,
    image: e.sprites.other.dream_world.front_default,
    hp: e.stats[0].base_stat,
    attack: e.stats[1].base_stat,
    defense: e.stats[2].base_stat,
    speed: e.stats[3].base_stat,
    height: e.height,
    weight: e.weight,
    types: e.types.map((e) => {
        return {
            name: e.type.name,
        };
    }),
    created: false,
});

const getAllPokemons = async () => {
    // Obtiene todas las pokemones de la BDD los cuales contengan conectado el modelo Type
    try {
        const pokemonsBDD = await Pokemons.findAll({
            include:{
                attributes: ["name"],
                model: Types,
                through: {
                attributes: [],
                },
            }
        });

        // Obtiene todas las pokemons de la API y aplica cleanArray a cada uno
        const {results} = (await axios.get("https://pokeapi.co/api/v2/pokemon?limit=10")).data;

        //Accedo a la propiedad URL del objeto para que pueda despejar el objeto entero con la funcion cleanArray
        const pokemonPromises = results.map((pokemon) =>
            axios.get(pokemon.url).then((response) => cleanArray(response.data))
        );
        const pokemonsApi = await Promise.all(pokemonPromises);

        // Combina los pokemones de la BDD y los de la API y los devuelve
        return [...pokemonsBDD, ...pokemonsApi];
    } catch (error) {
        return { error: error.message };
    }
};

const searchById = async (id, source) => {
    //Si el id viene de la api que me haga una peticion buscando un id que coincida
    if (source === "api") {
        try {
            const results = await axios.get(
                `https://pokeapi.co/api/v2/pokemon/${id}`
            );
            return cleanArray(results.data);
        } catch (error) {
            return { error: error.message };
        }

    //Si el id pertenece a la bdd que me busque un id que coincida y que busque uno que este conectado con el modelo Type
    } else if (source === "bdd") {
        const pokemonByBDD = await Pokemons.findOne({
            where: {
                id: idSearch
            },
            include:{
                attributes: ["name"],
                model: Types,
            }
        });
        return pokemonByBDD || `No se encontro ningun pokemon con el id ${id}`;
    }
};

const searchByName = async (name) => {
    //Busca todos los pokemones que coincidan con el mismo nombre pasado por query
    const {results} = (await axios.get("https://pokeapi.co/api/v2/pokemon?limit=10")).data;
    const pokemonsFiltered = results.filter((pokemon) => pokemon.name === name);
    const pokemonPromises = pokemonsFiltered.map((pokemon) =>
    axios.get(pokemon.url).then((response) => cleanArray(response.data))
);
const pokemonsApi = await Promise.all(pokemonPromises);

    // Busca en la BDD algun pokemon con el mismo nombre enviado por query
    // Busca con el operador "iLike" el name ignorando si tiene mayúsculas o minúsculas
    const pokemon = await Pokemons.findAll({
        where: {
            name: {
                [Op.iLike]: `%${name}%`,
            },
        },
    });
    return [...pokemonsApi, ...pokemon];
};

const createPokemon = async (name, image, hp, attack, defense, speed, height, weight, types) => {
    if (!name || !image || !hp || !attack || !defense) {
        return { error: "Faltan datos por ingresar" };
    }
        if(!name, !hp, !defense, !attack, !speed, !height, !weight, !image, !types){
            return "Faltan datos por agregar";
        }

        const pokemon= await Pokemons.findOrCreate({
            where: {name, hp, defense, attack, speed, height, weight, image, types}
        });

        const pokemontype= await Types.findAll({where:{name: types}});
        await pokemon.setTypes(pokemontype)
};

module.exports = { searchById, searchByName, getAllPokemons, createPokemon };
