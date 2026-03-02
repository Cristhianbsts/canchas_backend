import { Schema, model } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
    autoIndex: true,
  }
);

// Unique index: name must be unique ONLY when status === true
CategorySchema.index(
  { name: 1 },
  { unique: true, partialFilterExpression: { status: true } }
);

export default model("Category", CategorySchema);