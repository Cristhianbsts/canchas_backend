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
    isDeleted: { 
      type: Boolean, 
      default: false },
    image: {
      type: String,
      trim: true,
      default: "",
    },
<<<<<<< HEAD
    isDeleted:{
      type:Boolean,
      default:false
    }
=======
     isDeleted: {
    type: Boolean,
    default: false
  }
>>>>>>> 85d4e933607b9a5b1a3158ad6ef9a3eeecceb713
  },
  {
    timestamps: true,
  },
);

export default model("Field", FieldSchema);