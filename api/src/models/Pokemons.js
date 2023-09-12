const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.

module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('Pokemons', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
    },
    hp: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    attack: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    defense: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    speed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    height: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    weight: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    created: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  },
    {
      timestamps: false,
    });
};
