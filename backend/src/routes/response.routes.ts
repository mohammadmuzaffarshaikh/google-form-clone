import express from "express";
import {
  addResponse,
  getAllResponses,
  getSpecificResponse,
} from "../controllers/response.controller";

const router = express.Router();

router.post("/", addResponse);
router.get("/:formId", getAllResponses);
router.get("/:formId/:responseId", getSpecificResponse);

export default router;
