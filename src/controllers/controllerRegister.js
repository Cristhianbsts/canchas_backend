import User from "../models/User.js";



const handleControllerRegister =async (req,res)=>{
   try {
     return  res.status(200).json({
        ok:true,
        msg: "todo okay"
     })
   } catch (error) {
    return res.status(500).json({
        ok:false,
        msg: error
    })
   }
}


export {handleControllerRegister};