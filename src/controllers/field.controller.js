import Field from "../models/Field.js";

//obtener las canchas

const getFields = async (req, res) => {
    try {
        const { limite = 10, desde = 0} = req.query;

        const [total, fields] = await Promise.all([
            Field.countDocuments ({ isDeleted: false}),
            Field.find({ isDeleted: false})
            .limit(Number(limite))
            .skip(Number(desde))
        ]);
    res.status(200).json({
        ok: true,
        total,
        fields
    });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Error al obtener las canchas",
            error: error.message
        });
        
    }
};

//crear una cancha
const createField = async (req, res) => {
    try {
        const {pricePerHour} = req.body;
        const name = req.body.name.toUpperCase();

        const fieldDb = await Field.findOne({ name });
        if(fieldDb){
            return res.status(400).json({
                ok: false,
            message: `La cancha ${name} ya existe en el complejo.`,
            });
        }

        const newField = new Field({
            name: name,
            pricePerHour
        });

        await newField.save();

        res.status(201).json({
            ok: true,
            message: `La cancha ${name} se creó con éxito.`,
            field: newField
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Error al crear la cancha.",
            error: error.message
        });        
    }
};

//actualizar una Cancha
const updateField = async ( req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        
        if (data.name){
            data.name = data.name.toUpperCase();
        }

        const fieldUpdated = await Field.findByIdAndUpdate(id, data, { new : true});

        if (!fieldUpdated) {
            return res.status(404).json({
                ok: false,
                message: "No se encontró la cancha con ese ID"
            });
        }

        res.status(200).json({
            ok: true,
            message: "Cancha actualizada correctamente",
            field: fieldUpdated
        });

    } catch (error) {
        res.status(500).json({
            ok:false,
            message: "Error al actualizar la cancha",
            error: error.message
        });
    }
};

//Borrar una cancha
const deleteField = async (req, res) => {
    try {
        const { id } = req.params;

        const fieldDeleted = await Field.findByIdAndUpdate(id, { isDeleted: true }, { new: true});

        if (!fieldDeleted){
            return res.status(404).json({
                ok:false,
                message: "No se encontró la cancha con ese ID."
            });
        }

        res.status(200).json({
            ok:true,
            message: "Cancha dada de baja correctamente",
            field: fieldDeleted
        });


    } catch (error) {
        res.status(500).json({
            ok:false,
            message: "Error al eliminar la cancha",
            error: error.message
        });
    }
};



export { getFields, createField, updateField, deleteField };