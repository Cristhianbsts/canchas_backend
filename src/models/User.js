import {Schema, model} from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: [ true, "El Número de celular es obligatorio"],
            trim: true,    
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        active: {
            type: Boolean,
            default: true,
        }
    },
    {
        timestamps: true,
    },
);



UserSchema.pre("save", async function () {
    if (!this.isModified("password")){
        return;
    }
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});




UserSchema.methods.comparePassword = function (userPassword) {
    return bcrypt.compareSync(userPassword, this.password); 
};

export default model("User", UserSchema);
