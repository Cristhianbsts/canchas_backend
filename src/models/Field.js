import { Schema, model } from "mongoose";

const FieldSchema = Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,    
        },
        pricePerHour: {
            type: Number,
            required: true,
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
);

export default model("Field", FieldSchema);