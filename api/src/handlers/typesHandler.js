const { getAllTypes } = require("../controllers/typesController");

const getTypes = async (req, res) => {
    try{
        const allTypes = await getAllTypes();
        res.status(200).json(allTypes);
    } catch (error){
        res.status(500).json({error: error.message});
    }
};

module.exports = {getTypes};