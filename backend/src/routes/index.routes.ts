import express from "express";
import formRouter from "./form.routes";
import responseRouter from "./response.routes";

const router = express.Router();
router.use("/forms", formRouter);
router.use("/responses", responseRouter);

export default router;
