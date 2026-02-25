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
            enum: ["user", "admin", "superadmin"],
            default: "user",
        },
        active: {
            type: Boolean,
            default: true,
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
        verificationCode: {
            type: String,
        },
        verificationCodeExpires: {
            type: Date,
        },
    },
    {
        timestamps: true,
    },
);

// Encriptación de la contraseña

UserSchema.pre("save", async function () {
    if (!this.isModified("password")){
        return;
    }
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Generamos el código de verificación de 6 digitos

UserSchema.methods.generateVerificationCode = function () {
    //código de 6 digitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    this.verificationCode = code;
    this.verificationCodeExpires = Date.now() + 15 * 60 * 1000; //15 minutos
    return code;
};

// Comparar las contraseñas (no es una función asincrona y se usa compareSync)
UserSchema.methods.comparePassword = function (userPassword) {
    return bcrypt.compareSync(userPassword, this.password); //devuelve un booleano
};

export default model("User", UserSchema);