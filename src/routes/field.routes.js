import { Router } from "express";
import { getFields, createField, updateField, deleteField } from "../controllers/field.controller.js";
import { validateCreateField, validateUpdateField, validateDeleteField } from "../middlewares/field.middleware.js";
import {authenticate} from "../middlewares/token.middleware.js"
import { validarRolAdmin } from "../middlewares/rol.middleware.js";

const router = Router();

router.get("/", getFields);

router.post("/",authenticate, validarRolAdmin, validateCreateField, createField);

router.put("/:id",authenticate, validarRolAdmin, validateUpdateField, updateField);

router.delete("/:id",authenticate, validarRolAdmin, validateDeleteField, deleteField);

export default router;