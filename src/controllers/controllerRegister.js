import User from "../models/User.js";



const handleControllerRegister = async (req,res)=>{
   try {
     
      const {username, email, phoneNumber, password} = req.body
        
      const datos =  await User.create({
        username,
        email,
        phoneNumber,
        password
     })
      
     return  res.status(200).json({
        ok:true,
        msg: datos
     })
   } catch (error) {
    return res.status(500).json({
        ok:false,
        msg: error
    })
   }
}


export {handleControllerRegister};