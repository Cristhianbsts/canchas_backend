import { check,validationResult } from "express-validator";
import User from "../models/User.js";

const handleErrorsValidation = (req, res , next )=>{
      const errors = validationResult(req);
      if(!errors.isEmpty()){
        return res.status(400).json({
            ok:false,
            msg: errors.array()
        })}
        next()
    }



 const formRegisterValidation = ()=>[
     check('username')
     .notEmpty().withMessage('Debe ingresar algun nombre de usuario')
     .trim()
     .isLength({min:5,max:20}).withMessage('El nombre de usuario debe ser de entre 5 y 20 caracteres')
     .escape()
     .custom( async (username,{req})=>{
          req.userExist = await User.findOne({username:username});
          if( req.userExist){
            throw new Error("El nombre de usuario ya existe");
        }
        return true;     
     }),
     check('email')
     .notEmpty().withMessage('Debe ingresar algun mail')
     .trim()
     .isEmail().normalizeEmail().withMessage('Correo no valido')
     .custom( async (email,{req})=>{
      const  emailExist = await User.findOne({email})
        if(!req.userExist && emailExist){
            throw new Error("El mail ingresado ya esta asociado a otra cuenta")
        }
     }),
    check('password')
    .notEmpty().withMessage('Debe ingresar alguna contraseña')
    .trim()
    .isStrongPassword({
        minLength:10,
        minUppercase:1,
        minLowercase:1,
        minNumbers:1,
        minSymbols:1
    }).withMessage('La contraseña debe tener al menos 10 caracteres, una mayúscula, una minúscula, un número y un símbolo')
    .escape(),
    check('phoneNumber')
    .notEmpty().withMessage('Debe ingresar algun numero')
    .trim()
    .isNumeric()
    .isLength({min:10,max:10})
    .custom( async (phoneNumber,{req})=>{
      const  phoneNumberExist = await User.findOne({phoneNumber})
        if(!req.userExist && phoneNumberExist){
            throw new Error("El numero de telefono ingresado ya esta asociado a otra cuenta")
        }
     })
    ,
    handleErrorsValidation
 ]  

 export {formRegisterValidation};