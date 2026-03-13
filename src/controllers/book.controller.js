import Book from "../models/Book.js";


const getBookTimes = async (req,res)=>{
     
    const {fieldId,date} = req.body
    try {
        
        const  existingBooking = await Book.findOne({field:fieldId, date:date}).sort({_id:-1});

       if(!existingBooking){
         const newBooking = new Book({
             field:fieldId,
             date,
         });
          newBooking.save()
         return res.status(200).json({
            ok:true,
            msg:newBooking
         })
       }

       return res.status(200).json({
           ok:true,
           msg: existingBooking
       })

    } catch (error) {
        
    }
}

const reserveCourt = async (req,res)=>{
    
    const {fieldId,date, time, userId,status} = req.body;

    try {
    
      const  existingBooking = await Book.findOne({field:fieldId, date:date}).sort({_id:-1});
    
         if(existingBooking){
            switch (time){
               case 18 : existingBooking.time18hs = {status,user:userId}; break; 
               case 19 : existingBooking.time19hs = {status,user:userId}; break;
               case 20 : existingBooking.time20hs = {status,user:userId}; break;
               case 21 : existingBooking.time21hs = {status,user:userId}; break;
               case 22 : existingBooking.time22hs = {status,user:userId}; break;
               case 23 : existingBooking.time23hs = {status,user:userId}; break;
            }
            await Book.updateOne(
                {_id: existingBooking._id},{ $set:existingBooking}
            );
            return res.status(200).json({
                ok:true,
                msg:existingBooking
            })
         }
    } catch (error) {
    
    }    
}

export {getBookTimes,reserveCourt};