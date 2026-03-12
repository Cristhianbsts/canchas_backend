import nodemailer from "nodemailer"
import { validationResult } from "express-validator";

export const createTransporter = ()=>{
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,

        },
    });
}

const sendEmail = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok:false,
            errors: errors.mapped()
        });
    }
    const { nombre, email, telefono, mensaje } = req.body;
    const transporter = createTransporter()
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_OWNER,
        subject: `Nuevo mensaje de ${nombre}`,
        html: `<h1>Nuevo mensaje de ${nombre}</h1>
        <h3>Datos:</h3>
        <ul style:"list-style:none">
            <li><p><strong>Nombre:</strong> ${nombre}</p></li>
            <li><p><strong>Email:</strong> ${email}</p></li>
            <li><p><strong>Teléfono:</strong> ${telefono}</p></li>
            <li><p><strong>Mensaje:</strong> ${mensaje}</p></li>
        </ul>
        `
    };
    try {
        await transporter.sendMail(mailOptions)
        res.status(200).json({
            ok: true,
            message: "Email enviado correctamente"
        })
    } catch (error) {
        res.status(500).json({
            ok:false,
            error: error.message
        })
    }
};

export {sendEmail}