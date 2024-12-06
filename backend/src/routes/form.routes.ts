import express from "express";
import {
  createForm,
  deleteForm,
  getAllForms,
  getForm,
  updateForm,
} from "../controllers/form.controller";

const router = express.Router();

router.post("/", createForm);
router.get("/", getAllForms);
router.put("/:id", updateForm);
router.delete("/:id", deleteForm);
router.get("/:id", getForm);

export default router;
