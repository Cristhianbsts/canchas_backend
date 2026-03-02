import { Schema, model } from "mongoose";

const BookSchema = Schema (
    {
        // user: {
        //     type: Schema.Types.ObjectId,
        //     ref: "User",
        //     required: [true, "El usuario es obligatorio para realizar una reserva"],
        // },
        field: {
            //type: Schema.Types.ObjectId,
           // ref: "Field",
           type:String,
            required: [true, "Debes elegir una cancha"],
        },
        date: {
            type:Date,
            required: [true, "La fecha de reserva es obligatoria"],
        },
        // time: {
        //     type: String,
        //     required: [true, "El horario de reserva es obligatorio"],
        //     enum: ["18:00","19:00","20:00","21:00","22:00","23:00"],
        // },
        // status: {
        //     type: String,
        //     enum: ["Pendiente","Confirmada","Cancelada"],
        //     default: "Cancelada",
        // },
        time18hs: {
            status:{ type: String,
             enum: ["Pendiente","Confirmada","Cancelada"],
             default: "Cancelada"},
             user:{
                 type: Schema.Types.ObjectId,
                 ref: "User",
             }
        },
         time19hs: {
             status:{ type: String,
             enum: ["Pendiente","Confirmada","Cancelada"],
             default: "Cancelada"},
             user:{
                 type: Schema.Types.ObjectId,
                 ref: "User",
             }
        },
         time20hs: {
            status:{ type: String,
             enum: ["Pendiente","Confirmada","Cancelada"],
             default: "Cancelada"},
             user:{
                 type: Schema.Types.ObjectId,
                 ref: "User",
             }
        },
         time21hs: {
             status:{ type: String,
             enum: ["Pendiente","Confirmada","Cancelada"],
             default: "Cancelada"},
             user:{
                 type: Schema.Types.ObjectId,
                 ref: "User",
             }
        },
         time22hs: {
            status:{ type: String,
             enum: ["Pendiente","Confirmada","Cancelada"],
             default: "Cancelada"},
             user:{
                 type: Schema.Types.ObjectId,
                 ref: "User",
             }
        },
         time23hs: {
            status:{ type: String,
             enum: ["Pendiente","Confirmada","Cancelada"],
             default: "Cancelada"},
             user:{
                 type: Schema.Types.ObjectId,
                 ref: "User",
             }
        }},
    {
        timestamps: true,
    }
);

export default model("Book", BookSchema);