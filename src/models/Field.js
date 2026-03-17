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
    image: {
      type: String,
      trim: true,
      default: "",
    },
    isDeleted:{
      type:Boolean,
      default:false
    }
  },
  {
    timestamps: true,
  },
);

export default model("Field", FieldSchema);
