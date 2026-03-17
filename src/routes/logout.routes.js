import { Router } from "express";
import { authenticate } from "../middlewares/token.middleware.js";

const router = Router();

router.post("/", authenticate, (req, res) => {

  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });

  return res.status(200).json({
    ok: true,
    message: "Sesión cerrada exitosamente!",
  });

});

export default router;