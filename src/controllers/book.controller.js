import Book from "../models/Book.js";
import Field from "../models/Field.js";
import { startOfDay, endOfDay, isBefore, isAfter, addDays,} from "date-fns";

const getAvailableTimes = async (req, res, next) => {
    try {
        const { field, date } = req.query;

        const times = ["18:00","19:00","20:00","21:00","22:00","23:00"];

        if (!date) {
            return res.status(400).json({
                ok: false,
                message: "La fecha es obligatoria"
            });
        }

        const realDate = new Date(date)

        if (isNaN(realDate.getTime())) {
            return res.status(400).json({
                ok: false,
                message: "Fecha inválida"
            });
        }

        const realField = await Field.findById(field);
        if (!realField || !realField.active) {
            return res.status(404).json({
                ok:false,
                message: "No existe la cancha"
            })
        }

        const startDay = startOfDay(new Date(date));
        const endDay = endOfDay(new Date(date));

        const bookings = await Book.find({
            field, 
            date: {
                $gte: startDay,
                $lte: endDay
            },
            status: { $ne: "Cancelada" }
        });

        const reservedTimes = bookings.map(b => b.time);

        const availableTimes = times.filter(
            time => !reservedTimes.includes(time)
        );

        res.json({
            ok: true,
            availableTimes
            });

    } catch (error) {
        res.status(500).json({
            ok:false,
            error: error.message
        })
    }
};

const createBooking = async (req, res, next)=>{
    try {
        const {field, date, time} = req.body;
        const userId = req.user._id;

        if (!date || !time) {
            return res.status(400).json({
                ok: false,
                message: "Fecha y hora son obligatorias"
            });
        }

        const bookingDate = new Date(`${date}T${time}:00`);

        if (isNaN(bookingDate.getTime())) {
            return res.status(400).json({
                ok: false,
                message: "Fecha u hora inválida"
            });
        }

        // Verificar que la cancha exista
        const realField = await Field.findById(field);
        if (!realField || !realField.active) {
            return res.status(404).json({
                ok:false,
                message: "No existe la cancha"
            })
        }

        // Verificar que no sea en un dia ya pasado
        const before = isBefore(bookingDate, new Date())

        if (before) {
            return res.status(400).json({
                ok:false,
                message: "La fecha ya ha pasado"
            })
        }

        // Verificar que la hora este dentro del plazo permitido
        const opening = new Date(`${date}T18:00:00`);
        const closing = new Date(`${date}T00:00:00`);
        closing.setDate(closing.getDate() + 1);

        if (isBefore(bookingDate, opening) || !isBefore(bookingDate, closing)) {
            return res.status(400).json({
                ok: false,
                message: "La cancha no está abierta a la hora solicitada"
            });
        }

        // Verificar que no sea en un dia a mas de 30 dias despues
        const limitOfDays = addDays(new Date(), 30)

        if(isAfter(bookingDate, limitOfDays)){
            return res.status(400).json({
                ok:false,
                message: "La fecha aún no está disponible"
            })
        }

        // Verificar que no exista ya una reserva
        const realBook = await Book.findOne({
            field,
            date,
            time,
            status:{
            $ne: "Cancelada"
            }
        })

        if (realBook){
            return res.status(409).json({
                ok: false,
                message: "Ya hay una reserva para ese día y hora"
            })
        }

        // Modificar una reserva ya hecha
        const bookDone = await Book.findOne({
            field,
            date,
            time,
            status: "Cancelada"
        })

        if(bookDone){
            bookDone.user = userId,
            bookDone.status = "Pendiente"

            await bookDone.save()

            return res.status(201).json({
                ok: true,
                message: "La reserva ha sido creada",
                data: bookDone
            })
        }

        const created = await new Book({
            user: userId,
            field,
            date,
            time,
            status: "Pendiente"
        })

        await created.save()

        return res.status(201).json({
            ok: true,
            message: "La reserva ha sido creada",
            data: created
        })

    } catch (error) {
        return res.status(500).json({
            ok:false,
            error: error.message
        })
    }

    
};

const getBookings = async (req, res, next)=>{
    // Verificar lapso de tiempo
    try {
        const books = await Book.find({})
        return res.status(200).json({
            ok: true,
            message: "Información enviada correctamente",
            data: books
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        })
    }
};

const getMyBookings = async (req, res, next)=>{
    try {
        const userId = req.user._id;
        const books = await Book.find({ user: userId, date: {$gte: new Date()}}).sort({_id: -1}).limit(720)

        return res.status(200).json({
            ok: true,
            message: "Información enviada correctamente",
            data: books
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        })
    }
};

const getBookingsByIdAndDate = async (req, res, next)=>{
    try {
        const {field, date} = req.query;

        const startDay = startOfDay(new Date(date));
        const endDay = endOfDay(new Date(date));

        const books = await Book.find({
            field,
            date: {
                $gte: startDay,
                $lte: endDay
            }
        }).sort({_id:-1});

        return res.status(200).json({
            ok: true,
            message: "Información enviada correctamente",
            data: books
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        })
    }
};

const confirmBooking = async (req, res, next) => {
    try {
        
    } catch (error) {
        
    }
};

const cancelBooking = async (req, res, next)=>{
    try {
        const {id} = req.params;

        const bookExists = await Book.findById(id);
            if (!bookExists) {
                return res.status(404).json({
                    ok:false,
                    message: "No existe la reserva"
                })
            }

        const alreadyCancelled = await Book.findById(id)

        if(alreadyCancelled.status === "Cancelada"){
            return res.status(400).json({
                ok: false,
                message: "La reserva ya está cancelada"
            })
        }

        await Book.findByIdAndUpdate(id, { status: "Cancelada" });

        res.status(200).json({
            ok: true,
            message: "Reserva cancelada correctamente"
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        })
    }
};

const deleteBooking = async (req, res, next)=>{
    try {
        const {id} = req.params;

        const bookExists = await Book.findById(id);
            if (!bookExists) {
                return res.status(404).json({
                    ok:false,
                    message: "La reserva no se encontró o no existe"
                })
            }

        await Book.findByIdAndDelete({_id: id})

        return res.status(200).json({
            ok: false,
            message: "Reserva eliminada de la base de datos"
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        })
    }
};

export {getAvailableTimes, createBooking, getBookings, getMyBookings, getBookingsByIdAndDate, confirmBooking, cancelBooking, deleteBooking}

