import  User  from "../models/User.js";


//listar usuarios

const getUser = async (req, res) =>{
    try {
        const users = await User.find().select("-password");
        
        res.status(200).json({
            ok: true,
            users
        });


    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Error al obtener usuarios",
            error: error.message
        });
    }
};

// activar usuario
const activeUser = async ( req, res) => {
    try {
        const {id} = req.params;
        
        const userUpdate = await User.findByIdAndUpdate (
            id,
            { active : true},
             { new: true }
        ).select(" -password")

        if (!userUpdate){
            return res.status(404).json({
                ok: false,
                message: "Usuario no encontrado"
            });
        }

        res.status(200).json({
            ok: true,
            message: ` El usuario se activo  correctamente.`
        })
     

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Error al activar el usuario",
            error: error.message
        });
    }
};


// suspender/eliminar usuarios

const suspendUser = async ( req, res) => {
    try {
        const {id} = req.params;
        
        const userDelete = await User.findByIdAndUpdate (
            id,
            { active : false},
             { new: true }
        ).select(" -password")

        if (!userDelete){
            return res.status(404).json({
                ok: false,
                message: "Usuario no encontrado"
            });
        }

        res.status(200).json({
            ok: true,
            message: ` El usuario se elimino correctamente.`
        })
     

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Error al suspender el usuario",
            error: error.message
        });
    }
};

export {getUser,activeUser,suspendUser}