import { Router } from "express";
import { getFields, createField, updateField, deleteField } from "../controllers/field.controller.js";
import { validateCreateField, validateUpdateField, validateDeleteField } from "../middlewares/validate.middleware.js";

const router = Router();

router.get("/", getFields);

router.post("/", validateCreateField, createField);

router.put("/:id", validateUpdateField, updateField);

router.delete("/:id", validateDeleteField, deleteField);

export default router;