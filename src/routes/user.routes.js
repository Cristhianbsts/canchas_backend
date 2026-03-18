import { Router } from "express";
import { check } from "express-validator";
import {
  activeUser,
  getUser,
  suspendUser,
} from "../controllers/user.controller.js";
import { handleValidationErrors } from "../middlewares/error.middleware.js";
import { userExistsById } from "../middlewares/login.middleware.js";
import {authenticate} from "../middlewares/token.middleware.js"
import { validarRolAdmin } from "../middlewares/rol.middleware.js";

const router = Router();

router.get("/", getUser);

router.patch(
  "/:id/activate", authenticate, validarRolAdmin,
  [
    check("id", "NO es un id valido").isMongoId().custom(userExistsById),
    handleValidationErrors,
  ],
  activeUser,
);

router.patch(
  "/:id/suspend", authenticate, validarRolAdmin,
  [
    check("id", "NO es un id valido").isMongoId().custom(userExistsById),
    handleValidationErrors,
  ],
  suspendUser,
);

export default router;
