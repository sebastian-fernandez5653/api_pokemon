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
            include: {
                attributes: ["name"],
                model: Types,
    //Para que al buscar los types solo me devuelva el name
                through: {
                    attributes: [],
                },
            }
        });

        // Obtiene todas las pokemons de la API y aplica cleanArray a cada uno
        const { results } = (await axios.get("https://pokeapi.co/api/v2/pokemon?limit=10")).data;

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
                id: id
            },
            include: {
                attributes: ["name"],
                model: Types,
                through: {
                    attributes: [],
                },
            }
        });
        return pokemonByBDD || `No se encontro ningun pokemon con el id ${id}`;
    }
};

const searchByName = async (name) => {
    //Busca todos los pokemones que coincidan con el mismo nombre pasado por query
    const { results } = (await axios.get("https://pokeapi.co/api/v2/pokemon?limit=10")).data;

    //Filtra a el pokemon que coincida con el nombre enviado 
    const pokemonsFiltered = results.filter((pokemon) => pokemon.name === name);

    //Accede mediante la propiedad url de la aplicacion a los datos del pokemon encontrado
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
        include: {
            attributes: ["name"],
            model: Types,
            through: {
                attributes: [],
            },
        }
    });
    // Si no se encontro ningun pokemon con ese nombre ni en la api, ni en la BDD
    if(!pokemonsApi[0] && !pokemon[0]) return `No se encontro ningun pokemon con el nombre: ${name}`
    
    return [...pokemonsApi, ...pokemon];
};

const createPokemon = async (name, image, hp, attack, defense, speed, height, weight, types) => {
    try {
        // Verifico si me llegaron todos los datos
        if (!name || !hp || !defense || !attack || !speed || !height || !weight || !image || !types) {
            throw new Error("Faltan datos por agregar");
        }

        // Buscar o crear el Pokémon y obtener el resultado como un arreglo [pokemon, created]
        const [pokemon, created] = await Pokemons.findOrCreate({
            where: { name, hp, defense, attack, speed, height, weight, image }
        });

        // Verificar si se creó un nuevo Pokémon
        if (!created) return "Este pokemon ya existe";

        // Busco los tipos en la BDD
        const typesNames = types.map(type => type.name);
        const pokemonTypes = await Types.findAll({ where: { name: typesNames } });

        // Asocio los tipos al Pokémon
        await pokemon.setTypes(pokemonTypes);

        //Busco el pokemon que se creo 
        const pokemonCreated = Pokemons.findOne({
            where: {
                name: name,
                image: image,
            },
            include: {
                attributes: ["name"],
                model: Types,
                through: {
                    attributes: [],
                },
            }
        });

        return pokemonCreated

    } catch (error) {
        throw new Error("Error al crear el Pokémon:", error.message);
    }
};

module.exports = { searchById, searchByName, getAllPokemons, createPokemon };
