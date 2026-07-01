import express from "express";
import { createCategory, getCategories, deleteCategory } from "../controllers/category.controller.js";

const router = express.Router();

router.get("/get", getCategories);
router.post("/create", createCategory);
router.delete("/:id", deleteCategory);

export default router;